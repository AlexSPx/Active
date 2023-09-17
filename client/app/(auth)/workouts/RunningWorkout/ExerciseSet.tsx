import { useState, useEffect, memo } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { DataTable, TextInput, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  ExerciseSet as ExerciseSetProps,
  currentExercisesAtom,
  setSetReps,
  toggleFinishExerciseSet,
} from "../../../../contexts/RunnigWorkoutContext";
import { useSetRecoilState } from "recoil";

const ExerciseSet = ({
  set,
  exerciseIndex,
  setIndex,
}: {
  set: ExerciseSetProps;
  exerciseIndex: number;
  setIndex: number;
}) => {
  const { colors } = useTheme();

  const setExercises = useSetRecoilState(currentExercisesAtom);

  return (
    <DataTable.Row
      style={{
        backgroundColor: set.finished
          ? colors.elevation.level3
          : colors.background,
      }}
    >
      <DataTable.Cell style={exerciseSetStyles.smallCell}>
        {setIndex + 1}
      </DataTable.Cell>
      <WorkoutTabelCell
        value={set.weight}
        onChange={(t: string) =>
          setExercises((prev) =>
            setSetReps(prev, exerciseIndex, setIndex, parseFloat(t))
          )
        } // set Weight
        styles={{
          backgroundColor: set.finished
            ? colors.primaryContainer
            : colors.surfaceVariant,
        }}
      />
      <WorkoutTabelCell
        value={set.reps}
        onChange={(t: string) =>
          setExercises((prev) => setSetReps(prev, exerciseIndex, setIndex, ~~t))
        } // set Reps
        styles={{
          backgroundColor: set.finished
            ? colors.primaryContainer
            : colors.surfaceVariant,
        }}
      />
      <DataTable.Cell style={exerciseSetStyles.smallCell}>
        <TouchableOpacity
          style={[
            exerciseSetStyles.finishButton,
            {
              backgroundColor: set.finished
                ? colors.primaryContainer
                : colors.surfaceVariant,
            },
          ]}
          onPress={() =>
            setExercises((prev) => {
              return toggleFinishExerciseSet(prev, exerciseIndex, setIndex);
            })
          }
        >
          <Icon name="plus" size={20} />
        </TouchableOpacity>
      </DataTable.Cell>
    </DataTable.Row>
  );
};

const WorkoutTabelCell = ({
  value,
  onChange,
  styles,
}: {
  value: number;
  onChange: (t: string) => void;
  styles?: Object;
}) => {
  const [val, setVal] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => onChange(val), 500);
    return () => clearTimeout(delay);
  }, [val]);

  return (
    <DataTable.Cell style={exerciseSetStyles.cell}>
      <TextInput
        underlineColor="transperent"
        keyboardType="numeric"
        style={[exerciseSetStyles.textInput, styles]}
        value={val}
        cursorColor="rgba(0,0,0,1)"
        activeUnderlineColor="rgba(0,0,0,0.0)"
        outlineStyle={{
          borderRadius: 30,
        }}
        placeholder={value.toString()}
        onChangeText={(text) => setVal(text)}
      />
    </DataTable.Cell>
  );
};

const exerciseSetStyles = StyleSheet.create({
  cell: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    maxWidth: "40%",
  },
  textInput: {
    flex: 1,
    height: 30,
    paddingHorizontal: 2,
    textAlign: "center",
    width: 100,
    borderRadius: 5,
  },
  finishButton: {
    flex: 1,
    width: 35,
    height: 35,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  smallCell: {
    justifyContent: "center",
    alignContent: "center",
    maxWidth: "10%",
    padding: 0,
  },
});

export default memo(ExerciseSet);
