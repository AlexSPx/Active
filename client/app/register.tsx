import React, { useContext, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ThemeContext } from '../contexts/ThemeContext'
import TextInputComponent from '../components/TextInputComponent';

export default function Register() {

    const theme = useContext(ThemeContext)

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");


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
        <TextInputComponent theme={theme} value={name} setValue={setName} pHolder={"Name"}/>
        <TextInputComponent theme={theme} value={email} setValue={setEmail} pHolder={"Email"}/>
        <TextInputComponent theme={theme} value={password} setValue={setPassword} pHolder={"Password"}/>
        <TextInputComponent theme={theme} value={cpassword} setValue={setCpassword} pHolder={"Confirm Password"}/>


            <TouchableOpacity style={{
                    width: "80%",
                    backgroundColor: theme.colors.contrast,
                    borderRadius: 10,
                    marginVertical: theme.spacing.l,
                    paddingVertical: theme.spacing.m,
                    alignItems: "center"
                }}
                // onPress={() => router.push("/register")}    
            >
                <Text style={{
                    color: theme.colors.textContrast,
                    ...theme.textVariants.header
                }}>Register</Text>
            </TouchableOpacity>


    </View>
  )
}

