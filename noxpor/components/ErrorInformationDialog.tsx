import React, { useState } from 'react'
import { Button, Dialog, Portal, Text } from 'react-native-paper'
import { useTheme } from '../contexts/ThemeContext';


type ErrorDialogWrapperType = React.FC;

export default function useErrorDialog(): [ErrorDialogWrapperType, (msg: string) => void, () => void] {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("")

  const showDialog = (msg: string) => {
    setMessage(msg)
    setVisible(true)
  };
  const hideDialog = () => setVisible(false);

  const theme = useTheme();

  const ErrorDialog = (): JSX.Element => {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={() => setVisible(false)} style={{
                backgroundColor: theme.colors.secondary,
            }}>
                <Dialog.Content>
                    <Text>{message}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialog}>Okay</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
      )
  }

  return [ErrorDialog, showDialog, hideDialog]
}
