import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ExerciseCard from '@/components/training/ExerciseCard';
import api from "@/config/api";
import { useDraftProgram } from '@/components/providers/DraftProgramProvider'; // <-- use draft
import { convertProgramDataToCreateProgramDTO } from '@/utils/apiConverter';

type DayExercise = {
  exerciseId: number;
  exerciseName: string;
  sets: number;
  reps: number;
  weightUsed?: number;
};

type DayData = {
  dayNumber: number;
  exercises: DayExercise[];
};

export default function ProgramAddDetailsScreen() {
  const { draft, resetDraft} = useDraftProgram(); // <-- use draft
  const router = useRouter();

  const handleSave = async (): Promise<void> => {
    try {
      // You may need to cast or transform draft to ProgramData if your converter expects full ProgramData
      // For now, assume your draft is complete enough for the converter
      const payload = convertProgramDataToCreateProgramDTO({
        program: {
          id: 0, // or omit if not needed
          name: draft.program?.name ?? '',
          description: draft.program?.description ?? '',
          startDate: draft.program?.startDate ?? '',
          endDate: draft.program?.endDate ?? '',
        },
        days: draft.days ?? [],
        currentDay: draft.currentDay ?? 1,
        numDays: draft.numDays ?? (draft.days ? draft.days.length : 0),
      });
      const response = await api.postData('/api/programs/custom', payload);

      console.log('Program created successfully:', response);
      resetDraft(); 
      router.push('/training');
    } catch (err) {
      console.error('Failed to create program', err);
      alert("Failed to create program.");
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Button mode='contained' onPress={() => router.back()}> Back </Button>
          <Text variant='headlineSmall' style={styles.headerText}>Program Details</Text>
        </View>
        {[...Array(draft.numDays ?? (draft.days ? draft.days.length : 0))].map((_, i) => {
          const dayIndex = i;
          const dayData: DayData = draft.days?.[dayIndex] || { dayNumber: i + 1, exercises: [] };

          return (
            <View key={i} style={styles.dayBlock}>
              <View style={styles.dayHeader}>
                <Text variant='headlineSmall' style={styles.dayText}>Day {i + 1}</Text>
                <Button
                  mode='contained-tonal'
                  onPress={() =>
                    router.push({
                      pathname: '/training/create/select-exercises',
                      params: { day: (i + 1).toString() },
                    })
                  }
                >
                  ➕ Add Exercise
                </Button>
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
      <View style={styles.buttonContainer}>
        <Button mode='contained' onPress={handleSave}> Create </Button>
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
        marginBottom: 35,
        width: '100%',
    },
    headerText: {
        color: '#fff',
        textAlign: 'center',
        marginLeft: 10,
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
        
    },
    noExercises: {
        color: '#aaa',
        fontStyle: 'italic',
    },
    exerciseWrapper: {
      padding: 5,

    },
    buttonContainer:{
        marginBottom: 40,
    }
});
