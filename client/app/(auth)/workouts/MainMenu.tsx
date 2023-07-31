import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuthFetch, useAuthQuery } from "../../../utils/authQuery";
import { Card, Menu, Text, useTheme } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import MainView from "../../../components/MainView";
import { MD3Colors } from "react-native-paper/lib/typescript/src/types";
import { TabsParamList } from "../AuthRoutes";
import { createThemedStyle } from "../../../themes/createThemedStyle";

export interface Workout {
  id: string;
  title: string;
  created_by: string;
  updated_at: string;
  structure_record_id: number;
}

export interface Exercise {
  id: number;
  title: string;
  user_id: string | null;
  workout_record_id: number;
  exercise_id: number;
  reps: number[];
  weight: number[];
}

export interface StructureRecord {
  id: number;
  created_at: string | null;
  workout_id: string | null;
  exercises: Exercise[];
}

export interface WorkoutWithRecords {
  workout: Workout;
  structure_record: StructureRecord;
}

export default function MainMenu({
  navigation,
}: NativeStackScreenProps<TabsParamList>) {
  const { data: workouts } = useAuthFetch<WorkoutWithRecords[]>("/workout");

  const { colors } = useTheme();

  return (
    <MainView colors={colors}>
      <FlatList
        data={workouts}
        keyExtractor={(workout) => workout.workout.id}
        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}
            onPressFunc={() =>
              navigation.navigate("WorkoutPreview", { workout: item })
            }
          />
        )}
      />
    </MainView>
  );
}

type WorkoutCardProps = {
  workout: WorkoutWithRecords;
  onPressFunc: () => void;
};

const WorkoutCard = ({ workout, onPressFunc }: WorkoutCardProps) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [menuCoordinates, setMenuCoordinates] = useState({ x: 0, y: 0 });

  const { makeRequest, error } = useAuthQuery();

  const deleteWorkout = async () => {
    await makeRequest(`/workout/${workout.workout.id}`, "DELETE");
    if (error) console.log(error);
  };

  const openMenu = (x: number, y: number) => {
    setMenuCoordinates({ x, y });
    setMenuOpened(true);
  };
  const closeMenu = () => setMenuOpened(false);

  const styles = useStyles();

  return (
    <Card key={workout.workout.id} mode="contained" style={styles.card}>
      <Menu visible={menuOpened} onDismiss={closeMenu} anchor={menuCoordinates}>
        <Menu.Item title="Delete" onPress={deleteWorkout} />
      </Menu>

      <TouchableOpacity
        style={{
          padding: 12,
        }}
        onPress={onPressFunc}
        onLongPress={({ nativeEvent }) =>
          openMenu(nativeEvent.pageX, nativeEvent.pageY)
        }
      >
        <Card.Title title={workout.workout.title} />
        <Card.Content style={{}}>
          <FlatList
            data={workout.structure_record.exercises}
            keyExtractor={(exercise) => exercise.id.toString()}
            renderItem={({ item }) => <ExerciseSet exercise={item} />}
          />
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};

const ExerciseSet = ({ exercise }: { exercise: Exercise }) => (
  <View
    key={exercise.id}
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
    }}
  >
    <Text>{exercise.title}</Text>
    <Text>{exercise.reps.length} sets</Text>
  </View>
);

const useStyles = createThemedStyle((theme) => ({
  card: {
    backgroundColor: theme.colors.secondaryContainer,
    overflow: "hidden",
    margin: 4,
  },
}));
