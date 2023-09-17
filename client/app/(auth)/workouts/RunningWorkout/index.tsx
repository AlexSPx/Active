import React, { useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TabsParamList } from "../../AuthRoutes";
import { View, FlatList } from "react-native";
import { Button, useTheme } from "react-native-paper";
import useErrorDialog from "../../../../components/modals/ErrorInformationDialog";
import MainView from "../../../../components/MainView";
import { useWorkout } from "../../../../contexts/WorkoutContext";
import { useAuthQuery } from "../../../../utils/authQuery";
import Exercise from "./Exercise";
import { useRecoilState } from "recoil";
import {
  currentExercisesAtom,
  useResetRunningWorkout,
} from "../../../../contexts/RunnigWorkoutContext";

export default function RunningWorkout({
  navigation,
}: NativeStackScreenProps<TabsParamList>) {
  const { makeRequest, error } = useAuthQuery();

  const resetWorkout = useResetRunningWorkout();

  const [exercises, setExercises] = useRecoilState(currentExercisesAtom);

  const { colors } = useTheme();
  const [ErrorDialog, showDialog] = useErrorDialog();

  const handleResetWorkout = () => {
    resetWorkout();
    navigation.navigate("workouts");
  };

  // const finishWorkout = useCallback(async () => {
  //   if (!runningWorkout) return;
  //   if (!checkFinished()) {
  //     showDialog("You have unfinished workouts!");
  //     return;
  //   }

  //   const body = {
  //     workout_id: runningWorkout.workout_id,
  //     exercises: runningWorkout.exercises.map((exercise) => {
  //       return {
  //         exercise_id: exercise.exercise_id,
  //         reps: exercise.reps,
  //         weight: exercise.weight,
  //       };
  //     }),
  //   };

  //   await makeRequest("/workout/record", "POST", body);
  //   if (!error) {
  //     handleResetWorkout();
  //   }
  // }, [runningWorkout, checkFinished, makeRequest, error, handleResetWorkout]);

  const renderExerciseListFooter = useCallback(() => {
    return (
      <View style={{ marginBottom: 40, marginTop: 10 }}>
        <Button
          mode="contained-tonal"
          style={{ marginTop: 12 }}
          // onPress={finishWorkout}
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
  }, []);

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
