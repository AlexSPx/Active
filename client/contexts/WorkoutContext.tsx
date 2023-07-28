import React, { useState } from "react";

interface WorkoutProps {
    workoutContents: WorkoutContentProps,
    setWorkoutContents: React.Dispatch<React.SetStateAction<WorkoutContentProps>>
}

interface WorkoutContentProps {
    current: WorkoutCurrent | null,
    creating: Workout | null
}

export interface Workout {
    title: string,
    exercises: WorkoutExercise[];
}

export interface WorkoutCurrent {
    title: string,
    workout_id: string,
    exercises: WorkoutExerciseCurrent[];
}

export interface WorkoutExercise {
    exercise_id: number,
    title: string,
    prevReps?: number[],
    prevWeight?: number[],
    reps: number[],
    weight: number[]
}

export type WorkoutExerciseCurrent = WorkoutExercise & {
    id?: number,
    finished: boolean[],
}

export type addSetFunction = (mode: "current" | "creating", exercise_id: number, set: number, reps: number) => void
export type editValueFunction = (mode: "current" | "creating", exercise_id: number, type: "reps" | "weight", id: number, val: number) => void


const WorkoutContext = React.createContext<WorkoutProps | null>(null);

export function useWorkout(){
    const workoutContext = React.useContext(WorkoutContext);

    if (!workoutContext) {
        throw new Error(
          "useCurrentUser has to be used within <CurrentUserContext.Provider>"
        );
      }

    const checkFinished = () => {
        const exercises = workoutContext.workoutContents.current?.exercises;
        if(!exercises) return false;

        return exercises.every(exercise => exercise.finished.includes(false) === false)
    }

    const toggleFinish = (id: number, idx: number) => {
        
        workoutContext.setWorkoutContents(prev => {
            return {
                ...prev,
                current: {
                    ...prev.current!,
                    exercises: [
                        ...prev.current!.exercises.map(exercise => {
                            if(exercise.exercise_id === id){
                                return {
                                    ...exercise,
                                    finished: exercise.finished.map((fn, idxt) => idxt === idx ? !fn : fn)
                                }
                            }
                            return exercise;
                        })
                    ]
                }
            }
        })
    }
      
    const resetWorkout = () => {
        workoutContext.setWorkoutContents(prev => {
            return {
                ...prev,
                current: {title: "", workout_id: "",exercises: []}
            }
        })
    }

    const isWorkoutRunning = () => workoutContext.workoutContents.current!.exercises.length > 0

    const startWorkout = (workout: WorkoutCurrent) => {
        resetWorkout()
        workoutContext.setWorkoutContents(prev => {
            return {
                ...prev,
                current: workout
            }
        })
    }

    const resetCreating = () => {
      workoutContext.setWorkoutContents(prev => {
        return {
            ...prev,
            creating: {
                title: "Workout Template",
                exercises: []
            }
        }
      })  
    }

    const cancelCreating = () => {
        workoutContext.setWorkoutContents(prev => {
          return {
              ...prev,
              creating: {title: "Workout Template", exercises: []}
          }
        })  
      }

    const isCreating = (): boolean => !(workoutContext.workoutContents.creating === null)

    const addExercise = (exercise: WorkoutExercise) => {
        if(!isCreating()) return;

        workoutContext.setWorkoutContents(prev => {
            return {
                ...prev,
                creating: {
                    title: prev.creating!.title,
                    exercises: [
                        ...prev.creating!.exercises.filter(ex => {
                            if(ex.exercise_id === exercise.exercise_id) return;
                            return ex;
                        }),
                        exercise
                    ]
                }
            }
        })
    }

    const addSet: addSetFunction = (mode, exercise_id, reps, weight) => {
        workoutContext.setWorkoutContents(prev => {
            return {
                ...prev,
                [mode]: {
                    ...prev[mode]!,
                    exercises: [
                        ...prev[mode]!.exercises.filter((exercise: WorkoutExerciseCurrent | WorkoutExercise) => {
                            if(exercise.exercise_id === exercise_id){
                                if(mode === "current") {
                                    exercise
                                    return {
                                        ...exercise,
                                        reps: exercise.reps.push(reps),
                                        weight: exercise.weight.push(weight),
                                        finished: (exercise as WorkoutExerciseCurrent).finished.push(false)
                                    }
                                }
                                else return {
                                    ...exercise,
                                    reps: exercise.reps.push(reps),
                                    weight: exercise.weight.push(weight),
                                }
                            }
                            return exercise;
                        })
                    ]
                }
            }
        })        
    }

    const editValue: editValueFunction = (mode, exercise_id, type, id, val) => {       
        if(Number.isNaN(val)) return; 
        workoutContext.setWorkoutContents(prev => {
            return {
                ...prev,
                [mode]: {
                    ...prev[mode]!,
                    exercises: [
                        ...prev[mode]!.exercises.map(exercise => {
                            if(exercise.exercise_id === exercise_id){
                                return {
                                    ...exercise,
                                    [type]: exercise[type].map((ival, idx) => idx === id ? val : ival) 
                                }
                            }
                            return exercise;
                        })
                    ]
                }
            }
        })        
    }

    return {
        workoutInCreation: workoutContext.workoutContents.creating,
        runningWorkout: workoutContext.workoutContents.current,
        resetCreating, cancelCreating, addExercise, isCreating, addSet, editValue,
        startWorkout, resetWorkout, isWorkoutRunning, toggleFinish, checkFinished
    }
}

export function WorkoutProvider({children}: {children: React.ReactNode}){
    const [workoutContents, setWorkoutContents] = useState<WorkoutContentProps>({
        current: {title: "", workout_id: "", exercises: []},
        creating: {title: "Workout Template", exercises: []}
    })


    return (
        <WorkoutContext.Provider
            value={{
                workoutContents,
                setWorkoutContents
            }}
        >
            {children}
        </WorkoutContext.Provider>
    )
}
