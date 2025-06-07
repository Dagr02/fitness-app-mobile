import {useAuthSession} from "@/components/providers/AuthProvider";
import {useState} from "react";
import {View, Text, Button, StyleSheet} from "react-native";

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
      <Text style={styles.text}>Home</Text>
      <Button title={"Logout"} onPress={logout}/>
      <View style={{
        paddingTop: 20
      }} />
      <Text style={styles.text}>Make an API call with the stored AUTH token</Text>
      <Button title={"Call API"} onPress={callApi} />
      {tokenInUi &&
        <Text style={styles.text}>{`Your API access token is ${tokenInUi}`}</Text>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});