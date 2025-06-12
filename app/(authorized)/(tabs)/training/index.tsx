import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import api from '@/config/api';
import ProgramCard from '@/components/training/ProgramCard';
import { useRouter } from 'expo-router';

import { useProgram } from '@/components/providers/ProgramProvider';
import { useProgramActions } from '@/app/hooks/use-program-actions';
import { isProgramValid } from '@/utils/validation';

export default function TrainingScreen() {
  const { data, updateData, resetData } = useProgram();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const onProgramDeleted = () => {
    resetData();
  };

  const { handleDeleteProgram, handleEditProgram } = useProgramActions(
    data,
    onProgramDeleted
  );

  const fetchActiveProgram = async () => {
    try {
      const programData = await api.fetchData('/users/program');
      updateData({
        program: programData.program,
        days: programData.days,
        currentDay: programData.currentDay,
        numDays: programData.numDays
      });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if(!isProgramValid(data)) setLoading(true);
      fetchActiveProgram();
    }, [])
  );

  if (loading && !isProgramValid(data)) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant='headlineLarge' style={styles.text}>Today's Training</Text>
      {isProgramValid(data) ? (
        <ProgramCard
          program={data}
          onPress={() => router.push({
            pathname: '/training/program',
          })}
          onDelete={handleDeleteProgram}
          onEdit={handleEditProgram}
        />
      ) : (
        <View>
          <Text variant='headlineSmall' style={styles.text}>No active program found</Text>
          <Button mode='contained' style={styles.button} onPress={() => router.push('/training/create')} >
            Create Program
          </Button>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#25292e',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  button: {
    marginTop: 24,
  }
});