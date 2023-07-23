import React, { useContext, useState } from 'react'
import { View } from 'react-native'
import { ThemeContext } from '../../contexts/ThemeContext'
import TextInputComponent from '../../components/TextInputComponent';
import { Button, Text } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthQuery } from '../../utils/authQuery';
import { saveToken } from '../../utils/userTokens';

export default function Register() {

    const theme = useContext(ThemeContext)

    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");

    const {makeRequest, isLoading, error} = useAuthQuery(false);
    
    const { fetchUser } = useAuth();

  const registerUser = async () => {
    if(password !== cpassword) return;

    const data = await makeRequest<{token: string}>("/register", 'POST', {username, firstname, lastname, email, password});
    if(!error){
      await saveToken(data!.token);        
      fetchUser();
    }
  }

  return (
    <View style={{
        flex: 1,
        paddingVertical: theme.spacing.xl,
        alignItems: "center",
        backgroundColor: theme.colors.background
    }}>

        <Text style={{
            marginTop: theme.spacing.xl, 
            marginBottom: theme.spacing.m, 
            width: "70%", 
            fontWeight: "bold" ,
            ...theme.textVariants.header
        }}>
            Start by creating an account
        </Text>
        
        <TextInputComponent theme={theme} value={username} setValue={setUsername} pHolder={"Username"}/>
        <TextInputComponent theme={theme} value={firstname} setValue={setFirstname} pHolder={"First Name"}/>
        <TextInputComponent theme={theme} value={lastname} setValue={setLastname} pHolder={"Last Name"}/>
        <TextInputComponent theme={theme} value={email} setValue={setEmail} pHolder={"Email"}/>
        <TextInputComponent theme={theme} value={password} setValue={setPassword} pHolder={"Password"} secure={true}/>
        <TextInputComponent theme={theme} value={cpassword} setValue={setCpassword} pHolder={"Confirm Password"} secure={true}/>


        <Button style={{
                justifyContent: "center",
                width: "80%",
                backgroundColor: theme.colors.contrast,
                borderRadius: 10,
                marginVertical: theme.spacing.l,
                paddingVertical: theme.spacing.m,
                alignItems: "center"
            }}
            onPress={registerUser}    
            loading={isLoading}
        >
              <Text variant='headlineSmall' style={{
                color: theme.colors.textContrast,
              }}>
                Register
              </Text>
        </Button>

    </View>
  )
}

