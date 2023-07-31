import { getItemAsync, setItemAsync } from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";

type MODE = "current" | "creating";

interface WorkoutProps {
  workoutContents: WorkoutContentProps;
  setWorkoutContents: React.Dispatch<React.SetStateAction<WorkoutContentProps>>;
}

interface WorkoutContentProps {
  current: WorkoutCurrent;
  creating: Workout;
}

export interface Workout {
  title: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutCurrent {
  title: string;
  workout_id: string;
  exercises: WorkoutExerciseCurrent[];
}

export interface WorkoutExercise {
  exercise_id: number;
  title: string;
  prevReps?: number[];
  prevWeight?: number[];
  reps: number[];
  weight: number[];
}

export type WorkoutExerciseCurrent = WorkoutExercise & {
  id?: number;
  finished: boolean[];
};

export type addSetProps = (
  mode: MODE,
  exercise_id: number,
  set: number,
  reps: number
) => void;
export type editValueProps = (
  mode: MODE,
  exercise_id: number,
  type: "reps" | "weight",
  id: number,
  val: number
) => void;
export type deleteSetProps = (
  mode: MODE,
  exercise_id: number,
  index: number
) => void;

const WorkoutContext = React.createContext<WorkoutProps | undefined>(undefined);

export function useWorkout() {
  const workoutContext = React.useContext(WorkoutContext);

  if (!workoutContext) {
    throw new Error(
      "useCurrentUser has to be used within <CurrentUserContext.Provider>"
    );
  }

  useEffect(() => {
    const saveToStorage = async () => {
      await setItemAsync(
        "workout-content",
        JSON.stringify(workoutContext.workoutContents)
      );
    };

    saveToStorage();
  }, [workoutContext.workoutContents]);

  const checkFinished = useCallback(() => {
    const exercises = workoutContext.workoutContents.current.exercises;
    return exercises.every((exercise) =>
      exercise.finished.every((fn) => fn === true)
    );
  }, [workoutContext.workoutContents.current.exercises]);

  const toggleFinish = useCallback(
    (id: number, idx: number) => {
      workoutContext.setWorkoutContents((prev) => {
        const current = prev.current;
        if (!current) return prev;

        const updatedExercises = current.exercises.map((exercise) => {
          if (exercise.exercise_id === id) {
            const finished = exercise.finished.map((fn, idxt) =>
              idxt === idx ? !fn : fn
            );
            return { ...exercise, finished };
          }
          return exercise;
        });

        return {
          ...prev,
          current: { ...current, exercises: updatedExercises },
        };
      });
    },
    [workoutContext.setWorkoutContents]
  );

  const resetWorkout = useCallback(() => {
    workoutContext.setWorkoutContents((prev) => ({
      ...prev,
      current: { title: "", workout_id: "", exercises: [] },
    }));
  }, [workoutContext.setWorkoutContents]);

  const isWorkoutRunning = () =>
    workoutContext.workoutContents.current!.exercises.length > 0;

  const startWorkout = useCallback(
    (workout: WorkoutCurrent) => {
      resetWorkout();
      workoutContext.setWorkoutContents((prev) => ({
        ...prev,
        current: workout,
      }));
    },
    [resetWorkout, workoutContext.setWorkoutContents]
  );

  const resetCreating = useCallback(() => {
    workoutContext.setWorkoutContents((prev) => ({
      ...prev,
      creating: {
        title: "Workout Template",
        exercises: [],
      },
    }));
  }, [workoutContext.setWorkoutContents]);

  const cancelCreating = useCallback(() => {
    workoutContext.setWorkoutContents((prev) => ({
      ...prev,
      creating: { title: "Workout Template", exercises: [] },
    }));
  }, [workoutContext.setWorkoutContents]);

  const isCreating = (): boolean =>
    !(workoutContext.workoutContents.creating === null);

  const addExercise = useCallback(
    (exercise: WorkoutExercise) => {
      if (!isCreating()) return;

      workoutContext.setWorkoutContents((prev) => ({
        ...prev,
        creating: {
          title: prev.creating!.title,
          exercises: [
            ...prev.creating!.exercises.filter(
              (ex) => ex.exercise_id !== exercise.exercise_id
            ),
            exercise,
          ],
        },
      }));
    },
    [isCreating, workoutContext.setWorkoutContents]
  );

  const addSet: addSetProps = useCallback(
    (mode, exercise_id, reps, weight) => {
      workoutContext.setWorkoutContents((prev) => {
        return {
          ...prev,
          [mode]: {
            ...prev[mode]!,
            exercises: [
              ...prev[mode]!.exercises.filter(
                (exercise: WorkoutExerciseCurrent | WorkoutExercise) => {
                  if (exercise.exercise_id === exercise_id) {
                    if (mode === "current") {
                      exercise;
                      return {
                        ...exercise,
                        reps: exercise.reps.push(reps),
                        weight: exercise.weight.push(weight),
                        finished: (
                          exercise as WorkoutExerciseCurrent
                        ).finished.push(false),
                      };
                    } else
                      return {
                        ...exercise,
                        reps: exercise.reps.push(reps),
                        weight: exercise.weight.push(weight),
                      };
                  }
                  return exercise;
                }
              ),
            ],
          },
        };
      });
    },
    [workoutContext.setWorkoutContents]
  );

  const editValue: editValueProps = useCallback(
    (mode, exercise_id, type, id, val) => {
      if (Number.isNaN(val)) return;
      workoutContext.setWorkoutContents((prev) => {
        const updatedExercises = prev[mode]!.exercises.map((exercise) => {
          if (exercise.exercise_id === exercise_id) {
            const updatedValue = exercise[type].map((ival, idx) =>
              idx === id ? val : ival
            );
            return { ...exercise, [type]: updatedValue };
          }
          return exercise;
        });

        return {
          ...prev,
          [mode]: { ...prev[mode]!, exercises: updatedExercises },
        };
      });
    },
    [workoutContext.setWorkoutContents]
  );

  const deleteSet: deleteSetProps = useCallback(
    (mode, exercise_id, index) => {
      workoutContext.setWorkoutContents((prev) => {
        const updatedExercises = prev[mode].exercises.map((exercise) => {
          if (exercise.exercise_id === exercise_id) {
            const updatedReps = exercise.reps.filter((_, idx) => idx !== index);
            const updatedWeight = exercise.weight.filter(
              (_, idx) => idx !== index
            );

            if (mode === "current") {
              const updatedFinished = (
                exercise as WorkoutExerciseCurrent
              ).finished.filter((_, idx) => idx !== index);
              return {
                ...exercise,
                reps: updatedReps,
                weight: updatedWeight,
                finished: updatedFinished,
              };
            } else
              return { ...exercise, reps: updatedReps, weight: updatedWeight };
          }
          return exercise;
        });

        return {
          ...prev,
          [mode]: { ...prev[mode], exercises: updatedExercises },
        };
      });
    },
    [workoutContext.setWorkoutContents]
  );

  return {
    workoutInCreation: workoutContext.workoutContents.creating,
    runningWorkout: workoutContext.workoutContents.current,
    resetCreating,
    cancelCreating,
    addExercise,
    isCreating,
    addSet,
    editValue,
    startWorkout,
    resetWorkout,
    isWorkoutRunning,
    toggleFinish,
    checkFinished,
    deleteSet,
  };
}

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [workoutContents, setWorkoutContents] = useState<WorkoutContentProps>({
    current: { title: "", workout_id: "", exercises: [] },
    creating: { title: "Workout Template", exercises: [] },
  });

  useEffect(() => {
    const checkStorage = async () => {
      const value = await getItemAsync("workout-content");
      if (value) {
        setWorkoutContents(JSON.parse(value));
      }
    };

    checkStorage();
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        workoutContents,
        setWorkoutContents,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}
