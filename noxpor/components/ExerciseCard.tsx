import React from 'react'
import { Text, View } from 'react-native'
import { Theme } from '../themes/theme'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useExerciseSearch } from '../contexts/ExerciseSearchContext'

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

export default function ExerciseCard({exercise, theme, func}: {exercise: Exercise, theme: Theme, func: (exercise: Exercise) => void}) {
  
  const {searchFunction} = useExerciseSearch();  

  return (
    <View style={{
        backgroundColor: theme.colors.secondary,
        borderRadius: 30,
        marginVertical: theme.spacing.s,
        overflow: 'hidden'
    }}>
      <TouchableOpacity style={{padding: theme.spacing.m}}
        onPress={() => searchFunction(exercise)}
      >
        
      <Text style={{
            ...theme.textVariants.body
        }}>{exercise.title}</Text>
        <View style={{
            flex: 1,
            flexDirection: "row"
        }}>
        </View>
      </TouchableOpacity>
    </View>
  )
}
