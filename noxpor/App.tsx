import React, { useEffect } from "react";
import ThemeContextProvider from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { WorkoutProvider } from "./contexts/WorkoutContext";
import ExerciseSearchProvider from "./contexts/ExerciseSearchContext";

import ScreenManager from "./app/ScreenManager";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

const layout = () => {
    const [fontsLoaded] = useFonts({'Raleway': require('./assets/Raleway-Regular.ttf')});

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
                    <ExerciseSearchProvider>
                        <WorkoutProvider>
                            <SafeAreaProvider>
                                <PaperProvider>
                                    <ScreenManager />
                                </PaperProvider>
                            </SafeAreaProvider>
                        </WorkoutProvider>
                    </ExerciseSearchProvider>
                </AuthProvider>
            </ThemeContextProvider>
    )
}

export default layout;
