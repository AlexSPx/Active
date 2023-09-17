import { atom, selector, useSetRecoilState } from "recoil";

interface WorkoutCurrent {
  title: string;
  workout_id: string;
}

interface ExerciseSet {
  reps: number;
  weight: number;
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

export const useResetRunningWorkout = () => {
  const setDetails = useSetRecoilState(currentWorkoutAtom);
  const setExercises = useSetRecoilState(currentExercisesAtom);

  return function reset() {
    setDetails({ title: "", workout_id: "" });
    setExercises([]);
  };
};

export function toggleFinishExerciseSet(
  arr: WorkoutExerciseCurrent[],
  exerciseIdx: number,
  setIdx: number
) {
  const newArr = [...arr];

  const updatedSet = {
    ...newArr[exerciseIdx].sets[setIdx],
    finished: !newArr[exerciseIdx].sets[setIdx].finished,
  };

  const updatedExercise = {
    ...newArr[exerciseIdx],
    sets: [...newArr[exerciseIdx].sets],
  };

  updatedExercise.sets[setIdx] = updatedSet;

  newArr[exerciseIdx] = updatedExercise;

  return newArr;
}

export function setSetWeight(
  arr: WorkoutExerciseCurrent[],
  exerciseIdx: number,
  setIdx: number,
  setValue: number
) {
  const newArr = arr.slice();
  const exercise = { ...newArr[exerciseIdx] };
  const set = { ...exercise.sets[setIdx], weight: setValue };
  exercise.sets = [
    ...exercise.sets.slice(0, setIdx),
    set,
    ...exercise.sets.slice(setIdx + 1),
  ];
  newArr[exerciseIdx] = exercise;
  return newArr;
}

export function setSetReps(
  arr: WorkoutExerciseCurrent[],
  exerciseIdx: number,
  setIdx: number,
  setReps: number
) {
  const newArr = arr.slice();
  const exercise = { ...newArr[exerciseIdx] };
  const set = { ...exercise.sets[setIdx], reps: setReps };
  exercise.sets = [
    ...exercise.sets.slice(0, setIdx),
    set,
    ...exercise.sets.slice(setIdx + 1),
  ];
  newArr[exerciseIdx] = exercise;
  return newArr;
}

export function addSet(arr: WorkoutExerciseCurrent[], exerciseIdx: number) {
  const newArr = arr.slice();
  const exercise = { ...newArr[exerciseIdx] };
  const sets = [
    ...exercise.sets,
    { ...exercise.sets[exercise.sets.length - 1], finished: false },
  ];
  exercise.sets = sets;
  newArr[exerciseIdx] = exercise;
  return newArr;
}

export function removeSet(
  arr: WorkoutExerciseCurrent[],
  exerciseIdx: number,
  setIdx: number
) {
  const newArr = arr.slice();
  const exercise = { ...newArr[exerciseIdx] };
  const sets = [
    ...exercise.sets.slice(0, setIdx),
    ...exercise.sets.slice(setIdx + 1),
  ];
  exercise.sets = sets;
  newArr[exerciseIdx] = exercise;
  return newArr;
}
