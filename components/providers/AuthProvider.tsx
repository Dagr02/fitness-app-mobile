import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from "expo-router";
import {createContext, MutableRefObject, ReactNode, useCallback, useContext, useEffect, useRef, useState} from 'react';


const AuthContext = createContext<{
        signIn: (token: string, refreshToken: string) => void;
        signOut: () => void
        token: MutableRefObject<string | null> | null;
        isLoading: boolean
}>({
        signIn: () => null,
        signOut: () => null,
        token: null,
        isLoading: true
});

export function useAuthSession(){
    return useContext(AuthContext);
}

export default function AuthProvider ({children}: {children : ReactNode}): ReactNode {
    const tokenRef = useRef<string|null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async ():Promise<void> => {
          const token = await AsyncStorage.getItem('@token');
          tokenRef.current = token || '';
          setIsLoading(false);
        })()
    }, []);

     const signIn = useCallback(async (token: string, refreshToken: string) => {
      
        await AsyncStorage.setItem('@token', token);
        await AsyncStorage.setItem('@refreshToken', refreshToken);
        tokenRef.current = token;
        router.replace('/')
      }, []);

     const signOut = useCallback(async () => {
        await AsyncStorage.multiRemove(['@token', '@refreshToken']);

        tokenRef.current = null;
        router.replace('/login');
     }, []);

     return (
        <AuthContext.Provider
          value={{
            signIn,
            signOut,
            token: tokenRef,
            isLoading
          }}
        >
          {children}
        </AuthContext.Provider>
      );
};