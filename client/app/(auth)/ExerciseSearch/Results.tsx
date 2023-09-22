import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";
import MainView from "../../../components/MainView";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  FilterEnum,
  Tags,
  exerciseSearchQueryAtom,
  exerciseSearchQueryResultsAtom,
  removeFilter,
} from "../../../contexts/ExerciseSearchState";
import { FlatList } from "react-native-gesture-handler";
import ExerciseCard, { Exercise } from "../../../components/ExerciseCard";
import { createExercisesAtom } from "../../../contexts/CreateWorkoutState";
import { addExercise } from "../../../utils/exerciseHelpers";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const extractTags = (tags: Tags): [FilterEnum, string][] => {
  const values: [FilterEnum, string][] = [];

  for (const key in tags) {
    const value = tags[key as keyof Tags];
    if (value !== null) {
      values.push([key as FilterEnum, value]);
    }
  }

  return values;
};

export default function Results({ navigation }: NativeStackScreenProps<any>) {
  const { colors } = useTheme();
  const [query, setQuery] = useRecoilState(exerciseSearchQueryAtom);
  const [exercises, _] = useRecoilState(exerciseSearchQueryResultsAtom);
  const setCreateExercises = useSetRecoilState(createExercisesAtom);
  const [filters, setFilters] = useState(extractTags(query.tags));

  useEffect(() => {
    setFilters(extractTags(query.tags));
  }, [query.tags]);

  return (
    <MainView colors={colors}>
      {filters.length > 0 && (
        <FlatList
          ListHeaderComponent={() => (
            <Text
              variant="headlineSmall"
              style={{ marginHorizontal: 6, marginBottom: 2 }}
            >
              Filters:
            </Text>
          )}
          contentContainerStyle={{
            flexDirection: "column",
          }}
          numColumns={3}
          data={filters}
          keyExtractor={([_, item]) => item}
          renderItem={({ item: [tag, item] }) => {
            return (
              <Chip
                mode="flat"
                style={{ marginHorizontal: 6, marginVertical: 2 }}
                onPress={() =>
                  setQuery((prev) => ({
                    ...prev,
                    tags: removeFilter(prev.tags, tag),
                  }))
                }
              >
                {item}
              </Chip>
            );
          }}
        />
      )}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExerciseCard
            colors={colors}
            exercise={item}
            func={(exercise: Exercise) => {
              setCreateExercises((prev) =>
                addExercise(prev, exercise.id, exercise.title)
              );
              navigation.navigate("CreateWorkout");
            }}
          />
        )}
      />
    </MainView>
  );
}
