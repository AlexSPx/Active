import React, { useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { useTheme } from '../../../contexts/ThemeContext';
import ButtonPrimary from '../../../components/ButtonPrimary';
import { useRouter } from 'expo-router';

export default function create() {
    const theme = useTheme();
    const router = useRouter();

    const [title, setTitle] = useState("")

    return (
      <View style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.m
      }}>
        <TextInput
            style={{
                borderBottomWidth: 1,
                padding: 4,
                borderBottomColor: theme.colors.contrast,
                fontSize: 20
            }}
            placeholder="Enter template name"
            value={title}
            onChangeText={(e) => setTitle(e)}
        />
        <ButtonPrimary theme={theme} label='Create Workout' 
        styles={{
          paddingVertical: 4
        }} 
      func={async () => router.push("exercises/search")}/>
        {/* <Text>Chose your exercises</Text> */}
      </View>
    )
}
