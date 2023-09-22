import { atom } from "recoil";

export interface ExerciseSet {
  reps: string;
  weight: string;
}

export interface WorkoutExerciseCreate {
  exercise_id: number;
  title: string;
  sets: ExerciseSet[];
}

export const createWorkoutAtom = atom<string>({
  key: "createWorkout",
  default: "Workout",
});

export const createExercisesAtom = atom<WorkoutExerciseCreate[]>({
  key: "createExercises",
  default: [],
});
