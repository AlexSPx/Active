import { FlatList, View } from "react-native";
import {
  WorkoutExerciseCreate,
  createExercisesAtom,
} from "../../../../contexts/CreateWorkoutState";
import { Button, DataTable, Text } from "react-native-paper";
import { useSetRecoilState } from "recoil";
import { addSetCreate } from "../../../../utils/exerciseHelpers";
import ExerciseSet from "./ExerciseSet";
import { memo } from "react";

const Exercise = ({
  exercise,
  exerciseIdx,
}: {
  exercise: WorkoutExerciseCreate;
  exerciseIdx: number;
}) => {
  const setExercises = useSetRecoilState(createExercisesAtom);

  const Sets = () => (
    <FlatList
      data={exercise.sets}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item, index }) => (
        <ExerciseSet set={item} exerciseIdx={exerciseIdx} setIdx={index} />
      )}
    />
  );

  return (
    <View style={{ marginVertical: 6 }}>
      <View
        style={{
          // flex: 1,
          flexDirection: "row",
        }}
      >
        <Text variant="titleLarge">{exercise.title}</Text>
      </View>
      <DataTable>
        <DataTable.Header style={{ padding: 0 }}>
          <DataTable.Title textStyle={{ fontWeight: "bold", fontSize: 14 }}>
            Set
          </DataTable.Title>
          <DataTable.Title style={{ justifyContent: "center" }}>
            Kg
          </DataTable.Title>
          <DataTable.Title style={{ justifyContent: "center" }}>
            Reps
          </DataTable.Title>
        </DataTable.Header>
      </DataTable>

      <Sets />

      <Button
        mode="text"
        style={{ borderRadius: 10, marginTop: 12 }}
        onPress={() => setExercises((prev) => addSetCreate(prev, exerciseIdx))}
      >
        Add Set
      </Button>
    </View>
  );
};

export default memo(Exercise);
