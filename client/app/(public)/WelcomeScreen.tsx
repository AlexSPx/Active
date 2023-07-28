import React from "react";
import { View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme, Text, Button } from "react-native-paper";

export default function WelcomeScreen({navigation}: NativeStackScreenProps<any>) {

    const {colors} = useTheme();

    return (
        <View style={{
            flex: 1,
            paddingVertical: 26,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.background
        }}>
            <View style={{marginVertical: 24}}>
                <Text variant="displaySmall">
                    Welcome to Active,
                </Text>
                <Text variant="bodyMedium">
                    click the button below to begin your journey
                </Text> 
            </View>

            <Button mode="contained" style={{width: "75%", marginVertical: 6}} onPress={() => navigation.navigate("register")}>Get Started</Button>
            <Button mode="outlined" style={{width: "75%", marginVertical: 6}} onPress={() => navigation.navigate("login")}>Login</Button>
        </View>
    )
}