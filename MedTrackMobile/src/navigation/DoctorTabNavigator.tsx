import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DoctorHomeStackNavigator from './DoctorHomeStackNavigator';
import DoctorProfileScreen from '../screens/doctor/DoctorProfileScreen';

const Tab = createBottomTabNavigator();

export default function DoctorTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
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
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#f0f0f0',
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                }
            })}
        >
            <Tab.Screen 
                name="Home" 
                component={DoctorHomeStackNavigator} 
                options={{ title: 'Home' }}
            />
            <Tab.Screen 
                name="Profile" 
                component={DoctorProfileScreen} 
                options={{ title: 'Profile' }}
            />
        </Tab.Navigator>
    );
}
