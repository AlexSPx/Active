import React from "react";
import { MD3Colors } from "react-native-paper/lib/typescript/src/types";
import { SafeAreaView } from "react-native-safe-area-context";

type MainViewProps = {
  colors: MD3Colors;
  children: React.ReactNode;
  paddingHorizontal?: number;
  alignCenter?: boolean;
};

export default function MainView({
  colors,
  children,
  paddingHorizontal = 16,
  alignCenter = false,
}: MainViewProps) {
  return (
    <SafeAreaView
      mode="padding"
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: alignCenter ? "center" : "stretch",
        paddingHorizontal,
      }}
    >
      {children}
    </SafeAreaView>
  );
}
