import { useDraftProgram } from "@/components/providers/DraftProgramProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper'
import DateTimePicker from "@react-native-community/datetimepicker";
import ExerciseCard from "@/components/training/ExerciseCard";
import api from "@/config/api";
import { convertProgramDataToUpdateProgramDTO } from "@/utils/apiConverter";

export default function EditProgramScreen() {
    const { draft, setDraft, resetDraft } = useDraftProgram();

    const [pickerType, setPickerType] = useState<null | "start" | "end">(null);
    const [saving, setSaving] = useState(false);

    const router = useRouter();

    const handleSave = async (): Promise<void> => {
        try {
            setSaving(true);
            const payload = convertProgramDataToUpdateProgramDTO({
                program: {
                    id: draft.program?.id ?? 0,
                    name: draft.program?.name ?? '',
                    description: draft.program?.description ?? '',
                    startDate: draft.program?.startDate ?? '',
                    endDate: draft.program?.endDate ?? '',
                },
                days: draft.days ?? [],
                currentDay: draft.currentDay ?? 1,
                numDays: draft.numDays ?? (draft.days ? draft.days.length : 0),
            });
            const response = await api.updateData('/api/programs/custom/update', payload);

            resetDraft(); 
            router.push('/training');
        } catch (err) {
            console.error('Failed to update program', err);
            alert("Failed to update program.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.container}
        >
            <View style={styles.header}>
                <Button mode="contained" onPress={() => router.back()}>
                    Back
                </Button>
            </View>

            <Text variant="headlineSmall" style={styles.title}>
                Edit Program
            </Text>

            <TextInput
                value={draft.program?.name ?? ''}
                onChangeText={(val) =>
                    setDraft({ program: { ...draft.program, name: val } })
                }
                mode="outlined"
                style={styles.input}
            />

            <TextInput
                value={draft.program?.description ?? ''}
                onChangeText={(val) =>
                    setDraft({ program: { ...draft.program, description: val } })
                }
                mode="outlined"
                style={styles.input}
            />

            <TextInput
                value={(draft.numDays ?? draft.days?.length ?? 0).toString()}
                onChangeText={(val) => {
                    const newNumDays = Number(val);
                    const currentDays = draft.days ?? [];

                    let updatedDays = [...currentDays];

                    if (newNumDays > currentDays.length) {
                        // Add extra days
                        for (let i = currentDays.length + 1; i <= newNumDays; i++) {
                            updatedDays.push({
                                dayNumber: i,
                                exercises: [],
                            });
                        }
                    } else if (newNumDays < currentDays.length) {
                        // Remove excess days
                        updatedDays = currentDays.slice(0, newNumDays);
                    }

                    setDraft({
                        numDays: newNumDays,
                        days: updatedDays,
                    });
                }}
                keyboardType="number-pad"
                mode="outlined"
                style={styles.input}
            />

            <Pressable onPress={() => setPickerType('start')} style={styles.dateInput}>
                <Text variant='bodyLarge' style={styles.dateText}>
                    Start Date: {draft.program?.startDate ? new Date(draft.program.startDate).toDateString() : ''}
                </Text>
            </Pressable>

            <Pressable onPress={() => setPickerType('end')} style={styles.dateInput}>
                <Text variant='bodyLarge' style={styles.dateText}>
                    End Date: {draft.program?.endDate ? new Date(draft.program.endDate).toDateString() : ''}
                </Text>
            </Pressable>

            {pickerType && (
                <DateTimePicker
                    value={
                        new Date(
                            pickerType === "start"
                                ? draft.program?.startDate ?? new Date().toISOString()
                                : draft.program?.endDate ?? new Date().toISOString()
                        )
                    }
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        const currentType = pickerType;
                        setPickerType(null);
                        if (selectedDate) {
                            setDraft({
                                program: {
                                    ...draft.program,
                                    ...(currentType === "start"
                                        ? { startDate: selectedDate.toISOString() }
                                        : { endDate: selectedDate.toISOString() }),
                                },
                            });
                        }
                    }}
                />
            )}

            {(draft.days ?? []).map((dayData, i) => {
                const dayIndex = i;

                return (
                    <View key={i} style={styles.dayBlock}>
                        <View style={styles.dayHeader}>
                            <Text variant="headlineSmall" style={styles.dayText}>Day {dayData.dayNumber}</Text>
                            <Button
                                mode="contained-tonal"
                                onPress={() =>
                                    router.push({
                                        pathname: "/training/create/select-exercises",
                                        params: { day: dayData.dayNumber.toString(), mode: "edit" },
                                    })
                                }
                            >
                                {dayData.exercises.length > 0 ? "✏️ Edit Exercises" : "➕ Add Exercise"}
                            </Button>
                        </View>

                        {dayData.exercises.length > 0 ? (
                            dayData.exercises.map((exercise) => (
                                <View key={exercise.exerciseId} style={styles.exerciseWrapper}>
                                    <ExerciseCard
                                        exercise={{
                                            id: exercise.exerciseId,
                                            name: exercise.exerciseName,
                                            sets: exercise.sets,
                                            reps: exercise.reps,
                                            weight: exercise.weightUsed,
                                        }}
                                    />
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noExercises}>No exercises added.</Text>
                        )}
                    </View>
                );
            })}

            <Button
                mode="contained"
                onPress={handleSave}
                loading={saving}
                disabled={saving}
                style={styles.nextButton}
            >
                Save
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#25292e',
    },
    container: {
        padding: 20,
    },
    title: {
        color: "#fff",
        textAlign: "center",
        marginBottom: 24,
    },
    input: {
        marginBottom: 20,
    },
    nextButton: {
        marginTop: 25,
    },
    dateInput: {
        backgroundColor: '#fff',
        padding: 10,
        height: 55,
        marginBottom: 20,
        borderRadius: 5,
        justifyContent: 'center',
    },
    dateText: {
        color: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        width: '100%',
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
});