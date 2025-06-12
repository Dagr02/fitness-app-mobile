import {useState, ReactNode} from "react";
import {View, StyleSheet, KeyboardAvoidingView, Platform} from "react-native";
import {router} from "expo-router";
import {Text, TextInput, Button} from "react-native-paper";

export default function Register() : ReactNode {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const register = async (): Promise<void> => {
        try{
            const response = await fetch('http://192.168.1.6:9090/registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({email, password, firstname, lastname}),
            });

            if(!response.ok){
                throw new Error('Registration Failed');
            }

            const data = await response.json();
            if(data.token){
                router.push('/login');
            } else{
                setError('Registration failed');
            }

        }catch(err){
            console.log(err);
            setError('Registration Error');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title} variant="headlineMedium">Create Account</Text>

                <TextInput
                    placeholder="First Name"
                    mode="outlined"
                    value={firstname}
                    onChangeText={setFirstName}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Last Name"
                    mode="outlined"
                    value={lastname}
                    onChangeText={setLastName}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    mode="outlined"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Password"
                    mode="outlined"
                    secureTextEntry
                    autoCapitalize="none"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                />

                {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

                <Button mode= "contained" style= {styles.button} onPress={register}> Register </Button>

                <Button mode="text" style= {styles.button} onPress={() => router.push('/login')} >
                    Already have an account? Login
                </Button>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    content:{
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title:{
        textAlign : 'center',
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
    }
});