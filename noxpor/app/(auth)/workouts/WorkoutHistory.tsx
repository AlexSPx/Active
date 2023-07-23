import React from 'react' 
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../contexts/ThemeContext';
import { TabsParamList } from '../AuthRoutes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text } from 'react-native-paper';
import { formatDateToDdMmYyyy } from '../../../utils/helpers';
import { View } from 'react-native';

type Props = NativeStackScreenProps<TabsParamList, "WorkoutHistory">;

export default function WorkoutHistory({navigation, route}: Props) {
    const {workout} = route.params;
    if(!workout) return null;    

    const theme = useTheme();   

    return (
    <SafeAreaView mode="padding" style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.m
    }}>
        <Text variant='displaySmall' style={{marginTop: 0}}>{workout.title}</Text>
        <Text>Complited {formatDateToDdMmYyyy(workout.created_at)}</Text>

        {workout.exercises.map(exercise => (
            <View key={exercise.id} style={{marginVertical: 6}}>
                <Text variant='headlineSmall'>{exercise.exercise_name}</Text>
                {exercise.weight.map((wg, index) => (
                    <Text variant='labelLarge'>{wg}kgs x {exercise.reps[index]}</Text>
                ))}
            </View>
        ))}
    </SafeAreaView>
  )
}
