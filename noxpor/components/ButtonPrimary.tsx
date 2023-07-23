import { Theme } from "../themes/theme"
import React from "react"
import { Button, Text } from "react-native-paper"

export type ButtonProps = {
    theme: Theme,
    styles?: Object,
    label: string,
    func: () => {}
}

export default function ButtonPrimary({theme, styles, label, func}: ButtonProps) {
  return (
        <Button style={{
                width: "80%",
                backgroundColor: theme.colors.contrast,
                borderRadius: 10,
                paddingVertical: theme.spacing.m,
                paddingHorizontal: theme.spacing.xl,
                marginVertical: theme.spacing.s,
                alignItems: "center",
                ...styles
            }}
            onPress={func}
        >
            <Text variant="headlineMedium" style={{
                color: theme.colors.textContrast,
                // ...theme.textVariants.header
            }}>{label}</Text>
        </Button>  
    )
}
