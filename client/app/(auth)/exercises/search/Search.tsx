import React, { useState } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import SearchBar from '../../../../components/SearchBar';
import { MenuProps } from '../SearchModal';
import ExerciseCard, { Exercise } from '../../../../components/ExerciseCard';
import { useExerciseSearch } from '../../../../contexts/ExerciseSearchContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { buildUrl } from '../../../../utils/helpers';
import { useAuthQuery } from '../../../../utils/authQuery';
import { Chip, Text, useTheme } from 'react-native-paper';
import MainView from '../../../../components/MainView';

type SearchProps = MenuProps & NativeStackScreenProps<any>;

export default function Search({filters, removeFilter, navigation}: SearchProps) {
    const {colors} = useTheme();
    const {searchFunction} = useExerciseSearch()

    const [title, setTitle] = useState("")
    const [exercises, setExercises] = useState<Exercise[] | null>(null);    
    
    const {makeRequest} = useAuthQuery();

    const getSearchResults = async () => {      
            const data = await makeRequest<any>(buildUrl(filters, title));
            setExercises(data.exercises);
    }
    

    return (
        <MainView colors={colors}>
            <SearchBar title={title} setTitle={setTitle} colors={colors} executeSearch={getSearchResults} />
            <View style={{
                flexWrap: "wrap",
                flexDirection: "row",
                alignItems: 'center',
                marginBottom: 16
            }}>
            <Text variant="bodyLarge" style={{margin: 10}}>Filters:</Text>
            {Object.entries(filters).map(([keyName, value], i) => {
                if(value === null) return null;
                return (
                    <Chip key={i} mode='flat' style={{height: 35, marginHorizontal: 5}} onPress={() => removeFilter(keyName)}>
                        {value}
                    </Chip>
                )
            })}

            </View>
            <ScrollView
                style={{flex:1}}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                {exercises && (
                    exercises.map(exercise => <ExerciseCard key={exercise.id} exercise={exercise} colors={colors} func={searchFunction}/>)
                )}
            </ScrollView>
        </MainView>
    )
}
