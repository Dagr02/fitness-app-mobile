import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import api from '@/config/api';
import { useDraftProgram } from '@/components/providers/DraftProgramProvider';
import { ProgramData } from '@/components/providers/ProgramProvider';

export function useProgramActions(
    programData: ProgramData,
    refreshCallback: () => void
) {
    const router = useRouter();
    const { setDraft } = useDraftProgram();

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
                            await api.deleteData(`/api/programs/${programData.program.id}`);
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
        setDraft({
            program: { ...programData.program },
            days: programData.days,
            currentDay: programData.currentDay,
            numDays: programData.numDays,
        });
        
        setTimeout(() => {
            router.push('/training/create/edit-program');
        }, 0);
    };

    return { handleDeleteProgram, handleEditProgram };
}