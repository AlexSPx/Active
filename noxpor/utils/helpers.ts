import { SearchFilterTagProps } from "../app/(auth)/exercises/SearchModal";
import { API_ADDRESS } from "./configs";

export function formatDateToDdMmYyyy(date: Date) {

    if (!(date instanceof Date)) {
        date = new Date(date);
        if (isNaN(date.getTime())) {
          return '';
        }
      }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`;
}

export const buildUrl = (filters: SearchFilterTagProps, title: string) => {
  let filterTags = "";
  let filterValues = "";
  
  let key: keyof SearchFilterTagProps;
  for(key in filters){
      if (filters[key] === null) continue;
      filterTags += `,${key}`;
      filterValues += `,${filters[key]!.toLocaleLowerCase()}`;
  }
  return `/exercise/search?strategy_tags=title${filterTags}&search_value_tags=${title}${filterValues}&page=1`;
}

export const getBestSet = (weights: number[], reps: number[]): number => {
  let bestSet:number = weights[0]*reps[0];
  let bestSetIndex:number = 0;
  for (let i = 1; i < weights.length; i++) {
      let calc = weights[i]*reps[i];
      if(calc > bestSet){
          bestSet = calc;
          bestSetIndex = i;
      }
  }

  return bestSetIndex;
}