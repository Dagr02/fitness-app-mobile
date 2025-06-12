import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useDraftProgram } from '@/components/providers/DraftProgramProvider'; // <-- use draft
import api from '@/config/api';
import ExerciseCard from '@/components/training/ExerciseCard';

type Exercise = {
  id: number;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
};

export default function SelectExercisesScreen() {
  const { day } = useLocalSearchParams<{ day: string }>();
  const dayIndex = parseInt(day!) - 1;

  const { draft, setDraft } = useDraftProgram(); // <-- use draft
  const router = useRouter();

  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchExercises();
    }, [])
  );

  const fetchExercises = async () => {
    try {
      const result = await api.fetchData('/api/exercises');
      setAllExercises(result);
      console.log('Fetched exercises:', result.length);
    } catch (err) {
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (exerciseId: number) =>
    draft.days?.[dayIndex]?.exercises?.some((e: any) => e.exerciseId === exerciseId);

  const toggleExercise = (exercise: any) => {
    const updatedDays = draft.days ? [...draft.days] : [];
    if (!updatedDays[dayIndex]) {
      updatedDays[dayIndex] = {
        dayNumber: dayIndex + 1,
        exercises: [],
      };
    }

    const dayObj = updatedDays[dayIndex];
    const exists = dayObj.exercises.some((e: any) => e.exerciseId === exercise.id);

    if (exists) {
      updatedDays[dayIndex].exercises = dayObj.exercises.filter((e) => e.exerciseId !== exercise.id);
      setDraft({ days: updatedDays });
    } else {
      updatedDays[dayIndex].exercises = [
        ...dayObj.exercises,
        {
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          sets: 0,
          reps: 0,
          orderIndex: dayObj.exercises.length,
        },
      ];
      setDraft({ days: updatedDays });

      router.push({
        pathname: '/training/create/configure-exercise',
        params: {
          id: exercise.id.toString(),
          day: (dayIndex).toString(),
        },
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant='headlineMedium' style={styles.header}>Select Exercises for Day {day}</Text>

        {allExercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            onPress={() => toggleExercise(exercise)}
            style={[
              styles.exerciseWrapper,
              isSelected(exercise.id) && styles.selected,
            ]}
          >
            <ExerciseCard exercise={exercise} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View>
        <Button mode='contained' style={styles.button} onPress={() => router.push({ pathname: '/training/create/create-exercise' })}>
          Create Exercise
        </Button>
      </View>
      <View>
        <Button mode='contained' style={styles.button} onPress={() => router.back()}>
          Done
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  container: {
    padding: 16,
  },
  header: {
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  exerciseWrapper: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  selected: {
    borderWidth: 1,
    borderColor: '#ffd33d',
  },
  button: {
    marginBottom: 24,
  }
});