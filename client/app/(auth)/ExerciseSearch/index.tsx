import { createStackNavigator } from "@react-navigation/stack";
import Results from "./Results";
import { useTheme } from "react-native-paper";
import { View } from "react-native";
import SearchBar from "../../../components/SearchBar";
import SearchFilters from "./Filters";
import { useAuthQuery } from "../../../utils/authQuery";
import { buildUrl } from "../../../utils/helpers";
import {
  exerciseSearchQueryAtom,
  exerciseSearchQueryResultsAtom,
} from "../../../contexts/ExerciseSearchState";
import { useRecoilState } from "recoil";

const Stack = createStackNavigator();

export default function ExerciseSearch() {
  const { colors } = useTheme();

  const [query, setQuery] = useRecoilState(exerciseSearchQueryAtom);
  const [exercises, setExercises] = useRecoilState(
    exerciseSearchQueryResultsAtom
  );
  const { makeRequest } = useAuthQuery();

  const getSearchResults = async () => {
    const data = await makeRequest<any>(buildUrl(query.tags, query.name));
    setExercises(data.exercises);
  };
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: "modal",
        headerStyle: {
          backgroundColor: colors.background,
        },
        header: () => (
          <View
            style={{
              marginTop: 30,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.background,
            }}
          >
            <SearchBar
              title={query.name}
              colors={colors}
              setTitle={(t) =>
                setQuery((prev) => ({
                  ...prev,
                  name: t,
                }))
              }
              executeSearch={getSearchResults}
            />
          </View>
        ),
      }}
    >
      <Stack.Screen name="search" component={Results} />
      <Stack.Screen
        name="Filters"
        options={{
          headerShown: false,
        }}
        component={SearchFilters}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
