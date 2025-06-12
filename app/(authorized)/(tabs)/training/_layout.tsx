import { DraftProgramProvider } from "@/components/providers/DraftProgramProvider";
import { ProgramProvider } from "@/components/providers/ProgramProvider";
import { Stack } from "expo-router"



export default function TrainingLayout() {
    return (
        <ProgramProvider>
            <DraftProgramProvider>
                <Stack >
                    <Stack.Screen name="index" options={{headerShown: false}} />
                    <Stack.Screen name="program" options={{headerShown: false}} />
                    <Stack.Screen name="create" options={{headerShown: false}} />
                </Stack>
            </DraftProgramProvider>
        </ProgramProvider>
    );
}