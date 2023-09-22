import { Keyboard, View } from "react-native";
import React, { useEffect, useState } from "react";
import EIcon from "react-native-vector-icons/EvilIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MD3Colors } from "react-native-paper/lib/typescript/src/types";
import { IconButton, TextInput } from "react-native-paper";

type SearchBarProps = {
  title: string;
  colors: MD3Colors;
  setTitle: (t: string) => void;
  executeSearch: () => {};
};

type SearchProps = NativeStackNavigationProp<{ Filters: undefined }>;

export default function SearchBar({
  title,
  setTitle,
  colors,
  executeSearch,
}: SearchBarProps) {
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const navigation = useNavigation<SearchProps>();

  useEffect(() => {
    const keyBoardShown = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const keyBoardHidden = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });
    return () => {
      keyBoardShown.remove();
      keyBoardHidden.remove();
    };
  }, []);

  return (
    <View
      style={{
        paddingHorizontal: 15,
        width: "97%",
        flexDirection: "row",
        backgroundColor: colors.background,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <TextInput
        mode="outlined"
        style={{
          width: "85%",
          padding: 2,
          paddingHorizontal: 20,
          justifyContent: "center",
          fontSize: 18,
        }}
        theme={{ roundness: 30 }}
        right={
          <TextInput.Icon
            icon={(props) => (
              <EIcon
                onPress={executeSearch}
                name="search"
                size={props.size + 10}
                color={props.color}
                style={{ paddingBottom: 7 }}
              />
            )}
          />
        }
        placeholder={"Enter exercise name"}
        value={title}
        onChangeText={(e) => setTitle(e)}
        onSubmitEditing={executeSearch}
      />
      <IconButton
        icon="menu"
        size={45}
        style={{ marginTop: 9.5 }}
        onPress={() => navigation.navigate("Filters")}
      />
    </View>
  );
}
