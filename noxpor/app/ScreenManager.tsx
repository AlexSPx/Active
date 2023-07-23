import { NavigationContainer, useTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import WelcomeScreen from './(public)/WelcomeScreen';
import Login from './(public)/login';
import Register from './(public)/register';
import AuthRoutes from './(auth)/AuthRoutes';
import { useAuth } from '../contexts/AuthContext';
import SearchModal from './(auth)/exercises/SearchModal';
import CreateWorkout from './(auth)/workouts/CreateWorkout';

const RootStack = createNativeStackNavigator();

export default function ScreenManager() {

    const {user} = useAuth()
    const theme = useTheme()

    return (
    <NavigationContainer>
        <RootStack.Navigator screenOptions={{
            headerShown: false,
            contentStyle: {
                backgroundColor: theme.colors.background 
            }
        }}>
            {!user ? (
                <RootStack.Group>
                    <RootStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
                    <RootStack.Screen name="login" component={Login} />
                    <RootStack.Screen name="register" component={Register} />
                </RootStack.Group>
            ) : (
                <RootStack.Group>
                    <RootStack.Screen name="(auth)" component={AuthRoutes}/>
                    <RootStack.Screen name="ExerciseSearch" component={SearchModal}/>
                    <RootStack.Screen options={{animation: "fade_from_bottom"}} name="CreateWorkout" component={CreateWorkout} />
                </RootStack.Group>
            )}
        </RootStack.Navigator>
    </NavigationContainer>
  )
}
