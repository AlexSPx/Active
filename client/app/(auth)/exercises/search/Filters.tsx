import React from 'react'
import { View, SafeAreaView } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { FilterTags, SearchFilterTagProps } from '../SearchModal';
import { Chip, Text, useTheme } from "react-native-paper";

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

  const {colors} = useTheme()

  return (
    <SafeAreaView style={{
      flex: 1,
    }}>
      <ScrollView style={{
        paddingTop: "15%",
        paddingHorizontal: "5%",
        backgroundColor: colors.background
    }}>

        <Text variant="displaySmall" style={{
            marginBottom: "10%",
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
            <Text variant='headlineSmall' style={{marginBottom: 10}}>{name}</Text>
            <View style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap"
            }}>
                {values.map(value => (
                    <Chip key={value} onPress={() => setFilterTag({name: normalizedName,value})} style={{ margin: 2}}
                      selected={filters[normalizedName as keyof SearchFilterTagProps] === value}
                      showSelectedOverlay 
                    >
                      {value}
                    </Chip>
                ))}
            </View>
        </View>
    )
}
