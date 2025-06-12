import { StyleSheet, View } from "react-native";

import {Text, TextInput, Button} from 'react-native-paper';

import { useState } from "react";
import api from "@/config/api";
import { useRouter } from "expo-router";


export default function CreateExerciseScreen() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();


    const handleSaveExercise = async (): Promise<void> => {
        if (!name || !description) {
            alert("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {

            const payload = {
                name,
                description
            };
            const response = await api.postData('/api/exercises', payload);
            console.log('Exercise created successfully:', response);
            setName("");
            setDescription("");

        } catch (error) {
            console.error('Failed to create exercise', error);

        } finally {
            setLoading(false);
            router.back()
        }
    };


    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.text}> Create Exercises </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Exercise Name"
                    style={styles.input}
                    placeholderTextColor="#aaa"
                    mode='outlined'
                    onChangeText={setName}
                    value={name}
                />
                <TextInput
                    placeholder="Description"
                    style={styles.input}
                    placeholderTextColor="#aaa"
                    mode='outlined'
                    onChangeText={setDescription}
                    value={description}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={handleSaveExercise}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                    contentStyle={{ paddingVertical: 8 }}
                >
                    Save Exercise
                </Button>

                    
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        paddingHorizontal: 16,
    },
    input: {
        marginBottom: 16,
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    button:{
        width: '80%',
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 5,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    
});