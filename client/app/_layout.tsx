import React, { useEffect } from "react";
import { Stack } from "expo-router";
import ThemeContextProvider, { useTheme } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const layout = () => {
    const [fontsLoaded] = useFonts({'Raleway': require('../assets/Raleway-Regular.ttf')});

    const theme = useTheme();

    useEffect(() => {
        const dismountSplash =async () => {
            if (fontsLoaded) {
                await SplashScreen.hideAsync();
            }
        }

        dismountSplash();
    }, [fontsLoaded])

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ThemeContextProvider>
            <AuthProvider>
                <Stack screenOptions={{
                    headerShown: false, 
                    contentStyle: {
                        backgroundColor: "#000000"
                    }
                }}
                
                />
            </AuthProvider>
        </ThemeContextProvider>
    )
}

export default layout;