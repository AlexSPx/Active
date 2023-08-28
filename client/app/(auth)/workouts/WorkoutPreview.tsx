import React from "react";
import { Button, Text, useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TabsParamList } from "../AuthRoutes";
import { ScrollView } from "react-native-gesture-handler";
import { useWorkout } from "../../../contexts/WorkoutContext";
import useConfirmationDialog from "../../../components/modals/ConfirmationDialog";
import MainView from "../../../components/MainView";

type Props = NativeStackScreenProps<TabsParamList, "WorkoutPreview">;

export default function WorkoutPreview({ route, navigation }: Props) {
  const { workout } = route.params;
  if (!workout) return null;

  const { colors } = useTheme();
  const { startWorkout, isWorkoutRunning } = useWorkout();

  const setWorkout = () => {
    startWorkout({
      title: workout.workout.title,
      workout_id: workout.workout.id,
      exercises: [
        ...workout.structure_record.exercises.map((exercise) => {
          return {
            id: exercise.id,
            exercise_id: exercise.exercise_id,
            title: exercise.title,
            prevReps: exercise.reps,
            reps: exercise.reps,
            prevWeight: exercise.weight,
            weight: exercise.weight,
            finished: new Array(exercise.reps.length).fill(false),
          };
        }),
      ],
    });

    navigation.navigate("RunningWorkout");
  };

  const [ConfirmationDialog, showDialog] = useConfirmationDialog(setWorkout);

  const handleStartWorkout = () => {
    if (isWorkoutRunning())
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
