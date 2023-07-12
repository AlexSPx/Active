import {Text, TouchableOpacity} from "react-native"
import { ButtonProps } from "./ButtonPrimary"
import React from "react"

export default function ButtonSecondary({theme, styles, label, func}: ButtonProps) {
  return (
        <TouchableOpacity style={{
                width: "80%",
                borderColor: theme.colors.contrast,
                borderWidth: 2,
                borderRadius: 10,
                paddingVertical: theme.spacing.m,
                marginVertical: theme.spacing.s,
                alignItems: "center",
                ...styles
            }}
            onPress={func}
        >
            <Text style={{
                color: theme.colors.contrast,
                ...theme.textVariants.header
            }}>{label}</Text>
        </TouchableOpacity>  
    )
}
