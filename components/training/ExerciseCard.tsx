import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Exercise = {
  id?: number;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
};

type Props = {
  exercise: Exercise;
  onEdit?: (id?: number) => void;
  onDelete?: (id?: number) => void;
};

export default function ExerciseCard({ exercise, onEdit, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        {exercise.sets != null && <Text style={styles.detailText}>Sets: {exercise.sets}</Text>}
        {exercise.reps != null && <Text style={styles.detailText}>Reps: {exercise.reps}</Text>}
        {exercise.weight != null && <Text style={styles.detailText}>Weight: {exercise.weight} kg</Text>}
      </View>
      {onEdit && (
        <TouchableOpacity style={styles.editIcon} onPress={() => onEdit(exercise.id)}>
          Edit
        </TouchableOpacity>
      )}
      {onDelete && (
        <TouchableOpacity style={styles.editIcon} onPress={() => onDelete(exercise.id)}>
          Delete
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    elevation: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  detailText: {
    color: '#ccc',
    marginTop: 4,
    fontSize: 14,
  },
  textContainer: {
    flexDirection: 'column',
    flexShrink: 1,
  },
  editIcon: {
    paddingLeft: 10,
  },
});
