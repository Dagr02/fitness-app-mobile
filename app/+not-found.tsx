import {View, StyleSheet, Text} from 'react-native';
import {Stack} from 'expo-router';

export default function NotFoundScreen(){
    return (
        <>
            <Stack.Screen options={{ title: 'Not Found'}} />
            <View style={styles.container}>
                <Text> Not Found </Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: '#fff',
    }
});