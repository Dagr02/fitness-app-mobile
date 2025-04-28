import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  const {signOut, token} = useAuthSession()
  const [tokenInUi, setTokenInUi] = useState<null|string|undefined>(null)

  const logout = () => {
     signOut();
  }

  const callApi = () => {
     setTokenInUi(token?.current);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <Button title={"Logout"} onPress={logout}/>
         <View style={{
            paddingTop: 20
         }} />
         <Text>Make an API call with the stored AUTH token</Text>
         <Button title={"Call API"} onPress={callApi} />
            {tokenInUi &&
         <Text>{`Your API access token is ${tokenInUi}`}</Text>
      }
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
