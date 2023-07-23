import { Button, Text } from "react-native-paper"
import { ButtonProps } from "./ButtonPrimary"
import React from "react"

export default function ButtonSecondary({theme, styles, label, func}: ButtonProps) {
  return (
        <Button style={{
                width: "80%",
                borderColor: theme.colors.contrast,
                borderWidth: 2,
                borderRadius: 10,
                paddingVertical: theme.spacing.s,
                marginVertical: theme.spacing.s,
                alignItems: "center",
                ...styles
            }}
            onPress={func}
        >
            <Text variant="headlineMedium" style={{
                color: theme.colors.contrast,
            }}>{label}</Text>
        </Button>  
    )
}
