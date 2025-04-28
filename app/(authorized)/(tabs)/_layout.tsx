import {Tabs} from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return(
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffd33d',
                headerStyle: {
                    backgroundColor: '#25292e'
                },
                headerShadowVisible: true,
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#25292e',
                },
            }}
        >
            <Tabs.Screen name="index" options={{
                    title: 'Dashboard',
                    tabBarIcon: ({color, focused}) => (
                      <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                    ),
                }}
            />

            <Tabs.Screen name="nutrition" options={{
                    title: 'Nutrition',
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? 'fast-food-sharp' : 'fast-food-outline'} color={color} size={24} />
                    ),

                }}
            />

            <Tabs.Screen name="training" options={{
                    title: 'Training',
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? 'barbell-sharp' : 'barbell-outline'} color={color} size={24} />
                    ),

                }}
            />

            <Tabs.Screen name="profile" options={{
                    title: 'Profile',
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
                    ),
                }}
            />
        </Tabs>

    )
}