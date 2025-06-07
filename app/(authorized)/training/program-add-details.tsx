import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import ExerciseCard from '@/components/training/ExerciseCard';
import api from "@/config/api"
import { useProgram } from '@/components/providers/ProgramProvider';
import { convertProgramDataToCreateProgramDTO } from '@/utils/apiConverter';

export default function ProgramAddDetailsScreen() {
  const { data } = useProgram();
  const router = useRouter();


  const handleSave = async (): Promise<void> => {
      try{
          const payload = convertProgramDataToCreateProgramDTO(data);
          const response = await api.postData('/api/programs/custom', payload);

          console.log('Program created successfully:', response);

          router.push('/(tabs)/training');
      }catch(err){
          console.error('Failed to create program', err);
          alert("Failed to create program.");
      }
  }

  return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
            <Button title="Back" onPress={() => router.back()} />
            <Text style={styles.headerText}>Program Details</Text>
        </View>
          {[...Array(data.numDays)].map((_, i) => {
            const dayIndex = i;
            const dayData = data.days?.[dayIndex] || { dayNumber: i + 1, exercises: [] };

            return (
              <View key={i} style={styles.dayBlock}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayText}>Day {i + 1}</Text>
                  <Button
                    title="➕ Add Exercise"
                    onPress={() =>
                      router.push({
                        pathname: '/training/select-exercises',
                        params: { day: (i + 1).toString() },
                      })
                    }
                  />
                </View>

                {dayData.exercises.length > 0 ? (
                  dayData.exercises.map((exercise: any) => (
                      <View key={exercise.exerciseId} style={styles.exerciseWrapper}>
                         <ExerciseCard exercise={{
                            id: exercise.exerciseId,
                            name: exercise.exerciseName,
                            sets: exercise.sets,
                            reps: exercise.reps,
                            weight: exercise.weightUsed,
                         }} />
                      </View>
                  ))
                ) : (
                  <Text style={styles.noExercises}>No exercises added.</Text>
                )}
              </View>
            );
          })}

        </ScrollView>
        <View style={styles.footer}>
            <Button title="Create" onPress={handleSave} />
        </View>
    </View>
  );
}


const styles = StyleSheet.create({
    screen: {
       backgroundColor: '#25292e',
       flex: 1,
    },
    container: {
        flexGrow: 1,
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 10,
        marginBottom: 20,
        width: '100%',
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        marginLeft: 20,
    },
    dayBlock: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    dayText: {
        color: '#fff',
        fontSize: 18,
    },
    noExercises: {
        color: '#aaa',
        fontStyle: 'italic',
    },
    exerciseWrapper: {
      padding: 5,

    },
});
