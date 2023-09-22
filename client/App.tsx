import React, { useEffect, useMemo } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
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
import { ModalProvider } from "./contexts/ModalContext";
import { RecoilRoot } from "recoil";
import { SettingsProvider, useSettings } from "./contexts/SettingsContext";

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
      <RecoilRoot>
        <AuthProvider>
          <SafeAreaProvider>
            <SettingsProvider>
              <ColorsSchemeProvider>
                <ModalProvider>
                  <ScreenManager />
                </ModalProvider>
              </ColorsSchemeProvider>
            </SettingsProvider>
          </SafeAreaProvider>
        </AuthProvider>
      </RecoilRoot>
    </GestureHandlerRootView>
  );
};

const ColorsSchemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  const { settings } = useSettings();

  const paperTheme = useMemo(() => {
    switch (settings.theme) {
      case "default-light":
        return LightTheme;
      case "default-dark":
        return DarkTheme;
      case "default-system":
        return colorScheme === "dark" ? DarkTheme : LightTheme;
      case "colors-system":
        return colorScheme === "dark"
          ? { ...DarkTheme, colors: theme.dark }
          : { ...LightTheme, colors: theme.light };

      default:
        return LightTheme;
    }
  }, [colorScheme, theme, settings.theme]);

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar backgroundColor={paperTheme.colors.background} />
      {children}
    </PaperProvider>
  );
};

export default layout;
