import React from 'react'
import { MD3Colors } from 'react-native-paper/lib/typescript/src/types'
import { Button } from 'react-native-paper'

export interface Exercise {
    id: number,
    title: string,
    description: string,
    exercise_type: ExerciseType,
    body_part: BodyPart,
    equipment: Equipment,
    level: Level
}

enum ExerciseType {
  Strength = "Strength",
  Plyometrics = "Plyometrics",
  Cardio = "Cardio",
  Stretching = "Stretching",
  Powerlifting = "Powerlifting",
  Strongman = "Strongman",
  OlympicWeightlifting = "Olympic Weightlifting"
}

enum BodyPart {
  Abdominals = "Abdominals",
  Adductors = "Adductors",
  Abductors = "Abductors",
  Biceps = "Biceps",
  Calves = "Calves",
  Chest = "Chest",
  Forearms = "Forearms",
  Glutes = "Glutes",
  Hamstrings = "Hamstrings",
  Lats = "Lats",
  LowerBack = "Lower Back",
  MiddleBack = "Middle Back",
  Traps = "Traps",
  Neck = "Neck",
  Quadriceps = "Quadriceps",
  Shoulders = "Shoulders",
  Triceps = "Triceps"
}

enum Equipment {
  Bands = "Bands",
  Barbell = "Barbell",
  Kettlebells = "Kettlebells",
  Dumbbell = "Dumbbell",
  Other = "Other",
  Cable = "Cable",
  Machine = "Machine",
  BodyOnly = "Body Only",
  MedicineBall = "Medicine Ball",
  ExerciseBall = "Exercise Ball",
  FoamRoll = "Foam Roll",
  EZCurlBar = "EZ Curl Bar",
  None = "None"
}

enum Level {
  Intermediate = "Intermediate",
  Beginner = "Beginner",
  Expert = "Expert"
}

export default function ExerciseCard({exercise, colors, func}: {exercise: Exercise, colors: MD3Colors, func: (exercise: Exercise) => void}) {
  
  return (
    <Button mode='outlined' style={{marginVertical: 4}} theme={{colors: {primary: colors.secondary}}} onPress={() => func(exercise)}>
      {exercise.title}
    </Button>
  )
}
