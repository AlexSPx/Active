import React from 'react';
import { TextInput } from 'react-native-paper';
import { TextInputIOSProps } from 'react-native';

type TextInputProps = {
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  pHolder: string,
  type?: TextInputIOSProps["textContentType"],
  secure?: boolean 
}

export default function TextInputComponent({value, setValue, pHolder, type, secure}: TextInputProps) {
  return (
    <TextInput 
        value={value}
        onChangeText={setValue}
        textContentType={type}
        secureTextEntry={secure || false}
        mode='outlined'
        placeholder={pHolder}
        style={{
            fontSize: 16,
            marginVertical: 4,
            width: "85%"
        }}
    />
  )
}
