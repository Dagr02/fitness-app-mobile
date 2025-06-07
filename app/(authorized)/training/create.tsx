import { ScrollView, View, Button, Text, ActivityIndicator, StyleSheet, Pressable, TextInput } from "react-native";
import {useState, useEffect, useContext} from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

import {useProgram} from '@/components/providers/ProgramProvider'


export default function CreateProgramScreen(){
    const [pickerType, setPickerType] = useState<null | 'start' | 'end'>(null);
    const {data, updateData} = useProgram();

    const router = useRouter();

    const handleNext = () => {
        router.push({
          pathname: '/training/program-add-details',
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Button title="Back" onPress={() => router.back()} />
                <Text style={styles.headerText}> Create Program Screen </Text>
            </View>

            <View style={styles.container}>
                <TextInput
                    placeholder="Program Name"
                    value={data.program.name}
                    onChangeText={(val) =>
                        updateData({program: {...data.program, name: val}})
                    }
                    style={styles.input}
                    placeholderTextColor="#aaa"
                />
                <TextInput
                    placeholder="Description"
                    value={data.program.description}
                    onChangeText={(val) =>
                        updateData({program: {...data.program, description: val}})
                    }
                    style={styles.input}
                    placeholderTextColor="#aaa"
                />

                <TextInput
                    placeholder="Number of days"
                    value={(data.numDays ?? '').toString()}
                    onChangeText={(val) =>
                        updateData({
                            numDays: Number(val),
                        })
                    }
                    style={styles.input}
                    keyboardType="number-pad"
                    placeholderTextColor="#aaa"
                />

                <Pressable onPress={() => setPickerType('start')} style={styles.dateInput}>
                  <Text style={styles.dateText}>Start Date: {new Date(data.program.startDate).toDateString()}</Text>
                </Pressable>

                <Pressable onPress={() => setPickerType('end')} style={styles.dateInput}>
                  <Text style={styles.dateText}>End Date: {new Date(data.program.endDate).toDateString()}</Text>
                </Pressable>


                {pickerType && (
                  <DateTimePicker
                    value={new Date(
                        pickerType === 'start' ? data.program.startDate : data.program.endDate
                    )}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {

                      const currentType = pickerType;
                      setPickerType(null);
                      if (selectedDate) {
                        updateData({
                            program: {
                                ...data.program,
                                ...(currentType === 'start'
                                    ? { startDate: selectedDate.toISOString()}
                                    : { endDate: selectedDate.toISOString()}),
                                }
                        });
                      }
                    }}
                  />
                )}
                <Button title="Next" onPress={handleNext} />
            </View>
        </ScrollView>

    )
};

const styles = StyleSheet.create({
      container: {
          display: 'flex',
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
          fontSize: 20,
          marginLeft: 20,
      },
      input: {
          backgroundColor: '#fff',
          color: '#000',
          marginBottom: 12,
          padding: 10,
          borderRadius: 5,
          height: 40,
      },
      dateInput: {
          backgroundColor: '#fff',
          padding: 10,
          marginBottom: 12,
          borderRadius: 5,
      },
      dateText: {
          color: '#000',
      },
});