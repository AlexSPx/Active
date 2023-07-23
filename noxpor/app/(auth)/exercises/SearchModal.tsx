import { createStackNavigator } from '@react-navigation/stack'
import React, { useMemo, useState } from 'react'
import { useTheme } from '../../../contexts/ThemeContext';
import SearchFilters from './search/Filters';
import SearchMenu from "./search/Search";

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

export default function SearchModal() {
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

    // Create a unique key based on the searchFilterTags state for SearchMenu component
    const searchMenuKey = useMemo(() => JSON.stringify(searchFilterTags), [searchFilterTags]);

    // Create a unique key based on the searchFilterTags state for SearchFilters component
    const searchFiltersKey = useMemo(() => JSON.stringify(searchFilterTags), [searchFilterTags]);

  return (
    <Stack.Navigator screenOptions={{
        presentation: 'modal',
        headerStyle: {
            backgroundColor: theme.colors.background,
            height: 100
        },
        headerTitleStyle: {
            fontWeight: "bold",
            alignItems: "center",
            ...theme.textVariants.header
        },
    }}>
        <Stack.Screen name='search'>
            {props => <SearchMenu {...props} filters={searchFilterTags} removeFilter={removeFilter} key={searchMenuKey}/>}
        </Stack.Screen>
        <Stack.Screen name='Filters' options={{
            headerShown: false
        }}>
            {props => <SearchFilters {...props} filters={searchFilterTags} setFilterTag={setFilterTag} key={searchFiltersKey}/>}
        </Stack.Screen>
    </Stack.Navigator>
  )
}
