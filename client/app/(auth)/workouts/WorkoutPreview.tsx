import React from "react";
import { Button, Text, useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TabsParamList } from "../AuthRoutes";
import { ScrollView } from "react-native-gesture-handler";
import useConfirmationDialog from "../../../components/modals/ConfirmationDialog";
import MainView from "../../../components/MainView";
import {
  currentExercisesAtom,
  currentWorkoutAtom,
  isWorkoutRunningSelector,
} from "../../../contexts/RunnigWorkoutContext";
import { useRecoilValue, useSetRecoilState } from "recoil";

type Props = NativeStackScreenProps<TabsParamList, "WorkoutPreview">;

export default function WorkoutPreview({ route, navigation }: Props) {
  const { workout } = route.params;
  if (!workout) return null;

  const { colors } = useTheme();

  const setExercises = useSetRecoilState(currentExercisesAtom);
  const setWorkoutDetails = useSetRecoilState(currentWorkoutAtom);

  const isWorkoutRunning = useRecoilValue(isWorkoutRunningSelector);
  const setWorkout = () => {
    setWorkoutDetails(() => ({
      title: workout.workout.title,
      workout_id: workout.workout.id,
    }));

    setExercises(() => [
      ...workout.structure_record.exercises.map((exercise) => {
        return {
          exercise_id: exercise.exercise_id,
          title: exercise.title,
          sets: exercise.reps.map((reps, idx) => ({
            reps,
            weight: exercise.weight[idx],
            finished: false,
          })),
        };
      }),
    ]);
    navigation.navigate("RunningWorkout");
  };

  const [ConfirmationDialog, showDialog] = useConfirmationDialog(setWorkout);

  const handleStartWorkout = () => {
    if (isWorkoutRunning)
      showDialog(
        "There is a workout currently running, do you wish to continue?"
      );
    else setWorkout();
  };

  return (
    <MainView colors={colors}>
      <ConfirmationDialog />
      <Text variant="displaySmall" style={{ marginVertical: 12 }}>
        {workout.workout.title}
      </Text>
      <ScrollView>
        {workout.structure_record.exercises.map((exercise) => (
          <Text
            key={exercise.id}
            variant="labelLarge"
            style={{ marginVertical: 4 }}
          >
            {exercise.weight.length} x {exercise.title}
          </Text>
        ))}
      </ScrollView>
      <Button
        mode="contained"
        style={{ marginBottom: 22 }}
        onPress={handleStartWorkout}
      >
        Start workout
      </Button>
    </MainView>
  );
}
