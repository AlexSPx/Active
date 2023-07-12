import React from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { Theme } from '../themes/theme';

type TextInputProps = {
  theme: Theme,
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  pHolder: string,
}

export default function TextInputComponent({theme, value, setValue, pHolder}: TextInputProps) {
  return (
    <TextInput 
        value={value}
        onChangeText={setValue}
        placeholder={pHolder}
        style={{
            borderColor: theme.colors.contrast,
            borderWidth: 1,
            borderRadius: 10,
            padding: theme.spacing.m,
            backgroundColor: theme.colors.background,
            fontSize: 16,
            marginVertical: theme.spacing.s,
            width: "80%"
        }}
    />
  )
}
