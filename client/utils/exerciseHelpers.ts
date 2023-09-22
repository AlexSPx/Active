import { WorkoutExerciseCreate } from "../contexts/CreateWorkoutState";
import { WorkoutExerciseCurrent } from "../contexts/RunnigWorkoutState";

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
  arr: WorkoutExerciseCurrent[] | WorkoutExerciseCreate[],
  exerciseIdx: number,
  setIdx: number,
  setValue: string
) {
  const newArr = arr.slice();
  const exercise = { ...newArr[exerciseIdx] };
  const set = { ...exercise.sets[setIdx], weight: setValue, finished: false };
  exercise.sets = [
    ...exercise.sets.slice(0, setIdx),
    set,
    ...exercise.sets.slice(setIdx + 1),
  ];
  newArr[exerciseIdx] = exercise;
  return newArr;
}

export function setSetReps(
  arr: WorkoutExerciseCurrent[] | WorkoutExerciseCreate[],
  exerciseIdx: number,
  setIdx: number,
  setReps: string
) {
  const newArr = arr.slice();
  const exercise = { ...newArr[exerciseIdx] };
  const set = { ...exercise.sets[setIdx], reps: setReps, finished: false };
  exercise.sets = [
    ...exercise.sets.slice(0, setIdx),
    set,
    ...exercise.sets.slice(setIdx + 1),
  ];
  newArr[exerciseIdx] = exercise;
  return newArr;
}

export function setSetWeightCreate(
  arr: WorkoutExerciseCreate[],
  exerciseIdx: number,
  setIdx: number,
  setValue: string
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

export function setSetRepsCreate(
  arr: WorkoutExerciseCreate[],
  exerciseIdx: number,
  setIdx: number,
  setReps: string
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
    exercise.sets.length > 0
      ? { ...exercise.sets[exercise.sets.length - 1], finished: false }
      : { weight: "0", reps: "0", finished: false },
  ];
  exercise.sets = sets;
  newArr[exerciseIdx] = exercise;
  return newArr;
}

export function removeSet(
  arr: WorkoutExerciseCurrent[] | WorkoutExerciseCreate[],
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

export function addExercise(
  arr: WorkoutExerciseCurrent[] | WorkoutExerciseCreate[],
  exercise_id: number,
  title: string
) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    if (arr[i].exercise_id === exercise_id) return arr;
  }

  return [...arr, { title, exercise_id, sets: [] }];
}

export function addSetCreate(
  arr: WorkoutExerciseCreate[],
  exerciseIdx: number
) {
  const newArr = arr.slice();
  const exercise = { ...newArr[exerciseIdx] };
  const sets = [
    ...exercise.sets,
    exercise.sets.length > 0
      ? { ...exercise.sets[exercise.sets.length - 1] }
      : { weight: "0", reps: "0" },
  ];
  exercise.sets = sets;
  newArr[exerciseIdx] = exercise;
  return newArr;
}
