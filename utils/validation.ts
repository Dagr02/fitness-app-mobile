import { ProgramData } from "@/components/providers/ProgramProvider";



export const isProgramValid = (data: ProgramData): boolean => {
  const { program } = data;

  if (!program.name?.trim()) return false;
  if (!program.description?.trim()) return false;
  if (!program.startDate || !program.endDate) return false;


  return true;
};
