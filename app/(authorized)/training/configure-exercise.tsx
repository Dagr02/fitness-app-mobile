import {useLocalSearchParams, useRouter} from 'expo-router';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useProgram } from '@/components/providers/ProgramProvider';
import { useState } from 'react';


export default function ConfigureExerciseScreen() {
    const {id, day} = useLocalSearchParams<{id: string, day: string}>();
    const dayIndex = parseInt(day || '0');
    const {data, updateData} = useProgram();
    const router = useRouter();

    const exercise = data.days[dayIndex]?.exercises.find((e) => e.exerciseId.toString() === id);

    const [reps, setReps] = useState(exercise.reps || 0);
    const [sets, setSets] = useState(exercise.sets || 0);
    const [weight, setWeight] = useState(exercise.sets || 0);

    if (!exercise) {
        return <Text style={{ color: 'white', padding: 20 }}>Exercise not found</Text>;
    }

    const handleSave = () => {
        const updatedDays = [...data.days];
        const exercises = updatedDays[dayIndex].exercises.map((e) =>
          e.exerciseId.toString() === id ? { ...e, sets, reps, weightUsed: weight} : e
        );

        updatedDays[dayIndex].exercises = exercises;
        updateData({ days: updatedDays });
        router.back();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Configure {exercise.name}</Text>

            <Text style={styles.label}>Sets:</Text>
            <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={sets.toString()}
                onChangeText={(text) => setSets(Number(text))}
            />

            <Text style={styles.label}>Reps:</Text>
            <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={reps.toString()}
                onChangeText={(text) => setReps(Number(text))}
            />

            <Text style={styles.label}>Weight:</Text>
            <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={weight.toString()}
                onChangeText={(text) => setWeight(Number(text))}
            />

            <Button title="Save" onPress={handleSave} />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        padding: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffd33d',
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 10,
        marginBottom: 20,
        borderRadius: 8,
    },
});