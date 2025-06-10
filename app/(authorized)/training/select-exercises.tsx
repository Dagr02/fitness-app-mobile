import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useProgram } from '@/components/providers/ProgramProvider';
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
    const {day} = useLocalSearchParams<{day: string}>();
    const dayIndex = parseInt(day!) - 1;

    const { data, updateData } = useProgram();
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
      data.days[dayIndex]?.exercises?.some((e: any) => e.exerciseId === exerciseId);

    const toggleExercise = (exercise: any) => { 
      const updatedDays = [...data.days];


      if (!updatedDays[dayIndex]) {
          updatedDays[dayIndex] = {
              dayNumber: dayIndex + 1,
              exercises: [],
          };
      }

      const day = updatedDays[dayIndex];
      const exists = day.exercises.some((e: any) => e.exerciseId === exercise.id);

      if(exists){
          updatedDays[dayIndex].exercises = day.exercises.filter((e) => e.exerciseId != exercise.id);
          updateData({days: updatedDays})
      } else{
          updatedDays[dayIndex].exercises = [
              ...day.exercises,
              {
                  exerciseId: exercise.id,
                  exerciseName: exercise.name,
                  sets: 0,
                  reps: 0,
                  orderIndex: day.exercises.length,
              },
          ];
          updateData({days : updatedDays});

          router.push({
              pathname: '/training/configure-exercise',
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
               <Text style={styles.header}>Select Exercises for Day {day}</Text>

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
             <View >
                <Button title="Create Exercise" onPress={() =>  router.push({ pathname: '/training/create-exercise' })} />
             </View>
             <View >
                <Button title="Done" onPress={() => router.back()} />
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
        color: '#ffd33d',
        fontSize: 20,
        marginBottom: 16,
        fontWeight: 'bold',
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
});
