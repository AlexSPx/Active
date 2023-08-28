import React, { useState } from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

type ConfirmationDialogWrapperType = React.FC;

export default function useConfirmationDialog(
  onConfirm: () => void
): [ConfirmationDialogWrapperType, (msg: string) => void, () => void] {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showDialog = (msg: string) => {
    setMessage(msg);
    setVisible(true);
  };
  const hideDialog = () => setVisible(false);

  const ConfirmationDialog = (): JSX.Element => {
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Content>
            <Text>{message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button
              onPress={() => {
                onConfirm();
                hideDialog();
              }}
            >
              Okay
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  return [ConfirmationDialog, showDialog, hideDialog];
}
