import React from "react";
import { useContext } from "react";
import {View, Text} from "react-native"
import { ThemeContext } from "../../contexts/ThemeContext";
import ButtonPrimary from "../../components/ButtonPrimary";
import ButtonSecondary from "../../components/ButtonSecondary";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export default function WelcomeScreen({navigation}: NativeStackScreenProps<any>) {

    const theme = useContext(ThemeContext)

    return (
        <View style={{
            flex: 1,
            paddingVertical: theme.spacing.xl,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.background
        }}>
            <Text style={{
                width: "70%",
                fontWeight: "bold",
                ...theme.textVariants.header,
            }}>
                Welcome to Active,
            </Text>
            {/* <Image 
                source={require("../assets/logo.png")}
                style={{
                    width: "80%",
                    height: "20%",
                    resizeMode: "center",
                    marginVertical: theme.spacing.m
                }}
            /> */}
            <Text
            style={{
                width: "70%",
                marginBottom: theme.spacing.l,
                ...theme.textVariants.body,
            }}>
                click the button below to begin your journey
            </Text>

            <ButtonPrimary theme={theme!} label={"Get Started"} func={async () => navigation.navigate("register")} />
            <ButtonSecondary theme={theme!} label={"Login"} func={async () => navigation.navigate("login")} />

        </View>
    )
}