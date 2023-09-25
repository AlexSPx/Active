import React, { useState } from "react";
import { View } from "react-native";
import { TextInputComponent } from "../../components/TextInputComponent";
import { Button, Text, useTheme } from "react-native-paper";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthQuery } from "../../utils/authQuery";
import { saveToken } from "../../utils/secureStore";
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
          placeholder={"Username"}
          autoComplete="username"
        />
        <TextInputComponent
          value={firstname}
          setValue={setFirstname}
          placeholder={"First Name"}
          autoComplete="name-given"
        />
        <TextInputComponent
          value={lastname}
          setValue={setLastname}
          placeholder={"Last Name"}
          autoComplete="name-family"
        />
        <TextInputComponent
          value={email}
          setValue={setEmail}
          placeholder={"Email"}
          autoComplete="email"
        />
        <TextInputComponent
          value={password}
          setValue={setPassword}
          placeholder={"Password"}
          secure={true}
        />
        <TextInputComponent
          value={cpassword}
          setValue={setCpassword}
          placeholder={"Confirm Password"}
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
