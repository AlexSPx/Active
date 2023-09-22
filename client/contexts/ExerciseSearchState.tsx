import { atom } from "recoil";
import { Exercise } from "../components/ExerciseCard";

export enum FilterEnum {
  ExerciseType = "exercisetype",
  BodyPart = "bodypart",
  Equipment = "equipment",
  Level = "level",
}

export type Tags = {
  exercisetype: string | null;
  bodypart: string | null;
  equipment: string | null;
  level: string | null;
};

export const exerciseSearchQueryAtom = atom<{
  name: string;
  tags: Tags;
}>({
  key: "ExerciseSearchQuery",
  default: {
    name: "",
    tags: {
      [FilterEnum.ExerciseType]: null,
      [FilterEnum.BodyPart]: null,
      [FilterEnum.Equipment]: null,
      [FilterEnum.Level]: null,
    },
  },
});

export const exerciseSearchQueryResultsAtom = atom<Exercise[]>({
  key: "ExerciseSearchQueryResult",
  default: [],
});

export function removeFilter(tags: Tags, filter: FilterEnum): Tags {
  return {
    ...tags,
    [filter]: null,
  };
}
