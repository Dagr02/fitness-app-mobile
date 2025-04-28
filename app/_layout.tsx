import AuthProvider from "@/components/providers/AuthProvider"
import { Slot } from 'expo-router';
import {ReactNode} from "react";

export default function RootLayout() {
  return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
  );
}
