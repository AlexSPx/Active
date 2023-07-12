import { createStackNavigator } from '@react-navigation/stack'
import React, { useState } from 'react'
import { useTheme } from '../../../contexts/ThemeContext';
import SearchFilters from './search/filters';
import SearchMenu from "./search";

const Stack = createStackNavigator();

export interface FilterTags {
    filters: SearchFilterTagProps;
    setFilterTag: (filter: {name:string, value: string}) => void;
}

export interface MenuProps {
    filters: SearchFilterTagProps;
    removeFilter: (name: string) => void;
}

export interface SearchFilterTagProps {
    level: string | null,
    exercisetype: string | null,
    bodypart: string | null,
    equipment: string | null,
}

export default function _layout() {
    const [searchFilterTags, setSearchFilterTags] = useState<SearchFilterTagProps>({
        level: null,
        exercisetype: null,
        bodypart:  null,
        equipment: null,
    });
    
    const theme = useTheme();

    const setFilterTag = (filter: {name: string, value: string}) => {
        setSearchFilterTags(sft => {
            return {
                ...sft,
                [filter.name]: filter.value
            }          
        })
    }

    const removeFilter = (name: string) => setSearchFilterTags(sft => {
        return {
            ...sft,
            [name]: null
        }
    })

  return (
    <Stack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: theme.colors.background,
            height: 100
        },
        headerShadowVisible: false,
        headerTitleStyle: {
            fontWeight: "bold",
            alignItems: "center",
            ...theme.textVariants.header
        },
    }}>
        <Stack.Screen name='search'>
            {props => <SearchMenu filters={searchFilterTags} removeFilter={removeFilter}/>}
        </Stack.Screen>
        <Stack.Screen name='search/filters' options={{
            headerShown: false
        }}>
            {props => <SearchFilters filters={searchFilterTags} setFilterTag={setFilterTag}/>}
        </Stack.Screen>
    </Stack.Navigator>
  )
}
