use serde::{Serialize, Deserialize};
use diesel::{Queryable};

#[derive(Debug, Serialize, Deserialize)]
pub enum ExerciseType {
    Strength,
    Plyometrics,
    Cardio,
    Stretching,
    Powerlifting,
    Strongman,
    #[serde(rename = "Olympic Weightlifting")]
    OlympicWeightlifting,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum BodyPart {
    Abdominals,
    Adductors,
    Abductors,
    Biceps,
    Calves,
    Chest,
    Forearms,
    Glutes,
    Hamstrings,
    Lats,
    #[serde(rename = "Lower Back")]
    LowerBack,
    #[serde(rename = "Middle Back")]
    MiddleBack,
    Traps,
    Neck,
    Quadriceps,
    Shoulders,
    Triceps,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum Equipment {
    Bands,
    Barbell,
    Kettlebells,
    Dumbbell,
    Other,
    Cable,
    Machine,
    #[serde(rename = "Body Only")]
    BodyOnly,
    #[serde(rename = "Medicine Ball")]
    MedicineBall,
    #[serde(rename = "Exercise Ball")]
    ExerciseBall,
    #[serde(rename = "Foam Roll")]
    FoamRoll,
    #[serde(rename = "EZ Curl Bar")]
    EZCurlBar,
    None,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum Level {
    Intermediate,
    Beginner,
    Expert,
}

#[derive(Queryable, Serialize)]
pub struct Exercise {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub exercise_type: String,
    pub body_part: String,
    pub equipment: String,
    pub level: String,
}

#[derive(Queryable, Serialize)]
pub struct ExerciseShell {
    pub id: i32,
    pub title: String, 
}  