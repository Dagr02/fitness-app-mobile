import React, {createContext, useContext, useState, ReactNode, useCallback} from 'react';

export type ProgramExercise = {
    exerciseId: number;
    programExerciseId?: number;
    exerciseName: string;
    sets: number;
    reps: number;
    orderIndex: number;
    dayNumber?: number;
    completedSets?: number;
    completedReps?: number;
    weightUsed?: number;
    workoutDate?: string;
};

export type ProgramDay = {
    dayNumber: number;
    exercises: ProgramExercise[];
};

export type ProgramData = {
    program: {
        id: number;
        name: string;
        description: string;
        startDate: string;
        endDate: string;
    };
    days: ProgramDay[];
    currentDay: number;
    numDays: number;

};



type ProgramContextType = {
    data: ProgramData;
    updateData: (updates: Partial<ProgramData>) => void;
    resetData: () => void;

    needsRefresh: boolean;
    markNeedsRefresh: () => void;
    clearNeedsRefresh: () => void;
}

const defaultData: ProgramData = {
    program: {
        id: 0,
        name: '',
        description: '',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
    },
    days: [],
    currentDay: 1,
    numDays: 0,
};

const ProgramContext = createContext<ProgramContextType>({
   data: defaultData,
   updateData: () => {},
   resetData: () => {},

   needsRefresh: false,
   markNeedsRefresh: () => {},
   clearNeedsRefresh: () => {},
});


export const useProgram = () => useContext(ProgramContext);


export const ProgramProvider = ({children} : {children: ReactNode}) => {
   const [data, setData] = useState<ProgramData>(defaultData);
   const [needsRefresh, setNeedsRefresh] = useState(false);

   const updateData = (newData: Partial<ProgramData>) => {
       setData((prev) => {
         const updated = { ...prev, ...newData };

         if (newData.program) {
           updated.program = { ...prev.program, ...newData.program };
         }

         return updated;
       });
   }


   const resetData = () => setData(defaultData);

   const markNeedsRefresh = useCallback(() => setNeedsRefresh(true), []);
   const clearNeedsRefresh = useCallback(() => setNeedsRefresh(false), []);

   return (
       <ProgramContext.Provider value ={{data, updateData, resetData, needsRefresh, markNeedsRefresh, clearNeedsRefresh}}>
            {children}
       </ProgramContext.Provider>
   );

};

