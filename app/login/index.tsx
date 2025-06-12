import { useAuthSession } from "@/components/providers/AuthProvider";
import { ReactNode, useState } from "react";
import { View,  StyleSheet, KeyboardAvoidingView, Platform} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { router } from "expo-router";

export default function Login(): ReactNode {
    const { signIn } = useAuthSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const login = async (): Promise<void> => {
        try {
            const response = await fetch('http://192.168.1.6:9090/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                throw new Error('Login Failed');
            }

            const data = await response.json();

            if (data.token) {
                await signIn(data.token, data.refreshToken);
            } else {
                setError("Invalid login. Token missing.");
            }
        } catch (err) {

            setError("Login Error");
        }

    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title} variant="headlineMedium">Login screen</Text>

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    style={styles.input}
                />

                {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

                <Button mode="contained" style= {styles.button} onPress={login}> Login </Button>

                <Button mode="text" style= {styles.button} onPress={() => router.push('/register')}
                    
                > 

                    Don't have an account? Register
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
    }
});