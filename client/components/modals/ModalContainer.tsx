import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export enum ModalNotificationTypesEnum {
  Error,
  Information,
  Success,
}

export type ModalNotificationType = {
  title: string;
  body: string;
};

export type ModalNotificationWrapperType = ModalNotificationType & {
  type: ModalNotificationTypesEnum;
};

export const Modal = ({ title, body, type }: ModalNotificationWrapperType) => {
  if (type === ModalNotificationTypesEnum.Error) {
    return <ErrorModal title={title} body={body} />;
  } else if (type === ModalNotificationTypesEnum.Information) {
    return <InformationModal title={title} body={body} />;
  } else if (type === ModalNotificationTypesEnum.Success) {
    return <SuccessModal title={title} body={body} />;
  } else {
    return null;
  }
};

const ErrorModal = ({ title, body }: ModalNotificationType) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: "90%",
        backgroundColor: colors.errorContainer,
        height: 80,
        borderRadius: 20,
        padding: 12,
        marginVertical: 7,
      }}
    >
      <Text variant="titleMedium">{title}</Text>
      <Text variant="bodyLarge">{body}</Text>
    </View>
  );
};

const InformationModal = ({ title, body }: ModalNotificationType) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: "90%",
        backgroundColor: colors.secondaryContainer,
        height: 80,
        borderRadius: 20,
        padding: 12,
        marginVertical: 7,
      }}
    >
      <Text variant="titleMedium">{title}</Text>
      <Text variant="bodyLarge">{body}</Text>
    </View>
  );
};

const SuccessModal = ({ title, body }: ModalNotificationType) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: "90%",
        backgroundColor: colors.primaryContainer,
        height: 80,
        borderRadius: 20,
        padding: 12,
        marginVertical: 7,
      }}
    >
      <Text variant="titleMedium">{title}</Text>
      <Text variant="bodyLarge">{body}</Text>
    </View>
  );
};
