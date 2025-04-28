import {View, Text, StyleSheet} from 'react-native';



export default function NutritionScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}> Nutrition Screen </Text>
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