import React, { useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TabsParamList } from "../../AuthRoutes";
import { View, FlatList } from "react-native";
import { Button, useTheme } from "react-native-paper";
import useErrorDialog from "../../../../components/modals/ErrorInformationDialog";
import MainView from "../../../../components/MainView";
import { useAuthQuery } from "../../../../utils/authQuery";
import Exercise from "./Exercise";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  checkFinishedSelector,
  currentExercisesAtom,
  currentWorkoutAtom,
  useResetRunningWorkout,
} from "../../../../contexts/RunnigWorkoutState";
export default function RunningWorkout({
  navigation,
}: NativeStackScreenProps<TabsParamList>) {
  const { makeRequest, error, isLoading } = useAuthQuery();

  const resetWorkout = useResetRunningWorkout();

  const [workout, _setWorkout] = useRecoilState(currentWorkoutAtom);
  const [exercises, _setExercises] = useRecoilState(currentExercisesAtom);

  const isFinished = useRecoilValue(checkFinishedSelector);

  const { colors } = useTheme();
  const [ErrorDialog, showDialog] = useErrorDialog();

  const handleResetWorkout = () => {
    resetWorkout();
    navigation.navigate("workouts");
  };

  const finishWorkout = async () => {
    if (!isFinished) {
      showDialog("You have unfinished workouts!");
      return;
    }

    const body = {
      workout_id: workout.workout_id,
      exercises: exercises.map((exercise) => {
        const reps: number[] = [];
        const weight: number[] = [];
        const len = exercise.sets.length;

        for (let index = 0; index < len; index++) {
          reps.push(parseInt(exercise.sets[index].reps));
          weight.push(parseFloat(exercise.sets[index].weight));
        }

        return {
          exercise_id: exercise.exercise_id,
          reps,
          weight,
        };
      }),
    };

    await makeRequest("/workout/record", "POST", body);
    if (!error) {
      handleResetWorkout();
    }
  };

  console.log(error);

  const renderExerciseListFooter = useCallback(() => {
    return (
      <View style={{ marginBottom: 40, marginTop: 10 }}>
        <Button
          mode="contained-tonal"
          style={{ marginTop: 12 }}
          onPress={finishWorkout}
          disabled={isLoading}
          loading={isLoading}
        >
          Finish Workout
        </Button>
        <Button
          mode="contained"
          style={{
            marginTop: 12,
            backgroundColor: colors.errorContainer,
          }}
          textColor={colors.error}
          onPress={handleResetWorkout}
        >
          Cancel Workout
        </Button>
      </View>
    );
  }, [isFinished]);

  return (
    <MainView colors={colors}>
      <ErrorDialog />
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.exercise_id.toString()}
        renderItem={({ item, index }) => (
          <Exercise exercise={item} exerciseIndex={index} />
        )}
        ListFooterComponent={renderExerciseListFooter}
      />
    </MainView>
  );
}
