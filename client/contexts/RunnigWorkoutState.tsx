import { atom, selector, useSetRecoilState } from "recoil";

interface WorkoutCurrent {
  title: string;
  workout_id: string;
}

interface ExerciseSet {
  reps: string;
  weight: string;
  finished: boolean;
}

type WorkoutExerciseCurrent = {
  exercise_id: number;
  title: string;
  sets: ExerciseSet[];
};

export { WorkoutExerciseCurrent, ExerciseSet, WorkoutCurrent };

export const currentWorkoutAtom = atom<WorkoutCurrent>({
  key: "currentWorkout",
  default: { title: "", workout_id: "" },
});

export const currentExercisesAtom = atom<WorkoutExerciseCurrent[]>({
  key: "currentExercises",
  default: [],
});

export const isWorkoutRunningSelector = selector({
  key: "isWorkoutRunningSelector",
  get: ({ get }) => {
    const exercises = get(currentExercisesAtom);

    return exercises.length > 0;
  },
});

export const checkFinishedSelector = selector({
  key: "checkFinishedSelector",
  get: ({ get }) => {
    const exercises = get(currentExercisesAtom);

    for (const exercise of exercises) {
      for (const set of exercise.sets) {
        if (!set.finished) return false;
      }
    }
    return true;
  },
});

export const useResetRunningWorkout = () => {
  const setDetails = useSetRecoilState(currentWorkoutAtom);
  const setExercises = useSetRecoilState(currentExercisesAtom);

  return function reset() {
    setDetails({ title: "", workout_id: "" });
    setExercises([]);
  };
};
