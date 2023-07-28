import React from "react";
import FAIcons from "react-native-vector-icons/FontAwesome";
import FTIcons from "react-native-vector-icons/Feather";
import FA5Icons from "react-native-vector-icons/FontAwesome5";
import MAIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import Home from "./home";
import Workouts, { WorkoutWithRecords } from "./workouts/MainMenu"
import Profile from "./profile";
import { Appbar, Button, useTheme } from "react-native-paper";
import WorkoutPreview from "./workouts/WorkoutPreview";
import RunningWorkout from "./workouts/RunningWorkout";
import { useWorkout } from "../../contexts/WorkoutContext";
import History, { WorkoutHistoryProps } from "./workouts/History";
import WorkoutHistory from "./workouts/WorkoutHistory";

export type TabsParamList = {
    home: undefined;
    WorkoutsHistory: undefined;
    WorkoutHistory: { workout: WorkoutHistoryProps | undefined };
    workouts: undefined;
    WorkoutPreview: { workout: WorkoutWithRecords | undefined };
    profile: undefined;
    RunningWorkout: undefined;
    CreateWorkout: undefined;
};

const Tabs = createBottomTabNavigator<TabsParamList>();

export default function AuthRoutes({navigation}: NativeStackScreenProps<TabsParamList>) {
    const {colors} = useTheme();
    const {isWorkoutRunning} = useWorkout();

    return (
            <Tabs.Navigator
                screenOptions={{
                    tabBarHideOnKeyboard: true,
                    header: (props) => (
                        <Appbar.Header style={{backgroundColor: colors.background}}>
                            {props.options.headerLeft && props.options.headerLeft({})}
                            <Appbar.Content title={props.options.headerTitle ? props.options.headerTitle.toString() : props.route.name} />
                            {props.route.name === "RunningWorkout" ? null :
                            isWorkoutRunning() ? 
                            <Button mode="contained-tonal"
                                style={{
                                    backgroundColor: colors.primaryContainer,
                                    marginRight: 6
                                }}
                                onPress={() => navigation.navigate("RunningWorkout")}
                            >
                                <FA5Icons name="play" 
                                    size={20} 
                                />
                            </Button>   
                            :
                            props.options.headerRight && props.options.headerRight({})
                            
                            }
                        </Appbar.Header>
                    ),
                    tabBarLabelStyle: {
                        fontSize: 16,
                        margin: 0,
                        padding: 0
                    },
                    tabBarStyle: {
                        backgroundColor: colors.surface,
                        height: "8%",
                        shadowOpacity: 0,
                        borderWidth: 0,
                        borderTopEndRadius: 30,
                        borderTopStartRadius: 30,
                        overflow: 'hidden'
                    },
                    tabBarShowLabel: false
                }}
            >
                <Tabs.Screen name="home" options={{
                        headerTitle: "Home",
                        tabBarLabel: "Home",
                        tabBarIcon: ({color, size}) => (
                            <FAIcons name="home" color={color} size={size+10} />
                        ),
                    }}
                    component={Home}
                />
                <Tabs.Screen name="WorkoutsHistory" options={{
                        headerTitle: "Workouts History",
                        tabBarLabel: "History",
                        tabBarIcon: ({color, size}) => (
                            <MAIcons name="history" color={color} size={size+10} />
                        ),
                    }}
                    component={History}
                />
                <Tabs.Screen name="WorkoutHistory" options={{
                        headerTitle: "History",
                        tabBarStyle: {display: 'none'},
                        tabBarButton: () => null,
                        headerLeft: () => <Appbar.BackAction onPress={() => navigation.navigate("WorkoutsHistory")} />
                    }}
                    component={WorkoutHistory}
                />
                <Tabs.Screen name="workouts" options={{
                        headerTitle: "Workouts",
                        headerRight: () => (
                            <Button mode="contained-tonal" 
                                onPress={() => navigation.navigate("CreateWorkout")}
                                style={{
                                    padding:0, 
                                    marginRight: 12,
                                    backgroundColor: colors.primaryContainer
                                }}
                            >
                                <FTIcons name="plus" size={20}/>
                            </Button>
                        ),
                        tabBarLabel: "Workouts",
                        tabBarIcon: ({color, size}) => (
                            <FA5Icons name="dumbbell" color={color} size={size} />
                        ),
                    }}
                    component={Workouts}
                />
                <Tabs.Screen name='WorkoutPreview' options={{
                    headerTitle: "Workout Preview",
                    tabBarStyle: {display: 'none'},
                    tabBarButton: () => null,
                    headerLeft: () => <Appbar.BackAction onPress={() => navigation.navigate("workouts")} />
                }}
                    component={WorkoutPreview} 
                />
                <Tabs.Screen name="RunningWorkout" options={{
                    headerTitle: "Your Workout",
                    tabBarStyle: {display: 'none'},
                    tabBarButton: () => null,
                    headerLeft: () => <Appbar.BackAction onPress={() => navigation.navigate("workouts")} />
                }}
                    component={RunningWorkout} 
                />

                <Tabs.Screen name="profile" options={{
                        headerTitle: "Profile",
                        tabBarLabel: "Profile",
                        tabBarIcon: ({color, size}) => (
                            <FTIcons name="user" color={color} size={size+10} />
                        ),
                    }}
                    component={Profile}
                />
            </Tabs.Navigator>
    )
}