import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { Portal } from "react-native-paper";
import {
  Modal,
  ModalNotificationWrapperType,
} from "../components/modals/ModalContainer";

type ModalNotificationWrapperTypeWithKey = ModalNotificationWrapperType & {
  key: number;
};

type ModalContextType = {
  modals: ModalNotificationWrapperTypeWithKey[];
  setModals: React.Dispatch<
    React.SetStateAction<ModalNotificationWrapperTypeWithKey[]>
  >;
};

const ModalContext = React.createContext<ModalContextType | null>(null);

export const useModals = () => {
  const modalContext = React.useContext(ModalContext);

  if (!modalContext) {
    throw new Error("useModals has to be used within <ModalContext.Provider>");
  }

  const [key, setKey] = useState(1);

  const addModal = (newModal: ModalNotificationWrapperType) => {
    const currKey = key;
    console.log(currKey);

    modalContext.setModals((prev) => [...prev, { ...newModal, key: currKey }]);

    setKey((prevKey) => ++prevKey);

    setTimeout(() => {
      modalContext.setModals((prev) => [
        ...prev.filter((item) => item.key != currKey),
      ]);
    }, 5000);
  };

  return {
    addModal,
  };
};

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<ModalNotificationWrapperTypeWithKey[]>(
    []
  );

  return (
    <ModalContext.Provider
      value={{
        modals,
        setModals,
      }}
    >
      <Portal>
        <View
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            alignItems: "center",
            paddingTop: 50,
            flex: 1,
          }}
        >
          <FlatList
            style={{ width: "100%" }}
            data={modals}
            renderItem={({ item }) => (
              <Modal title={item.title} body={item.body} type={item.type} />
            )}
          />
        </View>
      </Portal>

      {children}
    </ModalContext.Provider>
  );
}
