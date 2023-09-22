import React, { memo, useState } from "react";
import LeftSwipeableComponent from "../../../../components/LeftSwipeableComponent";
import { DataTable, TextInput, useTheme } from "react-native-paper";
import {
  removeSet,
  setSetRepsCreate,
  setSetWeightCreate,
} from "../../../../utils/exerciseHelpers";
import { useSetRecoilState } from "recoil";
import { createExercisesAtom } from "../../../../contexts/CreateWorkoutState";
import { ExerciseSet as ExerciseSetProps } from "../../../../contexts/CreateWorkoutState";

function ExerciseSet({
  set,
  exerciseIdx,
  setIdx,
}: {
  set: ExerciseSetProps;
  exerciseIdx: number;
  setIdx: number;
}) {
  const setExercises = useSetRecoilState(createExercisesAtom);
  const { colors } = useTheme();

  return (
    <LeftSwipeableComponent
      onSwipe={() =>
        setExercises((prev) => removeSet(prev, exerciseIdx, setIdx))
      }
    >
      <DataTable.Row
        key={setIdx}
        style={{ backgroundColor: colors.background }}
      >
        <DataTable.Cell>{setIdx + 1}</DataTable.Cell>
        <WorkoutTabelCell
          value={set.weight.toString()}
          onChange={(t: string) =>
            setExercises((prev) =>
              setSetWeightCreate(prev, exerciseIdx, setIdx, t)
            )
          }
        />
        <WorkoutTabelCell
          value={set.reps.toString()}
          onChange={(t: string) =>
            setExercises((prev) =>
              setSetRepsCreate(prev, exerciseIdx, setIdx, t)
            )
          }
        />
      </DataTable.Row>
    </LeftSwipeableComponent>
  );
}

const WorkoutTabelCell = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (t: string) => void;
}) => {
  const [inputValue, setInputValue] = useState(value);

  return (
    <DataTable.Cell style={{ justifyContent: "center" }}>
      <TextInput
        underlineColor="transperent"
        keyboardType="numeric"
        style={{
          height: 30,
          paddingHorizontal: 2,
          textAlign: "center",
          width: 60,
          borderRadius: 5,
        }}
        outlineStyle={{
          borderRadius: 30,
        }}
        value={inputValue}
        onChangeText={(text) => setInputValue(text)}
        onEndEditing={() => onChange(inputValue)}
      />
    </DataTable.Cell>
  );
};

function debounce(func: () => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };
}

export default memo(ExerciseSet);
