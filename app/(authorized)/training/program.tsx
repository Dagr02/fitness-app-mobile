import { useRouter } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, ScrollView, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useProgram } from '@/components/providers/ProgramProvider';


import api from '@/config/api';
import WorkoutLogCard from '@/components/training/WorkoutLogCard';
import ProgramMenu from '@/components/training/ProgramMenu';
import CustomButton from '@/components/custom/CustomButton'

export default function ProgramScreen() {
  const { data, markNeedsRefresh } = useProgram();
  const router = useRouter();

  const [logState, setLogState] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleDeleteProgram = useCallback( () => {
      Alert.alert(
          'Confirm Delete',
          'Are you sure you want to delete this program?',
          [
              {text: 'Cancel', style: 'cancel'},
              {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async() => {
                      try{
                          await api.deleteData(`/programs/${data.program.id}`);
                          Alert.alert('Deleted', 'Program deleted successfully');
                          markNeedsRefresh();
                          router.push('/(tabs)/training');
                      }catch(err){
                          Alert.alert('Error', 'Failed to delete program');
                          console.error(err);
                      }
                  }

              },
          ]
      );
  }, [data.program.id, markNeedsRefresh, router]);


  const handleSetChange = useCallback((exerciseId, setIndex, field, value) => {
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
  },[]);

  const submitAllLogs = useCallback(async () => {
    const logEntries = Object.entries(logState).flatMap(([exerciseId, sets]) =>
            sets
                .filter(s => s.reps && s.weight)
                .map((set, i) => ({
                    programExerciseId: parseInt(exerciseId),
                    setNumber: i + 1,
                    completedReps: parseInt(set.reps),
                    weightUsed: parseFloat(set.weight),
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
        router.push('/(tabs)/training');

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
                <Button title="Back" onPress={() => router.back()} />
            </View>
        );
  }

  const currentDayData = data.days.find(day => day.dayNumber === data.currentDay);

  return (
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
            <View style={styles.headerContainer}>
                <CustomButton onPress={() => router.back()} />
                <Text
                    style={styles.title}
                    accessible={true}
                    accessibilityRole="header"
                    accessibilityLabel={`Program Title: ${data.program.name}`}
                    >
                    {data.program.name}
                </Text>
                <View style={styles.menuContainer}>
                    <ProgramMenu onDelete={handleDeleteProgram} />
                </View>
            </View>


            <Text style={styles.subtitle}>Current Day: {data.currentDay}</Text>

            {currentDayData?.exercises.map((exercise) => {
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
          title={submitting ? 'Submitting...' : 'Submit Workout'}
          onPress={submitAllLogs}
          disabled={submitting}
        />
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
        height: 48,
        position: 'relative',
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        paddingHorizontal: 12,
        justifyContent: 'center',
        backgroundColor: '#444',
        borderRadius: 6,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffd33d',
        textAlign: 'center',
    },
    menuContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
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
