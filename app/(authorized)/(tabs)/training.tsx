import {View, Text, StyleSheet} from 'react-native';



export default function TrainingScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}> Training Screen </Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});