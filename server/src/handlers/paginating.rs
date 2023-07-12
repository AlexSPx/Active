use diesel::{
    query_builder::{AstPass, Query, QueryFragment, QueryId},
    sql_types::{BigInt, Integer},
    pg::Pg,
    PgConnection,
    QueryResult,
    query_dsl::LoadQuery,
    RunQueryDsl,
};

const DEFAULT_PER_PAGE: i32 = 10;

#[derive(Debug, Clone, Copy, QueryId)]
pub struct Paginated<T> {
    query: T,
    page: i32,
    per_page: i32,
    offset: i64,
}

pub trait Paginate: Sized {
    fn paginate(self, page: i32) -> Paginated<Self>;
}

impl<T> Paginate for T {
    fn paginate(self, page: i32) -> Paginated<Self> {
        Paginated {
            query: self,
            per_page: DEFAULT_PER_PAGE,
            page,
            offset: ((page - 1) as i64) * (DEFAULT_PER_PAGE as i64),
        }
    }
}

impl<T> Paginated<T> {
    pub fn per_page(self, per_page: i32) -> Self {
        Paginated {
            per_page,
            offset: ((self.page - 1) as i64) * (per_page as i64),
            ..self
        }
    }

    pub fn load_and_count_pages<'a, U>(self, conn: &mut PgConnection) -> QueryResult<(Vec<U>, i32)>
    where
        Self: LoadQuery<'a, PgConnection, (U, i64)>,
    {
        let per_page = self.per_page;
        let results = self.load::<(U, i64)>(conn)?;
        let total = results.get(0).map(|x| x.1).unwrap_or(0);
        let records = results.into_iter().map(|x| x.0).collect();
        let total_pages = ((total as f64) / (per_page as f64)).ceil() as i32;
        Ok((records, total_pages))
    }
}

impl<T: Query> Query for Paginated<T> {
    type SqlType = (T::SqlType, BigInt);
}

impl<T> RunQueryDsl<PgConnection> for Paginated<T> {}

impl<T> QueryFragment<Pg> for Paginated<T>
where
    T: QueryFragment<Pg>,
{
    fn walk_ast<'b>(&'b self, mut out: AstPass<'_, 'b, Pg>) -> QueryResult<()> {
        out.push_sql("SELECT *, COUNT(*) OVER () FROM (");
        self.query.walk_ast(out.reborrow())?;
        out.push_sql(") t LIMIT ");
        out.push_bind_param::<Integer, _>(&self.per_page)?;
        out.push_sql(" OFFSET ");
        out.push_bind_param::<BigInt, _>(&self.offset)?;
        Ok(())
    }
}
