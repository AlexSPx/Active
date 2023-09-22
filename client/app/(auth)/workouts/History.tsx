import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";
import { useAuthFetch } from "../../../utils/authQuery";
import { Card, Text, useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TabsParamList } from "../AuthRoutes";
import { getBestSet } from "../../../utils/helpers";
import MainView from "../../../components/MainView";

export type WorkoutHistoryProps = {
  title: string;
  created_at: Date;
  exercises: Exercise[];
};

type Exercise = {
  id: number;
  exercise_name: string;
  workout_record_id: number;
  exercise_id: number;
  reps: number[];
  weight: number[];
};

export default function History({
  navigation,
}: NativeStackScreenProps<TabsParamList>) {
  const { data: records } =
    useAuthFetch<WorkoutHistoryProps[]>("/workout/history");
  const { colors } = useTheme();

  const [orderedRecords, setOrderedRecords] =
    useState<Map<string, WorkoutHistoryProps[]>>();

  useEffect(() => {
    const monthMap = new Map<string, WorkoutHistoryProps[]>();

    const formatOptions: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
    };

    records?.forEach((record) => {
      const date = new Date(record.created_at);
      const month = Intl.DateTimeFormat("en-US", formatOptions).format(date);

      if (!monthMap.has(month)) {
        monthMap.set(month, []);
      }

      const monthWorkouts = monthMap.get(month);
      if (monthWorkouts) {
        monthWorkouts.push(record);
      }
    });

    setOrderedRecords(monthMap);
  }, [records]);

  const RenderHistory = () => {
    if (!orderedRecords) return null;

    const arr = [];

    const keysArray = Array.from(orderedRecords.keys());
    for (const key in keysArray) {
      arr.push(
        <View>
          <Text
            variant="titleMedium"
            style={{ marginVertical: 3, marginHorizontal: 12 }}
          >
            {keysArray[key]}
          </Text>
        </View>
      );
    }
    return arr;
  };

  return (
    <MainView colors={colors}>
      {orderedRecords ? (
        <FlatList
          data={Array.from(orderedRecords.keys()).reverse()}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View>
              <Text
                variant="titleMedium"
                style={{ marginVertical: 3, marginHorizontal: 12 }}
              >
                {item}
              </Text>

              <FlatList
                data={orderedRecords.get(item)}
                keyExtractor={(item, index) =>
                  item.created_at.toString() + index
                }
                renderItem={({ item }) => (
                  <HistoryCard
                    record={item}
                    onPressFunc={() =>
                      navigation.navigate("WorkoutHistory", { workout: item })
                    }
                  />
                )}
              />
            </View>
          )}
        />
      ) : (
        <Text>No Records</Text>
      )}
    </MainView>
  );
}

const HistoryCard = ({
  record,
  onPressFunc,
}: {
  record: WorkoutHistoryProps;
  onPressFunc: () => void;
}) => {
  const { colors } = useTheme();

  return (
    <Card
      key={record?.created_at.toString()}
      mode="contained"
      style={{
        backgroundColor: colors.secondaryContainer,
        overflow: "hidden",
        marginVertical: 4,
      }}
    >
      <TouchableOpacity
        style={{
          padding: 12,
        }}
        onPress={onPressFunc}
      >
        <Card.Title title={record.title} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>Exercise</Text>
          <Text>Best Set</Text>
        </View>

        {record.exercises.map((exercise) => {
          const bestSet = getBestSet(exercise.weight, exercise.reps);
          return (
            <View
              key={exercise.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>
                {exercise.weight.length} x {exercise.exercise_name}
              </Text>
              <Text>
                {exercise.weight[bestSet]} x {exercise.reps[bestSet]}
              </Text>
            </View>
          );
        })}
      </TouchableOpacity>
    </Card>
  );
};
