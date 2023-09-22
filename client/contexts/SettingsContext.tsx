import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getSettings, saveSettings } from "../utils/secureStore";

export type Settings = {
  theme: "default-light" | "default-dark" | "default-system" | "colors-system";
  notifications: boolean;
};

const defaultSettings: Settings = {
  theme: "default-light",
  notifications: true,
};

export const SettingsContext = createContext<
  | {
      settings: Settings;
      updateSettings: React.Dispatch<React.SetStateAction<Settings>>;
    }
  | undefined
>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const init = async () => {
      const storageSettings = await getSettings();
      if (storageSettings) setSettings(storageSettings);
    };

    init();
  }, []);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings: setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
