import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProgramData } from '@/components/providers/ProgramProvider';

type DraftProgram = {
    program?: Partial<ProgramData['program']>;
    days?: ProgramData['days'];
    currentDay?: number;
    numDays?: number;
};

type DraftContextType = {
    draft: DraftProgram;
    setDraft: (updates: Partial<DraftProgram>) => void;
    resetDraft: () => void;
};

const DraftProgramContext = createContext<DraftContextType>({
    draft: {},
    setDraft: () => { },
    resetDraft: () => { },
});

export const useDraftProgram = () => useContext(DraftProgramContext);

export const DraftProgramProvider = ({ children }: { children: ReactNode }) => {
    const [draft, setDraftState] = useState<DraftProgram>({});

    const setDraft = (updates: Partial<DraftProgram>) => {
        setDraftState((prev) => ({ ...prev, ...updates }));
    };

    const resetDraft = () => setDraftState({});

    return (
        <DraftProgramContext.Provider value={{ draft, setDraft, resetDraft }}>
            {children}
        </DraftProgramContext.Provider>
    );
};