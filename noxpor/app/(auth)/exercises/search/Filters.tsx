import React from 'react'
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import { useTheme } from '../../../../contexts/ThemeContext'
import { ScrollView } from 'react-native-gesture-handler';
import { theme } from '../../../../themes/theme';
import { FilterTags, SearchFilterTagProps } from '../SearchModal';

interface Filter {
    name: string,
    values: string[]
}

const filterTags: Filter[] = [
    {
      "name": "ExerciseType",
      "values": [
        "Strength",
        "Plyometrics",
        "Cardio",
        "Stretching",
        "Powerlifting",
        "Strongman",
        "Olympic Weightlifting"
      ]
    },
    {
      "name": "BodyPart",
      "values": [
        "Abdominals",
        "Adductors",
        "Abductors",
        "Biceps",
        "Calves",
        "Chest",
        "Forearms",
        "Glutes",
        "Hamstrings",
        "Lats",
        "Lower Back",
        "Middle Back",
        "Traps",
        "Neck",
        "Quadriceps",
        "Shoulders",
        "Triceps"
      ]
    },
    {
      "name": "Equipment",
      "values": [
        "Bands",
        "Barbell",
        "Kettlebells",
        "Dumbbell",
        "Other",
        "Cable",
        "Machine",
        "Body Only",
        "Medicine Ball",
        "Exercise Ball",
        "Foam Roll",
        "EZ Curl Bar",
        "None"
      ]
    },
    {
      "name": "Level",
      "values": [
        "Intermediate",
        "Beginner",
        "Expert"
      ]
    }
  ]
  

interface FilterSection extends Filter, FilterTags {}

export default function SearchFilters(
    {filters ,setFilterTag}: 
    FilterTags
) {

    const theme = useTheme();

  return (
    <SafeAreaView style={{
      flex: 1,
    }}>
      <ScrollView style={{
        // flex: 1,
        paddingTop: "15%",
        paddingHorizontal: "5%",
        backgroundColor: theme.colors.background
    }}>

        <Text style={{
            paddingHorizontal: "10%",
            marginBottom: "10%",
            ...theme.textVariants.header,
            fontSize: 40
        }}>
            Filters
        </Text>
    {filterTags.map(tag => <FilterSection key={tag.name} name={tag.name} values={tag.values} filters={filters} setFilterTag={setFilterTag}/>)}

    </ScrollView>
    </SafeAreaView>
  )
}


const FilterSection = ({name, values, filters, setFilterTag}: FilterSection) => {    
  
  const normalizedName = name.toLocaleLowerCase();
  
  return (
        <View key={name} style={{
            flex: 1,
        }}>
            <Text style={{
                marginBottom: 12,
                ...theme.textVariants.header
            }}>{name}</Text>
            <View style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap"
            }}>
                {values.map(value => (
                    <TouchableOpacity key={value} style={{
                        paddingHorizontal: 13,
                        paddingVertical: 3,
                        margin: 2,
                        backgroundColor: filters[normalizedName as keyof SearchFilterTagProps] === value ? theme.colors.accentSecondary : theme.colors.accentMain,
                        borderRadius: 30,
                        ...theme.textVariants.body,
                    }}
                    onPress={() => setFilterTag({name: normalizedName,value})}
                    >
                        <Text>{value}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}
