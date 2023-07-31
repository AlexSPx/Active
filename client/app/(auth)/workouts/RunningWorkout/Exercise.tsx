import { FlatList, StyleSheet, View } from "react-native";
import {
  WorkoutExerciseCurrent,
  addSetProps,
  editValueProps,
  deleteSetProps,
} from "../../../../contexts/WorkoutContext";
import React from "react";
import { DataTable, Button, Text } from "react-native-paper";
import LeftSwipeableComponent from "../../../../components/LeftSwipeableComponent";
import { ExerciseSet } from "./ExerciseSet";

type ExerciseProps = {
  exercise: WorkoutExerciseCurrent;
  addSet: addSetProps;
  editValue: editValueProps;
  deleteSet: deleteSetProps;
  toggleFinish: (id: number, idx: number) => void;
};

export const Exercise = ({
  exercise,
  addSet,
  editValue,
  deleteSet,
  toggleFinish,
}: ExerciseProps) => {
  const inputFinishAwait = (type: "reps" | "weight", id: number, e: string) => {
    editValue("current", exercise.exercise_id, type, id, parseInt(e));
  };

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
          data={exercise.reps}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <LeftSwipeableComponent
              onSwipe={() => deleteSet("current", exercise.exercise_id, index)}
            >
              <ExerciseSet
                idx={index}
                reps={item}
                exercise={exercise}
                toggleFinish={toggleFinish}
                inputFinishAwait={inputFinishAwait}
              />
            </LeftSwipeableComponent>
          )}
        />
      </View>

      <Button
        mode="text"
        style={{ borderRadius: 10, marginTop: 12 }}
        onPress={() => addSet("current", exercise.exercise_id, 0, 0)}
      >
        Add Set
      </Button>
    </View>
  );
};

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
