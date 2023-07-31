import { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { DataTable, TextInput, useTheme } from "react-native-paper";
import { WorkoutExerciseCurrent } from "../../../../contexts/WorkoutContext";
import Icon from "react-native-vector-icons/FontAwesome5";

type ExerciseSetCardProps = {
  idx: number;
  reps: number;
  exercise: WorkoutExerciseCurrent;
  toggleFinish: (id: number, idx: number) => void;
  inputFinishAwait: (type: "reps" | "weight", id: number, e: string) => void;
};

export const ExerciseSet = ({
  exercise,
  toggleFinish,
  inputFinishAwait,
  idx,
  reps,
}: ExerciseSetCardProps) => {
  const { colors } = useTheme();

  return (
    <DataTable.Row
      style={{
        backgroundColor: exercise.finished[idx]
          ? colors.elevation.level3
          : colors.background,
      }}
    >
      <DataTable.Cell style={exerciseSetStyles.smallCell}>
        {idx + 1}
      </DataTable.Cell>
      <WorkoutTabelCell
        value={exercise.weight[idx]}
        onChange={(t: string) => inputFinishAwait("weight", idx, t)}
        styles={{
          backgroundColor: exercise.finished[idx]
            ? colors.primaryContainer
            : colors.surfaceVariant,
        }}
      />
      <WorkoutTabelCell
        value={reps}
        onChange={(t: string) => inputFinishAwait("reps", idx, t)}
        styles={{
          backgroundColor: exercise.finished[idx]
            ? colors.primaryContainer
            : colors.surfaceVariant,
        }}
      />
      <DataTable.Cell style={exerciseSetStyles.smallCell}>
        <TouchableOpacity
          style={[
            exerciseSetStyles.finishButton,
            {
              backgroundColor: exercise.finished[idx]
                ? colors.primaryContainer
                : colors.surfaceVariant,
            },
          ]}
          onPress={() => toggleFinish(exercise.exercise_id, idx)}
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
