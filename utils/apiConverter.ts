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
  startDate: string; // ISO string
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