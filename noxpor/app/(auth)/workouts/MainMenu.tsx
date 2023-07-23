import React, { useEffect, useState } from 'react'
import { View, ScrollView } from 'react-native'
import { useTheme } from '../../../contexts/ThemeContext'
import ButtonSecondary from '../../../components/ButtonSecondary';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { API_ADDRESS } from '../../../utils/configs';
import { authHeaders, useAuthFetch, useAuthQuery } from '../../../utils/authQuery';
import { Button, Card, Text } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const theme = useTheme();
  
  const {data: workouts} = useAuthFetch<WorkoutWithRecords[]>("/workout"); 

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      paddingVertical: 8,
      paddingTop: 0
    }}>
    
      <ScrollView style={{flex: 1, width: '100%', paddingHorizontal: 18}}>
          
          {workouts?.map(workout => (
            <Card key={workout.workout.id} mode='contained' style={{
                backgroundColor: theme.colors.secondary, 
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
    </SafeAreaView>
  )
}
