import React from "react";
import { TextInput, TextInputProps } from "react-native-paper";
import { TextInputIOSProps } from "react-native";

type TextInputCustomProps = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  type?: TextInputIOSProps["textContentType"];
  secure?: boolean;
} & TextInputProps;

export function TextInputComponent({
  value,
  setValue,
  type,
  secure,
  ...rest
}: TextInputCustomProps) {
  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      textContentType={type}
      secureTextEntry={secure || false}
      mode="outlined"
      placeholder={"pHolder"}
      style={{
        fontSize: 16,
        marginVertical: 4,
        width: "85%",
      }}
      {...rest}
    />
  );
}
