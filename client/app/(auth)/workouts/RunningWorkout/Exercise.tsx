import { FlatList, StyleSheet, View } from "react-native";
import { memo } from "react";
import React from "react";
import { DataTable, Button, Text } from "react-native-paper";
import LeftSwipeableComponent from "../../../../components/LeftSwipeableComponent";
import ExerciseSet from "./ExerciseSet";
import {
  WorkoutExerciseCurrent,
  currentExercisesAtom,
  addSet,
  removeSet,
} from "../../../../contexts/RunnigWorkoutContext";
import { useSetRecoilState } from "recoil";

const Exercise = ({
  exercise,
  exerciseIndex,
}: {
  exercise: WorkoutExerciseCurrent;
  exerciseIndex: number;
}) => {
  const setExercises = useSetRecoilState(currentExercisesAtom);

  return (
    <View style={{ marginVertical: 6 }}>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text variant="titleLarge">{exercise.title}</Text>
      </View>
      <DataTable>
        <DataTable.Header
          style={{ padding: 0, justifyContent: "space-between" }}
        >
          <DataTable.Title
            textStyle={{ fontWeight: "bold", fontSize: 14 }}
            style={exerciseStyles.titleButton}
          >
            Set
          </DataTable.Title>
          <DataTable.Title style={exerciseStyles.title}>Kg</DataTable.Title>
          <DataTable.Title style={exerciseStyles.title}>Reps</DataTable.Title>
          <DataTable.Title style={exerciseStyles.titleButton}>
            Finish
          </DataTable.Title>
        </DataTable.Header>
      </DataTable>

      <View style={{ flex: 1 }}>
        <FlatList
          data={exercise.sets}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <LeftSwipeableComponent
              onSwipe={() =>
                setExercises((prev) => removeSet(prev, exerciseIndex, index))
              } //handle set delete
            >
              <ExerciseSet
                set={item}
                exerciseIndex={exerciseIndex}
                setIndex={index}
              />
            </LeftSwipeableComponent>
          )}
        />
      </View>

      <Button
        mode="text"
        style={{ borderRadius: 10, marginTop: 12 }}
        onPress={() => setExercises((prev) => addSet(prev, exerciseIndex))}
      >
        Add Set
      </Button>
    </View>
  );
};

export default memo(Exercise);

const exerciseStyles = StyleSheet.create({
  title: {
    justifyContent: "center",
    maxWidth: "40%",
    alignItems: "center",
  },
  titleButton: {
    justifyContent: "center",
    maxWidth: "10%",
    alignItems: "center",
  },
});
