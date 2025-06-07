import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProgramCard({ program, onPress }) {
  const { name, description } = program.program;
  const exercises = program.days?.[program.currentDay - 1]?.exercises ?? [];

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.programName}>{name}</Text>
      <Text style={styles.description} numberOfLines={2}>
            {description || 'No description available.'}
      </Text>

      <Text style={styles.subTitle}>Today’s Exercises</Text>
      <View style={styles.exerciseList}>
        {exercises.slice(0, 6).map((exercise, index) => (
          <View key={index} style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
            <Text style={styles.exerciseDetails}>
              {exercise.sets} sets x {exercise.reps} reps
            </Text>
          </View>
        ))}
        {exercises.length === 0 && (
          <Text style={styles.noExercises}>No exercises for today</Text>
        )}
      </View>

      <Text style={styles.viewMore}>View Full Program →</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  programName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    marginVertical: 8,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffd33d',
    marginTop: 12,
    marginBottom: 8,
  },
  exerciseList: {
    gap: 6,
  },
  exerciseItem: {
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 8,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  exerciseDetails: {
    color: '#aaa',
    fontSize: 13,
  },
  noExercises: {
    color: '#777',
    fontStyle: 'italic',
  },
  viewMore: {
    color: '#ffd33d',
    fontWeight: '600',
    marginTop: 14,
    textAlign: 'right',
    fontSize: 14,
  },
});
