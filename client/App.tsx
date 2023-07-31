import React, { useEffect, useMemo } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { WorkoutProvider } from "./contexts/WorkoutContext";
import ExerciseSearchProvider from "./contexts/ExerciseSearchContext";
import ScreenManager from "./app/ScreenManager";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  MD3DarkTheme as DefaultLightTheme,
  MD3LightTheme as DefaultDarkTheme,
  PaperProvider,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { theme as AppTheme } from "./themes/theme";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const LightTheme = {
  ...DefaultLightTheme,
  colors: AppTheme.light.colors,
};

const DarkTheme = {
  ...DefaultDarkTheme,
  colors: AppTheme.dark.colors,
};

const layout = () => {
  const [fontsLoaded] = useFonts({
    Raleway: require("./assets/Raleway-Regular.ttf"),
  });

  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const paperTheme = useMemo(
    () =>
      colorScheme === "dark"
        ? { ...DarkTheme, colors: theme.dark }
        : { ...LightTheme, colors: theme.light },
    [colorScheme, theme]
  );

  useEffect(() => {
    const dismountSplash = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };

    dismountSplash();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ExerciseSearchProvider>
          <WorkoutProvider>
            <SafeAreaProvider>
              <PaperProvider theme={paperTheme}>
                <StatusBar backgroundColor={paperTheme.colors.background} />
                <ScreenManager />
              </PaperProvider>
            </SafeAreaProvider>
          </WorkoutProvider>
        </ExerciseSearchProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default layout;
