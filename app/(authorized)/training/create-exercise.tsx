import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from "react-native";
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
            <Text style={styles.text}> Create Exercises </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Exercise Name"
                    style={styles.input}
                    placeholderTextColor="#aaa"
                    onChangeText={setName}
                    value={name}
                />
                <TextInput
                    placeholder="Description"
                    style={styles.input}
                    placeholderTextColor="#aaa"
                    onChangeText={setDescription}
                    value={description}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={() => !loading && handleSaveExercise()}
                    activeOpacity={0.7}
                    disabled={loading}
                >
                    {loading ? (
                        <Text style={styles.buttonText}>Saving...</Text>   
                    ) : (
                        <Text style={styles.buttonText}>Save Exercise</Text>
                    )}
                </TouchableOpacity>
                    
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
        fontSize: 24,
        marginBottom: 20,
    },
    inputContainer: {
        paddingHorizontal: 16,
    },
    input: {
        backgroundColor: '#fff',
        color: '#000',
        marginBottom: 16,
        padding: 10,
        borderRadius: 5,
        height: 40,
        
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    button:{
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
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