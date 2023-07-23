import React, { useContext, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { ThemeContext } from '../../contexts/ThemeContext'
import TextInputComponent from '../../components/TextInputComponent';
import axios from 'axios';
import { API_ADDRESS } from '../../utils/configs';
import { saveToken } from '../../utils/userTokens';
import { useAuth } from '../../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from 'react-native-paper';
import { useAuthQuery } from '../../utils/authQuery';

export default function Login() {

    const theme = useContext(ThemeContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {makeRequest, isLoading, error} = useAuthQuery(false);
    
    const { fetchUser } = useAuth();

  const loginUser = async () => {
    const data = await makeRequest<{token: string}>("/login", 'POST', {email, password});
    if(!error){
      await saveToken(data!.token);        
      fetchUser();
    }
  }


  return (
    <SafeAreaView mode="padding" style={{
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
            Login to your account
        </Text>
        
        <TextInputComponent theme={theme} value={email} setValue={setEmail} pHolder={"Email"}/>
        <TextInputComponent theme={theme} value={password} setValue={setPassword} pHolder={"Password"} type='password' secure={true}/>


            <Button style={{
                    justifyContent: "center",
                    width: "80%",
                    backgroundColor: theme.colors.contrast,
                    borderRadius: 10,
                    marginVertical: theme.spacing.l,
                    paddingVertical: theme.spacing.m,
                    alignItems: "center"
                }}
                onPress={loginUser}    
                loading={isLoading}
            >
              <Text variant='headlineSmall' style={{
                color: theme.colors.textContrast,
              }}>
                Login
              </Text>
            </Button>
    </SafeAreaView>
  )
}

