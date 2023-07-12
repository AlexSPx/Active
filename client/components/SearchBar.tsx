import { Keyboard, TextInput, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from 'react'
import { Theme } from "../themes/theme";
import Icon from "react-native-vector-icons/Feather";
import EIcon from "react-native-vector-icons/EvilIcons";
import { useRouter } from "expo-router";

type SearchBarProps = {
    title: string,
    theme: Theme,
    setTitle: React.Dispatch<React.SetStateAction<string>>
    executeSearch: () => {}
}

export default function SearchBar({title, setTitle, theme, executeSearch}: SearchBarProps) {
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const keyBoardShown = Keyboard.addListener("keyboardDidShow", () => {
        setKeyboardStatus(true);
    })
    const keyBoardHidden = Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardStatus(false);
    })
    return () => {
      keyBoardShown.remove();
      keyBoardHidden.remove();
    }
  }, [])
  

  return (
    <View style={{
        width: "97%",
        flexDirection: "row",
        backgroundColor: theme.colors.background,
        justifyContent: "space-between"
    }}>
        <View style={{
            flex: 1,
            flexDirection: "row",

        }}>
            <TextInput
                    style={{
                    width: keyboardStatus ? "95%" : "75%",
                    backgroundColor: theme.colors.secondary,
                    padding: 2,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    fontSize: 18
                }}
                
                placeholder={"Enter exercise name"}
                value={title}
                onChangeText={(e) => setTitle(e)}
            />
            {!keyboardStatus && (
                <TouchableOpacity style={{
                    paddingLeft: 10
                }}
                onPress={executeSearch}
                >
                    <EIcon name="search" size={40}/>
                </TouchableOpacity>
            )}
        </View>
        <TouchableOpacity onPress={() => {
            router.push("exercises/search/filters")
        }}>
            <Icon name="menu" size={40}/>
        </TouchableOpacity>
    </View>
  )
}
