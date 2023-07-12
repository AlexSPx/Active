import React, { useContext, useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { ThemeContext } from '../contexts/ThemeContext'
import TextInputComponent from '../components/TextInputComponent';
import axios from 'axios';
import { API_ADDRESS } from '../utils/configs';
import { saveToken } from '../utils/userTokens';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {

    const theme = useContext(ThemeContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [waiting, setWaiting] = useState(false);
    
    const { fetchUser } = useAuth();

  const loginUser = async () => {
    setWaiting(true);
    try {
      const res = await axios.post(`${API_ADDRESS}/login`, 
        {
          email,
          password
        },{
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        });        
        await saveToken(res.data.token);        
        fetchUser();
    } catch (error) {
      if(axios.isAxiosError(error)) console.log(error.response?.data);
    }
    setWaiting(false);
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
            Login to your account
        </Text>
        
        <TextInputComponent theme={theme} value={email} setValue={setEmail} pHolder={"Email"}/>
        <TextInputComponent theme={theme} value={password} setValue={setPassword} pHolder={"Password"}/>


            <TouchableOpacity style={{
                    flex: 1,
                    flexDirection: "row",
                    maxHeight: "10%",
                    justifyContent: "center",
                    width: "80%",
                    backgroundColor: theme.colors.contrast,
                    borderRadius: 10,
                    marginVertical: theme.spacing.l,
                    paddingVertical: theme.spacing.m,
                    alignItems: "center"
                }}
                onPress={loginUser}    
            >
                    {waiting && (
                      <View style={{ position: "absolute", left: "30%" }}>
                        <ActivityIndicator size="small" color={theme.colors.textContrast} />
                      </View>
                    )}
                    <Text style={{
                        color: theme.colors.textContrast,
                        ...theme.textVariants.header
                    }}>
                    Login
                    </Text>
            </TouchableOpacity>
    </View>
  )
}

