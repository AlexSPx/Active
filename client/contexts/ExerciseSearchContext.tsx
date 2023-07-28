import React, { createContext, useState } from 'react';
import { Exercise } from '../components/ExerciseCard';

type ExerciseSearchContextType = {
  searchFunction: (exercise: Exercise) => void;
  setSearchFunction: React.Dispatch<React.SetStateAction<(exercise: Exercise) => void>>;
};

const ExerciseSearchContext = createContext<ExerciseSearchContextType>({
  searchFunction: () => {},
  setSearchFunction: () => {},
});

export const useExerciseSearch = () => React.useContext(ExerciseSearchContext);

export default function ExerciseSearchProvider({children}: {children: React.ReactNode}){
  const [searchFunction, setSearchFunction] = useState<(exercise: Exercise) => void>(() => {});

  return (
    <ExerciseSearchContext.Provider value={{ searchFunction, setSearchFunction }}>
      {children}
    </ExerciseSearchContext.Provider>
  );
}