import React, { useState } from "react";
import { View } from "react-native";
import TextInputComponent from "../../components/TextInputComponent";
import { Button, Text, useTheme } from "react-native-paper";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthQuery } from "../../utils/authQuery";
import { saveToken } from "../../utils/userTokens";
import MainView from "../../components/MainView";

export default function Register() {
  const { colors } = useTheme();

  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const { makeRequest, isLoading, error } = useAuthQuery(false);

  const { fetchUser } = useAuth();

  const registerUser = async () => {
    if (password !== cpassword) return;

    const data = await makeRequest<{ token: string }>("/register", "POST", {
      username,
      firstname,
      lastname,
      email,
      password,
    });
    if (!error) {
      await saveToken(data!.token.toString());
      fetchUser();
    }
  };

  return (
    <MainView colors={colors} paddingHorizontal={4} alignCenter>
      <View
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: -20,
        }}
      >
        <Text
          variant="headlineSmall"
          style={{
            width: "70%",
            textAlign: "center",
            marginBottom: 4,
            fontWeight: "bold",
          }}
        >
          Register new account
        </Text>

        <TextInputComponent
          value={username}
          setValue={setUsername}
          pHolder={"Username"}
        />
        <TextInputComponent
          value={firstname}
          setValue={setFirstname}
          pHolder={"First Name"}
        />
        <TextInputComponent
          value={lastname}
          setValue={setLastname}
          pHolder={"Last Name"}
        />
        <TextInputComponent
          value={email}
          setValue={setEmail}
          pHolder={"Email"}
        />
        <TextInputComponent
          value={password}
          setValue={setPassword}
          pHolder={"Password"}
          secure={true}
        />
        <TextInputComponent
          value={cpassword}
          setValue={setCpassword}
          pHolder={"Confirm Password"}
          secure={true}
        />

        <Button
          mode="contained"
          style={{
            width: "85%",
            marginTop: 16,
            height: 45,
            justifyContent: "center",
          }}
          labelStyle={{ fontSize: 18 }}
          contentStyle={{ height: "100%" }}
          onPress={registerUser}
          loading={isLoading}
        >
          Register
        </Button>
      </View>
    </MainView>
  );
}
