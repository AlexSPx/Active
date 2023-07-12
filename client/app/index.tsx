import React from "react";
import { useContext } from "react";
import {View, Text} from "react-native"
import { ThemeContext } from "../contexts/ThemeContext";
import { useRouter } from "expo-router";
import ButtonPrimary from "../components/ButtonPrimary";
import ButtonSecondary from "../components/ButtonSecondary";

const Home = () => {

    const theme = useContext(ThemeContext)
    const router = useRouter();

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

            <ButtonPrimary theme={theme!} label={"Get Started"} func={async () => router.push("/register")} />
            <ButtonSecondary theme={theme!} label={"Login"} func={async () => router.push("/login")} />

        </View>
    )
}

export default Home;