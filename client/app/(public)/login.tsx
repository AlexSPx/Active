import React, { useState } from "react";
import TextInputComponent from "../../components/TextInputComponent";
import { saveToken } from "../../utils/secureStore";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Text, useTheme } from "react-native-paper";
import { useAuthQuery } from "../../utils/authQuery";
import MainView from "../../components/MainView";
import { View } from "react-native";
import { useModals } from "../../contexts/ModalContext";
import { ModalNotificationTypesEnum } from "../../components/modals/ModalContainer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { makeRequest, isLoading, error } = useAuthQuery(false);
  const { addModal } = useModals();

  const { colors } = useTheme();
  const { fetchUser } = useAuth();

  const loginUser = async () => {
    const data = await makeRequest<{ token: string }>("/login", "POST", {
      email,
      password,
    });

    if (error) {
      addModal({
        title: "Error",
        body: "Something went wrong",
        type: ModalNotificationTypesEnum.Error,
      });
      return;
    }

    await saveToken(data!.token);
    fetchUser();
  };

  return (
    <MainView colors={colors} paddingHorizontal={4} alignCenter>
      <View
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          margin: -40,
        }}
      >
        <Text
          variant="headlineSmall"
          style={{
            width: "70%",
            textAlign: "center",
            marginBottom: 16,
            fontWeight: "bold",
          }}
        >
          Login to your account
        </Text>

        <TextInputComponent
          value={email}
          setValue={setEmail}
          pHolder={"Email"}
        />
        <TextInputComponent
          value={password}
          setValue={setPassword}
          pHolder={"Password"}
          type="password"
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
          onPress={loginUser}
          loading={isLoading}
        >
          Login
        </Button>
      </View>
    </MainView>
  );
}
