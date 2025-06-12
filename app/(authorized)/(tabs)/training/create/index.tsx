import { ScrollView, View,StyleSheet, Pressable} from "react-native";
import { Button, Text, TextInput} from "react-native-paper";

import { useState} from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

import { useDraftProgram } from '@/components/providers/DraftProgramProvider'; // use this instead of useProgram

export default function CreateProgramScreen() {
    const [pickerType, setPickerType] = useState<null | 'start' | 'end'>(null);
    const { draft, setDraft } = useDraftProgram(); 
    const router = useRouter();

    const handleNext = () => {
        router.push({
            pathname: '/training/create/program-add-details',
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Button mode='contained' onPress={() => router.back()} > Back </Button>
            </View>

            <View style={styles.container}>
                <Text variant="headlineSmall" style={styles.headerText}> Create Program Screen </Text>

                <TextInput
                    placeholder="Program Name"
                    value={draft.program?.name ?? ''}
                    onChangeText={(val) =>
                        setDraft({ program: { ...draft.program, name: val } })
                    }
                    mode='outlined'
                    style={styles.input}
                    placeholderTextColor="#aaa"
                />
                <TextInput
                    placeholder="Description"
                    value={draft.program?.description ?? ''}
                    onChangeText={(val) =>
                        setDraft({ program: { ...draft.program, description: val } })
                    }
                    mode='outlined'
                    style={styles.input}
                    placeholderTextColor="#aaa"
                />

                <TextInput
                    placeholder="Number of days"
                    value={(draft.numDays ?? '').toString()}
                    mode='outlined'
                    onChangeText={(val) =>
                        setDraft({ numDays: Number(val) })
                    }
                    style={styles.input}
                    keyboardType="number-pad"
                    placeholderTextColor="#aaa"
                />

                <Pressable onPress={() => setPickerType('start')} style={styles.dateInput}>
                    <Text variant='bodyLarge' style={styles.dateText}>
                        Start Date: {draft.program?.startDate ? new Date(draft.program.startDate).toDateString() : 'Not set'}
                    </Text>
                </Pressable>

                <Pressable onPress={() => setPickerType('end')} style={styles.dateInput}>
                    <Text variant='bodyLarge' style={styles.dateText}>
                        End Date: {draft.program?.endDate ? new Date(draft.program.endDate).toDateString() : 'Not set'}
                    </Text>
                </Pressable>

                {pickerType && (
                    <DateTimePicker
                        value={new Date(
                            pickerType === 'start'
                                ? draft.program?.startDate ?? new Date().toISOString()
                                : draft.program?.endDate ?? new Date().toISOString()
                        )}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            const currentType = pickerType;
                            setPickerType(null);
                            if (selectedDate) {
                                setDraft({
                                    program: {
                                        ...draft.program,
                                        ...(currentType === 'start'
                                            ? { startDate: selectedDate.toISOString() }
                                            : { endDate: selectedDate.toISOString() }),
                                    },
                                });
                            }
                        }}
                    />
                )}

                <Button mode="contained" onPress={handleNext}> Next </Button>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#25292e',
    },
    text: {
        color: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 10,
        width: '100%',
    },
    headerText: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 25,
    },
    input: {
        marginBottom: 16,
    },
    dateInput: {
        backgroundColor: '#fff',
        padding: 10,
        height: 55,
        marginBottom: 12,
        borderRadius: 5,
        justifyContent: 'center',
    },
    dateText: {
        color: '#000',
    },
});