import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useTheme } from '../../../contexts/ThemeContext';
import { WorkoutExercise, addSetFunction, editValueFunction, useWorkout } from '../../../contexts/WorkoutContext';
import { useExerciseSearch } from '../../../contexts/ExerciseSearchContext';
import { Exercise } from '../../../components/ExerciseCard';
import { Theme } from '../../../themes/theme';
import { Button, DataTable, Text, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import useErrorDialog from '../../../components/ErrorInformationDialog';
import { useAuthQuery } from '../../../utils/authQuery';

export default function CreateExercise({navigation}: NativeStackScreenProps<any>) {

    const theme = useTheme();
    const {workoutInCreation, addExercise, addSet, editValue, cancelCreating} = useWorkout();
    const {setSearchFunction} = useExerciseSearch();
    const [ErrorDialog, showDialog] = useErrorDialog();

    const [title, setTitle] = useState("")

    const {makeRequest, error} = useAuthQuery();

    const handleCreateWorkout = () => {
      if(workoutInCreation!.exercises.length === 0) {
        showDialog("You should have at least one exercise");
        return;
      };

      workoutInCreation!.exercises.forEach(exercise => {
        exercise.reps.forEach((rep, idx) => {
          if(Number.isNaN(rep) || Number.isNaN(exercise.weight[idx])) {
            showDialog("You have empty values in your exercises");
            return;
          }
        })
      })

      const body = {
        title,
        exercises: workoutInCreation?.exercises
      }

      makeRequest("/workout/create", "POST", body);
      if(!error) {
        cancelCreating();
        navigation.navigate("workouts");
      }
    }


    useEffect(() => {
      const searchFunc = (exercise:Exercise) => {
        addExercise({
            exercise_id: exercise.id,
            title: exercise.title,
            reps: [],
            weight: [],
        })        
      navigation.navigate("CreateWorkout");
    }
    
    if(workoutInCreation) setTitle(workoutInCreation.title)
      // Set the search function
      setSearchFunction(() => searchFunc);
    }, [workoutInCreation]);  

    return (
      <SafeAreaView mode="padding" style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.m
      }}>

        <ErrorDialog />
        
        <TextInput
            style={{
                borderBottomWidth: 0,
                borderBottomColor: theme.colors.contrast,
                fontSize: 20,
                backgroundColor: theme.colors.background,
            }}
            outlineStyle={{
              borderRadius: 1200
            }}
            underlineStyle={{
              borderRadius: 80
            }}
            underlineColor='transparent'
            placeholder="Enter template name"
            value={title}
            onChangeText={(e) => setTitle(e)}
        />
        <SafeAreaView  style={{flex: 1}}>
          <ScrollView keyboardShouldPersistTaps="always">
            {workoutInCreation?.exercises.map(exercise => (
              <WorkoutExerciseCard key={exercise.exercise_id} exercise={exercise} theme={theme} addSet={addSet} editValue={editValue}/>
            ))}

            <Button mode='text' textColor={theme.colors.text} style={{
              backgroundColor: theme.colors.accentMain, 
              borderRadius: 10,
              marginTop: 15
            }}
            onPress={() => navigation.navigate("ExerciseSearch")}>Add Exercise</Button>
          
            <View style={{marginTop: theme.spacing.m}}>
              <Button style={{
                  backgroundColor: theme.colors.success, 
                  borderRadius: 10,
                  opacity: 0.8,
                  marginTop: 15
                }}
                textColor={theme.colors.contrast}
                onPress={handleCreateWorkout}
              >
                Create
              </Button>

              <Button style={{
                  backgroundColor: theme.colors.error, 
                  borderRadius: 10,
                  opacity: 0.8,
                  marginTop: 15
                }}
                textColor={theme.colors.contrast}
                onPress={() => {
                  navigation.goBack();
                  cancelCreating();
                }}
              >
                Cancel
              </Button>
            </View>

          </ScrollView>
        </SafeAreaView>     
      </SafeAreaView>
    )
}


const WorkoutExerciseCard = ({exercise, theme, addSet, editValue}: 
  {exercise: WorkoutExercise, theme: Theme, addSet: addSetFunction, editValue: editValueFunction}) => {

   const inputFinishAwait = (type: "reps" | "weight", id: number, e: string) => {
      editValue("creating", exercise.exercise_id, type, id, parseInt(e))
    } 

  return (
    <View style={{marginVertical:6}}>
      <View style={{
        // flex: 1,
        flexDirection: "row",
      }}>
        <Text variant="titleLarge">{exercise.title}</Text>
      </View>
      <DataTable>
        <DataTable.Header style={{padding: 0}}>
          <DataTable.Title textStyle={{fontWeight: "bold", fontSize: 14}}>Set</DataTable.Title>
          <DataTable.Title  style={{justifyContent: 'center'}}>Kg</DataTable.Title>
          <DataTable.Title style={{justifyContent: 'center'}}>Reps</DataTable.Title>
        </DataTable.Header>
      </DataTable>

      {exercise.reps.map((val ,idx) => (
        <DataTable.Row key={idx}>
          <DataTable.Cell>{idx+1}</DataTable.Cell>
          <WorkoutTabelCell theme={theme} value={exercise.weight[idx]} onChange={(t: string) => inputFinishAwait("weight", idx, t)}/>
          <WorkoutTabelCell theme={theme} value={val} onChange={(t: string) => inputFinishAwait("reps", idx, t)}/>
        </DataTable.Row>
      ))}
    <Button mode='text' 
      style={{borderRadius: 10, marginTop:12}} 
      textColor={theme.colors.text} 
      buttonColor={theme.colors.accentSecondary} 
      onPress={() => addSet("creating", exercise.exercise_id,0, 0)}>
        Add Set
    </Button>
    </View>
  )
}

const WorkoutTabelCell = ({theme, value, onChange}: {theme: Theme, value: number, onChange: (t: string) => void}) => {
  const [val, setVal] = useState(Number.isNaN(value) ? "" : value.toString())
  
  useEffect(() => {      
    const delay = setTimeout(() => onChange(val), 500)
    return () => clearTimeout(delay);
  }, [val])
  

  return (
    <DataTable.Cell style={{justifyContent: 'center'}}>
          <TextInput underlineColor='transperent' keyboardType="numeric" 
          style={{
            backgroundColor: theme.colors.secondary,
            height: 30,
            paddingHorizontal: 2,
            textAlign: 'center',
            width: 60,
            borderRadius: 5,
          }}
          value={val}
          cursorColor="rgba(0,0,0,1)"
          activeUnderlineColor="rgba(0,0,0,0.0)" 
          outlineStyle={{
            borderRadius: 30
          }}
          onChangeText={text => setVal(text)}
          />  
          </DataTable.Cell>
  )
}