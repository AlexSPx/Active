import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const {colors} = useTheme();
  const {signOut} = useAuth();
  return (
    <SafeAreaView mode="padding" style={{
      flex: 1,
      backgroundColor: colors.background,
      // padding: theme.spacing.m,
      alignItems: 'center',
      alignContent: 'center'
    }}>

      <Button mode="contained" 
        style={{
          backgroundColor: colors.errorContainer, 
          borderRadius: 10,
          opacity: 0.8,
          marginTop: 15,
          width: "90%"
        }}
        textColor={colors.error}
        onPress={signOut}
      >
        Sign Out
      </Button>
    </SafeAreaView>
  )
}
