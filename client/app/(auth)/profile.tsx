import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, useTheme, Text, Divider, Chip } from "react-native-paper";
import { useAuth } from "../../contexts/AuthContext";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSettings } from "../../contexts/SettingsContext";

export default function Profile() {
  const { colors } = useTheme();
  const { signOut } = useAuth();

  return (
    <SafeAreaView
      mode="padding"
      style={{
        flex: 1,
        backgroundColor: colors.background,
        // padding: theme.spacing.m,
        alignItems: "center",
        alignContent: "center",
      }}
    >
      <Settings />

      <Button
        mode="contained"
        style={{
          backgroundColor: colors.errorContainer,
          borderRadius: 10,
          opacity: 0.8,
          marginTop: 15,
          width: "90%",
        }}
        textColor={colors.error}
        onPress={signOut}
      >
        Sign Out
      </Button>
    </SafeAreaView>
  );
}

const Settings = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <View style={{ marginBottom: 16, width: "90%" }}>
      <Text variant="headlineMedium" style={{ marginBottom: 10 }}>
        Settings
      </Text>
      <Text variant="headlineSmall">Theme</Text>

      <View style={{ marginVertical: 12 }}>
        <ThemeButtom
          label="Light Theme"
          selected={settings.theme === "default-light"}
          onClick={() =>
            updateSettings((prev) => ({ ...prev, theme: "default-light" }))
          }
        />
        <ThemeButtom
          label="Dark Theme"
          selected={settings.theme === "default-dark"}
          onClick={() =>
            updateSettings((prev) => ({ ...prev, theme: "default-dark" }))
          }
        />
        <ThemeButtom
          label="System"
          selected={settings.theme === "default-system"}
          onClick={() =>
            updateSettings((prev) => ({ ...prev, theme: "default-system" }))
          }
        />

        <ThemeButtom
          label="Material You"
          selected={settings.theme === "colors-system"}
          onClick={() =>
            updateSettings((prev) => ({ ...prev, theme: "colors-system" }))
          }
        />
      </View>
      <Divider style={{ marginVertical: 6 }} />
    </View>
  );
};

const ThemeButtom = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <Chip
      style={{ marginVertical: 3, paddingVertical: 3 }}
      showSelectedOverlay
      selected={selected}
      onPress={onClick}
    >
      <Text>{label}</Text>
    </Chip>
  );
};
