import { useAuthQuery } from "../../../../utils/authQuery";
import useErrorDialog from "../../../../components/modals/ErrorInformationDialog";
import { Button, TextInput, useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MainView from "../../../../components/MainView";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, View } from "react-native";
import { useRecoilState } from "recoil";
import {
  createExercisesAtom,
  createWorkoutAtom,
} from "../../../../contexts/CreateWorkoutState";
import Exercise from "./Exercise";

export default function CreateExercise({
  navigation,
}: NativeStackScreenProps<any>) {
  const { colors } = useTheme();

  const [ErrorDialog, showDialog] = useErrorDialog();

  const { makeRequest, error } = useAuthQuery();

  const [title, setTitle] = useRecoilState(createWorkoutAtom);
  const [exercises, setExercises] = useRecoilState(createExercisesAtom);

  const cancelCreating = () => {
    setExercises([]);
    setTitle("Workout");
  };

  const handleCreateWorkout = () => {
    if (exercises.length === 0) {
      showDialog("You should have at least one exercise");
      return;
    }

    exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (Number.isNaN(set.reps) || Number.isNaN(set.weight)) {
          showDialog("You have empty values in your exercises");
          return;
        }
      });
    });

    const body = {
      title,
      exercises: exercises.map((exercises) => {
        const weightArr: number[] = [];
        const repsArr: number[] = [];
        exercises.sets.forEach(({ reps, weight }) => {
          weightArr.push(parseFloat(weight));
          repsArr.push(parseInt(reps));
        });

        return {
          title: exercises.title,
          exercise_id: exercises.exercise_id,
          weight: weightArr,
          reps: repsArr,
        };
      }),
    };

    console.log(body.exercises[0]);

    // makeRequest("/workout/create", "POST", body);

    // if (!error) {
    //   cancelCreating();
    //   navigation.navigate("workouts");
    // }
  };

  return (
    <MainView colors={colors}>
      <ErrorDialog />

      <TextInput
        mode="flat"
        style={{
          fontSize: 20,
          backgroundColor: colors.background,
        }}
        outlineStyle={{
          borderRadius: 1200,
        }}
        underlineStyle={{
          borderRadius: 80,
        }}
        underlineColor="transparent"
        placeholder="Enter template name"
        value={title}
        onChangeText={(e) => setTitle(e)}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.exercise_id.toString()}
          renderItem={({ item, index }) => (
            <Exercise exercise={item} exerciseIdx={index} />
          )}
          ListFooterComponent={() => (
            <View>
              <Button
                mode="contained-tonal"
                style={{
                  borderRadius: 10,
                  marginTop: 15,
                }}
                onPress={() => navigation.navigate("ExerciseSearch")}
              >
                Add Exercise
              </Button>

              <View style={{ marginTop: 12 }}>
                <Button
                  mode="contained"
                  style={{
                    borderRadius: 10,
                    opacity: 0.8,
                    marginTop: 15,
                  }}
                  onPress={handleCreateWorkout}
                >
                  Create
                </Button>

                <Button
                  style={{
                    backgroundColor: colors.errorContainer,
                    borderRadius: 10,
                    opacity: 0.8,
                    marginTop: 15,
                  }}
                  textColor={colors.error}
                  onPress={() => {
                    navigation.goBack();
                    cancelCreating();
                  }}
                >
                  Cancel
                </Button>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </MainView>
  );
}
