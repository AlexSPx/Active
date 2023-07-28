import React from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { Text, useTheme } from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const {user} = useAuth();
  const {colors} = useTheme();

  return (
    <SafeAreaView mode="padding" style={{
      flex: 1,
      backgroundColor: colors.background,
      // padding: theme.spacing.m,
      alignItems: 'center',
      alignContent: 'center'
    }}>
      <Text variant='headlineLarge' style={{textAlign: 'center'}}>
        Welcome, {user?.username} {"\n"} to Active. 
      </Text>
    
      <Text variant='titleLarge' style={{textAlign: 'center'}}>
        The app is still in beta(alpha even) {"\n"}
        so not everyting is finished.
      </Text> 
    </SafeAreaView  >
  )
}
