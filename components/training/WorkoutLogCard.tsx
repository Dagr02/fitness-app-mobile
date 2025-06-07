import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

type WorkoutLogCardProps = {
    exercise: {
        programExerciseId: number;
        exerciseName: string;
        sets: number;
        reps: number;
    };
    sets: { reps?: string; weight?: string }[];
    onSetChange: (setIndex: number, field: 'reps' | 'weight', value: string) => void;
};

export default function WorkoutLogCard({ exercise, sets, onSetChange }: WorkoutLogCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.name}>{exercise.exerciseName}</Text>
            <Text style={styles.target}>Target: {exercise.sets} sets × {exercise.reps} reps</Text>

            {[...Array(exercise.sets)].map((_, index) => (
                <View key={index} style={styles.setRow}>
                    <Text style={styles.setLabel}>Set {index + 1}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Reps"
                        placeholderTextColor="#aaa"
                        keyboardType="number-pad"
                        value={sets[index]?.reps || ''}
                        onChangeText={(val) => onSetChange(index, 'reps', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Weight"
                        placeholderTextColor="#aaa"
                        keyboardType="decimal-pad"
                        value={sets[index]?.weight || ''}
                        onChangeText={(val) => onSetChange(index, 'weight', val)}
                    />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#33383f',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 6,
    },
    target: {
        color: '#bbb',
        marginBottom: 10,
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    setLabel: {
        color: '#fff',
        width: 60,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 5,
        color: '#000',
    },
});
