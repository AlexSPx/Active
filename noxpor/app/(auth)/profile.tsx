import React from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../contexts/ThemeContext'
import { Button } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const theme = useTheme();
  const {signOut} = useAuth();
  return (
    <SafeAreaView mode="padding" style={{
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.m,
      alignItems: 'center',
      alignContent: 'center'
    }}>

      <Button mode="contained" 
        style={{backgroundColor: theme.colors.error, width: "100%"}} 
        textColor={theme.colors.contrast}
        onPress={signOut}
      >
        Sign Out
      </Button>
    </SafeAreaView>
  )
}
