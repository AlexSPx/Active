import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { API_ADDRESS } from "../utils/configs";
import { getToken, removeToken } from "../utils/userTokens";
import axios from 'axios';

interface User {
    id: string,
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    isConfirmed: boolean,
    created_date: Date,
}

interface AuthContext {
    user: User | null,
    fetchUser: () => {},
    signOut: () => {}
}

const AuhtContext = React.createContext<AuthContext | null>(null);

export function useAuth(){
    const authContext = React.useContext(AuhtContext);

    if (!authContext) {
        throw new Error(
          "useCurrentUser has to be used within <CurrentUserContext.Provider>"
        );
      }

    return authContext
}

function useProtectedRoute(isAuth: User | null) {
    const segments = useSegments();
    const router = useRouter();

    
    useEffect(() => {
        const isAuthGroup = segments[0] === "(auth)";        
        if(
            isAuthGroup && !isAuth
        ) {
            //redirect to home screen
            router.replace("/");
        } else if(!isAuthGroup && isAuth){
            router.replace("/home")
        }
    }, [isAuth, segments])

}


export function AuthProvider({children}: {children: React.ReactNode}){
    const [user, setUser] = useState<User | null>(null);

    
    const fetch = async () => {
        const token = await getToken();
        
        try {
            const res = await axios.get<User>(`${API_ADDRESS}/user/me`, {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            })
            
            setUser(res.data);
        } catch (error) {
            await removeToken();
        }
    };
    
    useEffect(() => {
      fetch();
    }, [])
    

    useProtectedRoute(user);

    return (
        <AuhtContext.Provider 
            value={{
                fetchUser: fetch,
                signOut: async () => await removeToken(),
                user,
            }}
        >
            {children}
        </AuhtContext.Provider>
    )
}