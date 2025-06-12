import { useRouter } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, } from 'react-native-paper';
import { ProgramExercise, useProgram } from '@/components/providers/ProgramProvider';


import api from '@/config/api';
import WorkoutLogCard from '@/components/training/WorkoutLogCard';
import ProgramMenu from '@/components/training/ProgramMenu';
import { useProgramActions } from '@/app/hooks/use-program-actions';

type SetLog = {
    reps?: string;   // or number, depending on what you store
    weight?: string; // or number
    [key: string]: any; // to allow other fields if needed
};


export default function ProgramScreen() {
    const { data, markNeedsRefresh } = useProgram();
    const router = useRouter();

    const [logState, setLogState] = useState<{ [exerciseId: number]: SetLog[] }>({});
    const [submitting, setSubmitting] = useState(false);

    const { handleDeleteProgram, handleEditProgram } = useProgramActions(
        data, markNeedsRefresh);


    const handleSetChange = useCallback((
        exerciseId: number,
        setIndex: number,
        field: string,
        value: string | number,
    ) => {
        setLogState(prev => {
            const existingSets = prev[exerciseId] || [];
            const updatedSets = [...existingSets];
            updatedSets[setIndex] = {
                ...updatedSets[setIndex],
                [field]: value,
            };
            return {
                ...prev,
                [exerciseId]: updatedSets,
            };
        });
    }, []);

    const submitAllLogs = useCallback(async () => {
        const logEntries = Object.entries(logState).flatMap(([exerciseId, sets]) =>
            sets
                .filter(s => s.reps && s.weight)
                .map((set, i) => ({
                    programExerciseId: parseInt(exerciseId),
                    setNumber: i + 1,
                    completedReps: parseInt(set.reps ?? '0'),
                    weightUsed: parseFloat(set.weight ?? '0'),
                    workoutDate: new Date().toISOString(),
                }))
        );

        if (logEntries.length === 0) {
            Alert.alert('No logs', 'Please fill in at least one exercise log before submitting.');
            return;
        }

        try {
            setSubmitting(true);

            const response = await api.postData('/users/log-workout', logEntries);

            Alert.alert('Success', 'Workout logged successfully!');
            setLogState({});
            markNeedsRefresh();
            router.push({ pathname: '/training' });

        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to submit logs. Please try again.');
        } finally {
            setSubmitting(false);

        }
    }, [logState, markNeedsRefresh, router]);

    if (!data.program.name?.trim()) {
        return (
            <View style={styles.center}>
                <Text style={styles.text}>No active program available.</Text>
                <Button mode='contained' onPress={() => router.back()} > Back </Button>
            </View>
        );
    }

    const currentDayData = data.days.find(day => day.dayNumber === data.currentDay);

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
            <View style={styles.headerContainer}>
                <Button mode='contained' style={styles.backButton} onPress={() => router.back()}> Back </Button>
                <Text
                    variant="bodyLarge"
                    style={styles.title}
                    accessible={true}
                    accessibilityRole="header"
                    accessibilityLabel={`Program Title: ${data.program.name}`}
                >
                    {data.program.name}
                </Text>
                <View style={styles.menuContainer}>
                    <ProgramMenu
                        onDelete={handleDeleteProgram}
                        onEdit={handleEditProgram}
                    />
                </View>
            </View>


            <Text style={styles.subtitle}>Current Day: {data.currentDay}</Text>

            {currentDayData?.exercises
                .filter((exercise): exercise is ProgramExercise & { programExerciseId: number } =>
                    exercise.programExerciseId !== undefined)
                .map((exercise) => {
                    const sets = logState[exercise.programExerciseId] || [];

                    return (
                        <WorkoutLogCard
                            key={exercise.programExerciseId}
                            exercise={exercise}
                            sets={sets}
                            onSetChange={(setIndex, field, value) =>
                                handleSetChange(exercise.programExerciseId, setIndex, field, value)
                            }
                        />
                    );
                })}

            <Button
                mode="contained"
                onPress={submitAllLogs}
                disabled={submitting}
                loading={submitting}
                style={{ marginTop: 20 }}
            >
                {submitting ? 'Submitting...' : 'Submit Workout'}
            </Button>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#25292e',
    },
    text: {
        color: '#fff',
    },
    headerContainer: {
        backgroundColor: '#333',
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        paddingHorizontal: 8,
        marginBottom: 8,
        position: 'relative',
        justifyContent: 'space-between', 
    },
    backButton: {
        marginRight: 8,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    title: {
        color: '#fff',
        textAlign: 'center',
        flex: 1,
        maxWidth: '40%',
    },
    menuContainer: {
        marginLeft: 8,
        flexShrink: 0,
        alignItems: 'center',
    },
    description: {
        color: '#fff',
        marginBottom: 16,
    },
    subtitle: {
        color: '#fff',
        marginBottom: 16,
    },
});
