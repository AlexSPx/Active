import * as SecureStore from "expo-secure-store";
import { Settings } from "../contexts/SettingsContext";

export async function saveToken(value: string) {
  if (!value) return;

  await SecureStore.setItemAsync("access_token", value);
}

export async function removeToken() {
  await SecureStore.deleteItemAsync("access_token");
}

export async function getToken() {
  let result = await SecureStore.getItemAsync("access_token");
  if (result) {
    return {
      success: true,
      value: result,
    };
  } else {
    return {
      success: false,
    };
  }
}

export async function saveSettings(value: Settings) {
  if (!value) return;

  await SecureStore.setItemAsync("settings", JSON.stringify(value));
}

export async function getSettings(): Promise<Settings | null> {
  let result = await SecureStore.getItemAsync("settings");
  return result ? JSON.parse(result) : result;
}
