import { ProgramData } from '@/components/providers/ProgramProvider';

export type CreateExerciseDTO = {
  exerciseId: number;
  sets: number;
  reps: number;
  weight?: number;
};

export type CreateProgramDayDTO = {
  day: number;
  exercises: CreateExerciseDTO[];
};

export type CreateProgramDTO = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  workouts: CreateProgramDayDTO[];
};

export function convertProgramDataToCreateProgramDTO(data: ProgramData): CreateProgramDTO {
  return {
    name: data.program.name,
    description: data.program.description,
    startDate: data.program.startDate,
    endDate: data.program.endDate,
    workouts: data.days.map(day => ({
      day: day.dayNumber,
      exercises: day.exercises.map(exercise => ({
        exerciseId: exercise.exerciseId,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weightUsed,
      })),
    })),
  };
}

// update program dto

export type UpdateExerciseDTO = {
  programExerciseId?: number;
  exerciseId: number;
  sets: number;
  reps: number;
  weight?: number;
};

export type UpdateProgramDayDTO = {
  day: number;
  exercises: UpdateExerciseDTO[];
};

export type UpdateProgramDTO = {
  programId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  workouts: UpdateProgramDayDTO[];
};

export function convertProgramDataToUpdateProgramDTO(data: ProgramData): UpdateProgramDTO {
  return {
    programId: data.program.id,
    name: data.program.name,
    description: data.program.description,
    startDate: data.program.startDate,
    endDate: data.program.endDate,
    workouts: data.days.map(day => ({
      day: day.dayNumber,
      exercises: day.exercises.map(exercise => ({
        programExerciseId: exercise.programExerciseId,
        exerciseId: exercise.exerciseId,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weightUsed,
      })),
    })),
  };
}