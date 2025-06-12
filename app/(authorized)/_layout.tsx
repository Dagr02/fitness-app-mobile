import { useAuthSession } from "@/components/providers/AuthProvider";
import { ProgramProvider } from '@/components/providers/ProgramProvider';
import { Redirect, Stack } from 'expo-router';
import { Text } from 'react-native';
import { ReactNode } from "react";
import { PaperProvider } from "react-native-paper";



export default function RootLayout(): ReactNode {
  const { token, isLoading } = useAuthSession()

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!token?.current) {
    return <Redirect href="/login" />;
  }

  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PaperProvider>
  );
}