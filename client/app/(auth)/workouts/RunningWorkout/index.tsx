import React, { useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TabsParamList } from "../../AuthRoutes";
import { View, FlatList } from "react-native";
import { Button, useTheme } from "react-native-paper";
import useErrorDialog from "../../../../components/ErrorInformationDialog";
import MainView from "../../../../components/MainView";
import { useWorkout } from "../../../../contexts/WorkoutContext";
import { useAuthQuery } from "../../../../utils/authQuery";
import { Exercise } from "./Exercise";

export default function RunningWorkout({
  navigation,
}: NativeStackScreenProps<TabsParamList>) {
  const {
    runningWorkout,
    addSet,
    toggleFinish,
    checkFinished,
    resetWorkout,
    editValue,
    deleteSet,
  } = useWorkout();
  const { makeRequest, error } = useAuthQuery();

  const { colors } = useTheme();
  const [ErrorDialog, showDialog] = useErrorDialog();

  const handleResetWorkout = () => {
    resetWorkout();
    navigation.navigate("workouts");
  };

  const finishWorkout = useCallback(async () => {
    if (!runningWorkout) return;
    if (!checkFinished()) {
      showDialog("You have unfinished workouts!");
      return;
    }

    const body = {
      workout_id: runningWorkout.workout_id,
      exercises: runningWorkout.exercises.map((exercise) => {
        return {
          exercise_id: exercise.exercise_id,
          reps: exercise.reps,
          weight: exercise.weight,
        };
      }),
    };

    await makeRequest("/workout/record", "POST", body);
    if (!error) {
      handleResetWorkout();
    }
  }, [runningWorkout, checkFinished, makeRequest, error, handleResetWorkout]);

  const renderExerciseListFooter = useCallback(() => {
    return (
      <View style={{ marginBottom: 40, marginTop: 10 }}>
        <Button
          mode="contained-tonal"
          style={{ marginTop: 12 }}
          onPress={finishWorkout}
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
  }, [colors, finishWorkout, handleResetWorkout]);

  return (
    <MainView colors={colors}>
      <ErrorDialog />
      <FlatList
        data={runningWorkout?.exercises}
        keyExtractor={(item) => item.exercise_id.toString()}
        renderItem={({ item }) => (
          <Exercise
            exercise={item}
            addSet={addSet}
            deleteSet={deleteSet}
            toggleFinish={toggleFinish}
            editValue={editValue}
          />
        )}
        ListFooterComponent={renderExerciseListFooter}
      />
    </MainView>
  );
}
