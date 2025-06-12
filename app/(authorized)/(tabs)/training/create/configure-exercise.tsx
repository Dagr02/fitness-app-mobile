import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';

import { useDraftProgram } from '@/components/providers/DraftProgramProvider'; // <-- use draft
import { useState } from 'react';

export default function ConfigureExerciseScreen() {
    const { id, day } = useLocalSearchParams<{ id: string, day: string }>();
    const dayIndex = parseInt(day || '0');
    const { draft, setDraft } = useDraftProgram(); // <-- use draft
    const router = useRouter();

    const exercise = draft.days?.[dayIndex]?.exercises.find((e) => e.exerciseId.toString() === id);

    const [reps, setReps] = useState(exercise?.reps || 0);
    const [sets, setSets] = useState(exercise?.sets || 0);
    const [weight, setWeight] = useState(exercise?.weightUsed || 0);

    if (!exercise) {
        return <Text style={{ color: 'white', padding: 20 }}>Exercise not found</Text>;
    }

    const handleSave = () => {
        if (!draft.days) return;
        const updatedDays = [...draft.days];
        const exercises = updatedDays[dayIndex].exercises.map((e) =>
            e.exerciseId.toString() === id ? { ...e, sets, reps, weightUsed: weight } : e
        );
        updatedDays[dayIndex].exercises = exercises;
        setDraft({ days: updatedDays }); // <-- update draft
        router.back();
    };

    return (
        <View style={styles.container}>
            <Text variant='headlineMedium' style={styles.header}>Configure: {exercise.exerciseName}</Text>

            <Text variant='headlineSmall' style={styles.label}>Sets:</Text>
            <TextInput
                style={styles.input}
                keyboardType="number-pad"
                mode='outlined'
                value={sets.toString()}
                onChangeText={(text) => setSets(Number(text))}
            />

            <Text variant='headlineSmall' style={styles.label}>Reps:</Text>
            <TextInput
                style={styles.input}
                keyboardType="number-pad"
                mode='outlined'
                value={reps.toString()}
                onChangeText={(text) => setReps(Number(text))}
            />

            <Text variant='headlineSmall' style={styles.label}>Weight:</Text>
            <TextInput
                style={styles.input}
                keyboardType="number-pad"
                mode='outlined'
                value={weight.toString()}
                onChangeText={(text) => setWeight(Number(text))}
            />

            <Button mode='contained' onPress={handleSave} > Save </Button>
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
        color: '#fff',
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        marginBottom: 10,
    },
    input: {
        marginBottom: 20,
    },
});