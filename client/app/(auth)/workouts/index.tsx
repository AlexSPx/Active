import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useTheme } from '../../../contexts/ThemeContext'
import ButtonSecondary from '../../../components/ButtonSecondary';
import { useRouter } from 'expo-router';

export default function index() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      paddingVertical: 8
    }}>
      <Text style={theme.textVariants.header}>Workouts</Text>
      <ButtonSecondary theme={theme} label='Create Workout' 
        styles={{
          paddingVertical: 4
        }} 
      func={async () => router.push("workouts/create")}/>
    
    <ScrollView>
    {/* <Text style={{backgroundColor: "#555555"}}>Your templates:</Text> */}
      
    </ScrollView>
    </View>
  )
}
