import { Tabs } from "expo-router";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import FAIcons from "react-native-vector-icons/FontAwesome";
import FTIcons from "react-native-vector-icons/Feather";
import FA5Icons from "react-native-vector-icons/FontAwesome5";


const AuthLayout = () => {
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: theme.colors.background,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                    fontWeight: "bold",
                    alignItems: "center",
                    ...theme.textVariants.header
                },
                tabBarLabelStyle: {
                    fontSize: 16,
                    margin: 0,
                    padding: 0
                },
                tabBarStyle: {
                    backgroundColor: theme.colors.secondary,
                    height: "8%",
                    shadowOpacity: 0,
                    borderWidth: 0,
                    borderTopEndRadius: 30,
                    borderTopStartRadius: 30,
                    position: 'absolute',
                    overflow: 'hidden'
                },
                tabBarShowLabel: false
            }}
        >
            <Tabs.Screen name="home" options={{
                    headerTitle: "Home",
                    href: "/home",
                    tabBarLabel: "Home",
                    tabBarIcon: ({color, size}) => (
                        <FAIcons name="home" color={color} size={size+10} />
                    ),
                }}
            />
            <Tabs.Screen name="workouts/index" options={{
                    headerTitle: "Workouts",
                    href: "/workouts",
                    tabBarLabel: "Workouts",
                    tabBarIcon: ({color, size}) => (
                        <FA5Icons name="dumbbell" color={color} size={size} />
                    ),
                }} 
            />
            <Tabs.Screen name="profile" options={{
                    headerTitle: "Profile",
                    href: "/profile",
                    tabBarLabel: "Profile",
                    tabBarIcon: ({color, size}) => (
                        <FTIcons name="user" color={color} size={size+10} />
                    ),
                }} 
            />
            <Tabs.Screen name="workouts/create" options={{
                tabBarButton: () => null,
            }}/>
            <Tabs.Screen name="exercises" options={{
                headerShown: false,
            }}/>
        </Tabs>
    )
}

export default AuthLayout;