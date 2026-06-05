import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import NurseHomeScreen from '../screens/nurse/NurseHomeScreen';
import NurseProfileScreen from '../screens/nurse/NurseProfileScreen';

const Tab = createBottomTabNavigator();

export default function NurseTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';
                    if (route.name === 'Home') iconName = 'home-outline';
                    else if (route.name === 'Profile') iconName = 'person-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#002677',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={NurseHomeScreen} />
            <Tab.Screen name="Profile" component={NurseProfileScreen} />
        </Tab.Navigator>
    );
}
