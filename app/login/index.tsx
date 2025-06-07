import {useAuthSession} from "@/components/providers/AuthProvider";
import {ReactNode, useState} from "react";
import {Button, Text, View, TextInput} from "react-native";
import { router } from "expo-router";

export default function Login(): ReactNode {
  const {signIn} = useAuthSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const login = async ():Promise<void> => {
      try{
          const response = await fetch('http://192.168.1.6:9090/login', {
             method: 'POST',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({
                email: email,
                password: password,
             }),
          });

          if(!response.ok){
             throw new Error('Login Failed');
          }

          const data = await response.json();

          if(data.token){
              await signIn(data.token);
          }else{
              setError("Invalid login. Token missing.");
          }
      } catch(err){

          setError("Login Error");
      }

  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login screen</Text>

      <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{ marginBottom: 10, width: 200, padding: 8, borderWidth: 1 }}
      />

      <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ marginBottom: 10, width: 200, padding: 8, borderWidth: 1 }}
      />

      {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

      <Button title="Login" onPress={login} />

      <Button
         title="Don't have an account? Register"
         onPress={() => router.push('/register')}
      />
      </View>
  );
}