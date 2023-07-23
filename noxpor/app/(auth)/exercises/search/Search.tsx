import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useTheme } from '../../../../contexts/ThemeContext'
import SearchBar from '../../../../components/SearchBar';
import { MenuProps, SearchFilterTagProps } from '../SearchModal';
import axios from 'axios';
import { API_ADDRESS } from '../../../../utils/configs';
import ExerciseCard, { Exercise } from '../../../../components/ExerciseCard';
import { useExerciseSearch } from '../../../../contexts/ExerciseSearchContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { buildUrl } from '../../../../utils/helpers';
import { useAuthQuery } from '../../../../utils/authQuery';

type SearchProps = MenuProps & NativeStackScreenProps<any>;

export default function Search({filters, removeFilter, navigation}: SearchProps) {
    const theme = useTheme();
    const {searchFunction} = useExerciseSearch()

    const [title, setTitle] = useState("")
    const [exercises, setExercises] = useState<Exercise[] | null>(null);    
    
    const {makeRequest} = useAuthQuery();

    useEffect(() => {
      navigation.setOptions({
        header: () => 
            <SearchBar title={title} setTitle={setTitle} theme={theme} executeSearch={getSearchResults} />,
      })
    }, [])

    const getSearchResults = async () => {      
            const data = await makeRequest<any>(buildUrl(filters, title));
            setExercises(data.exercises);
    }
    

    return (
    <View style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: "5%",
    }}>
        
        
        {/* return <SearchBar title={title} setTitle={setTitle} theme={theme} executeSearch={getSearchResults}/> */}
        <View style={{
            flexWrap: "wrap",
            flexDirection: "row",
            alignItems: 'center',
            marginBottom: theme.spacing.m
        }}>
        <Text style={{...theme.textVariants.body, fontSize: 25, margin: 10}}>Filters:</Text>
        {Object.entries(filters).map(([keyName, value], i) => {
            if(value === null) return null;
            return (
                <TouchableOpacity key={i} style={{
                    paddingHorizontal: 13,
                    paddingVertical: 3,
                    margin: 2,
                    backgroundColor: theme.colors.accentSecondary,
                    borderRadius: 30,
                    ...theme.textVariants.body
                }}
                onPress={() => removeFilter(keyName)}
                >
                    <Text>{value}</Text>
                </TouchableOpacity>
            )
        })}

        </View>
        <ScrollView
            style={{flex:1}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            {exercises && (
                exercises.map(exercise => <ExerciseCard key={exercise.id} exercise={exercise} theme={theme} func={searchFunction}/>)
            )}
        </ScrollView>
    </View>  
  )
}
