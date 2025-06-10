import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';

import api from '@/config/api';
import ProgramCard from '@/components/training/ProgramCard';
import { useRouter } from 'expo-router';

import { useProgram } from '@/components/providers/ProgramProvider';
import { useProgramActions } from '@/app/hooks/use-program-actions';

export default function TrainingScreen() {
  const { data, updateData, resetData, needsRefresh, clearNeedsRefresh, markNeedsRefresh } = useProgram();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const onProgramDeleted = () => {
    resetData();
    markNeedsRefresh();
  }

  const { handleDeleteProgram, handleEditProgram } = useProgramActions(
    data.program.id,
    onProgramDeleted
  );


  const fetchActiveProgram = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const programData = await api.fetchData('/users/program');
      console.log('API programData:', programData);
      updateData({
        program: programData.program,
        days: programData.days,
        currentDay: programData.currentDay,
        numDays: programData.numDays
      });

      clearNeedsRefresh();

    } catch (err) {
      console.error('Error fetching active program: ', err);

    } finally {
      if (showLoading) setLoading(false);
    }
  }, [updateData, clearNeedsRefresh]);

  useEffect(() => {
    fetchActiveProgram(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (needsRefresh) {
        fetchActiveProgram(false).then(() => {
          clearNeedsRefresh();
        });
      }
    }, [needsRefresh, fetchActiveProgram])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#ffd33d" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Today's Training</Text>
      {data.program.name ? (
        <ProgramCard
          program={data}
          onPress={() => router.push({
            pathname: '/training/program',
          }

          )}
          onDelete={handleDeleteProgram}
          onEdit={handleEditProgram}
        />
      ) : (
        <View>
          <Text style={styles.text}>No active program found</Text>
          <Button title="Create Program" onPress={() => router.push('/training/create')} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#25292e',

  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 32,
    textAlign: 'center',
  },
});