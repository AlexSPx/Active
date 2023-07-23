import React from 'react';
import { Theme } from '../themes/theme';
import { TextInput } from 'react-native-paper';
import { TextInputIOSProps } from 'react-native';

type TextInputProps = {
  theme: Theme,
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  pHolder: string,
  type?: TextInputIOSProps["textContentType"],
  secure?: boolean 
}

export default function TextInputComponent({theme, value, setValue, pHolder, type, secure}: TextInputProps) {
  return (
    <TextInput 
        value={value}
        onChangeText={setValue}
        textContentType={type}
        secureTextEntry={secure || false}
        mode='outlined'
        placeholder={pHolder}
        theme={{colors: {primary: theme.colors.accentMain}}}
        style={{
            borderColor: theme.colors.contrast,
            backgroundColor: theme.colors.background,
            fontSize: 16,
            marginVertical: theme.spacing.s,
            width: "80%"
        }}
    />
  )
}
