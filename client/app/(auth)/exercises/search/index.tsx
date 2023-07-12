import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useTheme } from '../../../../contexts/ThemeContext'
import SearchBar from '../../../../components/SearchBar';
import { Stack } from 'expo-router';
import { MenuProps, SearchFilterTagProps } from '../_layout';
import axios from 'axios';
import { API_ADDRESS } from '../../../../utils/configs';
import ExerciseCard, { Exercise } from '../../../../components/ExerciseCard';

export default function Search({filters, removeFilter}: MenuProps) {
    const theme = useTheme();
    
    const [title, setTitle] = useState("")
    const [exercises, setExercises] = useState<Exercise[] | null>(null);


    const buildUrl = () => {
        let filterTags = "";
        let filterValues = "";
        
        let key: keyof SearchFilterTagProps;
        for(key in filters){
            if (filters[key] === null) continue;
            filterTags += `,${key}`;
            filterValues += `,${filters[key]!.replace(/\s+/g, '').toLocaleLowerCase()}`;
        }
        
        return `${API_ADDRESS}/exercise/search?strategy_tags=title${filterTags}&search_value_tags=${title}${filterValues}&page=1`;
    }

    const getSearchResults = async () => {        
        try {
            const res = await axios.get(buildUrl(), {headers: {
                'Content-Type': 'application/json',
              }});
            setExercises(res.data.exercises);
        } catch (error) {
            // if(isAxiosError(error)) console.log(error.response?.data);   
        }
    }
    

    return (
    <View style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: "5%",
    }}>
        
        <Stack.Screen options={{
            headerTitle: () => {
                return <SearchBar title={title} setTitle={setTitle} theme={theme} executeSearch={getSearchResults}/>
            },
        }}/>
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
                exercises.map(exercise => <ExerciseCard key={exercise.id} exercise={exercise} theme={theme}/>)
            )}
        </ScrollView>
    </View>  
  )
}
