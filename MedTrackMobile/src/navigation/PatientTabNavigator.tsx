import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import PatientHomeStackNavigator from './PatientHomeStackNavigator';
import PatientHomeScreen from '../screens/patient/PatientHomeScreen';
import PatientProfileScreen from '../screens/patient/PatientProfileScreen';

const Tab = createBottomTabNavigator();

export default function PatientTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, // Ẩn header mặc định của Tab
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#002677',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    paddingBottom: 5,
                    height: 60,
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={PatientHomeStackNavigator} 
                options={{ tabBarLabel: 'Trang chủ' }}
            />
            <Tab.Screen
                name="Profile"
                component={PatientProfileScreen}
                options={{ tabBarLabel: 'Hồ sơ' }}
            />
        </Tab.Navigator>
    );
}