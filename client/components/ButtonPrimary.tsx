import {Text, TouchableOpacity} from "react-native"
import { Theme } from "../themes/theme"
import React from "react"

export type ButtonProps = {
    theme: Theme,
    styles?: Object,
    label: string,
    func: () => {}
}

export default function ButtonPrimary({theme, styles, label, func}: ButtonProps) {
  return (
        <TouchableOpacity style={{
                width: "80%",
                backgroundColor: theme.colors.contrast,
                borderRadius: 10,
                paddingVertical: theme.spacing.l,
                paddingHorizontal: theme.spacing.xl,
                marginVertical: theme.spacing.s,
                alignItems: "center",
                ...styles
            }}
            onPress={func}
        >
            <Text style={{
                color: theme.colors.textContrast,
                ...theme.textVariants.header
            }}>{label}</Text>
        </TouchableOpacity>  
    )
}
