import {useState, ReactNode} from "react";
import {Button, Text, TextInput, View} from "react-native";
import {router} from "expo-router";

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
         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Register screen</Text>

            <TextInput
                placeholder="First Name"
                value={firstname}
                onChangeText={setFirstName}
                style={{ marginBottom: 10, width: 200, padding: 8, borderWidth: 1 }}
            />

            <TextInput
                placeholder="Last Name"
                value={lastname}
                onChangeText={setLastName}
                style={{ marginBottom: 10, width: 200, padding: 8, borderWidth: 1 }}
            />

            <TextInput
                label="Email"
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={{ marginBottom: 10, width: 200, padding: 8, borderWidth: 1 }}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                style={{ marginBottom: 10, width: 200, padding: 8, borderWidth: 1 }}
            />

            {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

            <Button title="Register" onPress={register} />

            <Button
                title="Already have an account? Login"
                onPress={() => router.push('/login')}
            />
         </View>
    )
}