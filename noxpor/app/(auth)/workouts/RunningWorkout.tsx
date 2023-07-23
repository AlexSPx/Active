import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WorkoutExerciseCurrent, addSetFunction, editValueFunction, useWorkout } from '../../../contexts/WorkoutContext'
import { Button, DataTable, Text, TextInput } from "react-native-paper";
import { useTheme } from '../../../contexts/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabsParamList } from '../AuthRoutes';
import { Theme } from '../../../themes/theme';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import useErrorDialog from '../../../components/ErrorInformationDialog';
import { useAuthQuery } from '../../../utils/authQuery';

export default function RunningWorkout({navigation}: NativeStackScreenProps<TabsParamList>) {
    const {runningWorkout, addSet, toggleFinish, checkFinished, resetWorkout, editValue} = useWorkout();
    const { makeRequest, error } = useAuthQuery();
    
    const theme = useTheme()
    const [ErrorDialog, showDialog] = useErrorDialog();  

    const finishWorkout = async () => {
      if(!runningWorkout) return;
      if(!checkFinished()) {showDialog("You have unfinished workouts!"); return;}

      
      const body = {
        workout_id: runningWorkout.workout_id,
        exercises: runningWorkout.exercises.map(exercise => {
          return {
            exercise_id: exercise.exercise_id,
            reps: exercise.reps,
            weight: exercise.weight,
          }
        })
      }
      
      makeRequest("/workout/record", "POST", body);
      if(!error) {
        handleResetWorkout();
      }
    }

    const handleResetWorkout = () => {
      resetWorkout();
      navigation.navigate("workouts");
    }

    return (
    <SafeAreaView mode='padding' style={{
        flex: 1,
        backgroundColor: theme.colors.background
    }}>
        <ScrollView style={{paddingHorizontal: 12}}>
            <ErrorDialog />
            {runningWorkout?.exercises.map(exercise => 
                <WorkoutExerciseCard key={exercise.id}
                    theme={theme}
                    exercise={exercise}
                    addSet={addSet}
                    toggleFinish={toggleFinish}
                    editValue={editValue}
                />
            )}

            <Button mode="contained" style={{backgroundColor: theme.colors.success, opacity: 80, marginTop: 12}} textColor={theme.colors.text} onPress={finishWorkout}>Finish Workout</Button>
            <Button mode="contained" style={{backgroundColor: theme.colors.error, opacity: 80, marginTop: 12}} textColor={theme.colors.text} onPress={handleResetWorkout}>Cancel Workout</Button>
        </ScrollView>
    </SafeAreaView>
    )
}

type WorkoutExerciseCardProps = {
    theme: Theme,
    exercise: WorkoutExerciseCurrent,
    addSet: addSetFunction, 
    toggleFinish: (id: number, idx: number) => void,
    editValue: editValueFunction
}

const WorkoutExerciseCard = ({theme, exercise, addSet, toggleFinish, editValue}: WorkoutExerciseCardProps) => {

  const inputFinishAwait = (type: "reps" | "weight", id: number, e: string) => {
    editValue("current", exercise.exercise_id, type, id, parseInt(e))
  }

    return (
        <View style={{marginVertical:6}}>
      <View style={{
        flexDirection: "row",
      }}>
        <Text variant="titleLarge">{exercise.title}</Text>
      </View>
      <DataTable>
        <DataTable.Header style={{padding: 0, justifyContent: "space-between"}}>
          <DataTable.Title textStyle={{fontWeight: "bold", fontSize: 14}} style={{maxWidth: "10%"}}>Set</DataTable.Title>
          <DataTable.Title style={{justifyContent: 'center', alignItems: 'center', maxWidth: "40%"}}>Kg</DataTable.Title>
          <DataTable.Title style={{justifyContent: 'center', maxWidth: "40%"}}>Reps</DataTable.Title>
          <DataTable.Title style={{justifyContent: 'center', maxWidth: "10%"}} >Finish</DataTable.Title>
        </DataTable.Header>
      </DataTable>

      {exercise.reps.map((val ,idx) => (
        <DataTable.Row key={idx}
            style={{backgroundColor: exercise.finished[idx] ? theme.colors.success : theme.colors.background}}
        >
          <DataTable.Cell style={{maxWidth:"10%"}}>{idx+1}</DataTable.Cell>
          <WorkoutTabelCell theme={theme} value={exercise.weight[idx]} onChange={(t: string) => inputFinishAwait("weight", idx, t)} 
            styles={{backgroundColor: exercise.finished[idx] ? theme.colors.successDark : theme.colors.secondary}}/>
          <WorkoutTabelCell theme={theme} value={val} onChange={(t: string) => inputFinishAwait("reps", idx, t)}
            styles={{backgroundColor: exercise.finished[idx] ? theme.colors.successDark : theme.colors.secondary}}/>
          <DataTable.Cell style={{maxWidth: "10%", padding: 0}}>
            <TouchableOpacity style={{
                flex: 1, 
                backgroundColor: exercise.finished[idx] ? theme.colors.successDark : theme.colors.accentSecondary, 
                width: 35, 
                height: 35,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'center'
            }} onPress={() => toggleFinish(exercise.exercise_id, idx)}>
                <Icon name='plus' size={20}/>
            </TouchableOpacity>
          </DataTable.Cell>
        </DataTable.Row>
      ))}
    <Button mode='text' 
      style={{borderRadius: 10, marginTop:12}} 
      textColor={theme.colors.text} 
      buttonColor={theme.colors.accentSecondary} 
      onPress={() => addSet("current", exercise.exercise_id, 0, 0)}
    >
        Add Set
    </Button>
    </View>
    )
}

const WorkoutTabelCell = ({theme, value, onChange, styles}: {theme: Theme, value: number, onChange: (t: string) => void, styles?: Object}) => {
    const [val, setVal] = useState("")
    
    useEffect(() => {
      const delay = setTimeout(() => onChange(val), 500)
      return () => clearTimeout(delay);
    }, [val])
    
  
    return (
      <DataTable.Cell style={{flex: 1,justifyContent: 'center', alignContent: "center", maxWidth: "40%"}}>
            <TextInput underlineColor='transperent' keyboardType="numeric" 
            style={{
              flex: 1,
              backgroundColor: theme.colors.secondary,
              height: 30,
              paddingHorizontal: 2,
              textAlign: 'center',
              width: 100,
              borderRadius: 5,
              ...styles
            }}
            value={val}
            cursorColor="rgba(0,0,0,1)"
            activeUnderlineColor="rgba(0,0,0,0.0)"
            outlineStyle={{
              borderRadius: 30
            }}
            placeholder={value.toString()}
            onChangeText={text => setVal(text)}
            />  
            </DataTable.Cell>
    )
  }