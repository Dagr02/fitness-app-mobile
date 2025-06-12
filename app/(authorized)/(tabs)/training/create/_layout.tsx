import { DraftProgramProvider } from "@/components/providers/DraftProgramProvider";
import { Stack } from "expo-router";




export default function CreateProgramLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}