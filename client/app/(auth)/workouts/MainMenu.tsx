import React, { useEffect, useState } from 'react'
import { View, ScrollView } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthFetch } from '../../../utils/authQuery';
import { Card, Text, useTheme } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import MainView from '../../../components/MainView';

export interface Workout {
  id: string;
  title: string;
  created_by: string;
  updated_at: string;
  structure_record_id: number;
}

export interface Exercise {
  id: number;
  title: string;
  user_id: string | null;
  workout_record_id: number;
  exercise_id: number;
  reps: number[];
  weight: number[];
}

export interface StructureRecord {
  id: number;
  created_at: string | null;
  workout_id: string | null;
  exercises: Exercise[];
}

export interface WorkoutWithRecords {
  workout: Workout;
  structure_record: StructureRecord;
}

export default function MainMenu({navigation}: NativeStackScreenProps<any>) {
  
  const {data: workouts} = useAuthFetch<WorkoutWithRecords[]>("/workout"); 

  const {colors} = useTheme();

  return (
    <MainView colors={colors}>
      <ScrollView>
          {workouts?.map(workout => (
            <Card key={workout.workout.id} mode='contained' style={{
                backgroundColor: colors.secondaryContainer, 
                overflow: 'hidden',
                margin: 4
              }}
            >
              <TouchableOpacity style={{
                  padding: 12  
                }}
                onPress={() => {
                  navigation.navigate("WorkoutPreview", {workout})
                }}
              >
                <Card.Title title={workout.workout.title}/>
                <Card.Content style={{
                  
                }}>
                  {workout.structure_record.exercises.map(exercise => {
                    return (
                      <View key={exercise.id} style={{
                        flexDirection: "row",
                        justifyContent: 'space-between',
                      }}>
                        <Text>{exercise.title}</Text>
                        <Text>{exercise.reps.length} sets</Text>
                      </View>
                    );
                  })}
                </Card.Content>
              </TouchableOpacity>
            </Card>
          ))}

      </ScrollView>
    </MainView>
    )
}
