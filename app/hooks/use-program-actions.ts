// hooks/useProgramActions.ts
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import api from '@/config/api';

export function useProgramActions(programId: number | string, refreshCallback: () => void) {
    const router = useRouter();

    const handleDeleteProgram = () => {
        Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this program?',
        [
            { text: 'Cancel', style: 'cancel' },
            {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
                try {
                await api.deleteData(`/api/programs/${programId}`);
                Alert.alert('Deleted', 'Program deleted successfully');
                refreshCallback();
                router.push('/training');
                } catch (err) {
                Alert.alert('Error', 'Failed to delete program');
                console.error(err);
                }
            },
            },
        ]
        );
    };

    const handleEditProgram = () => {
        router.push({
            pathname: '/training/program/edit/[programId]',
            params: { programId: programId.toString() }
        });
    };


  return { handleDeleteProgram, handleEditProgram };
}
