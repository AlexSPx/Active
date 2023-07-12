import React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext';

export default function Home() {
  const theme = useTheme();
  const {user} = useAuth();
  
  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background
    }}>
      <Text>
        Welcome, {user?.username}
      </Text>
    </View>
  )
}
