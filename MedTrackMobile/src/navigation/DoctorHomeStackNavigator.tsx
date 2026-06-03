import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DoctorHomeScreen from '../screens/doctor/DoctorHomeScreen';
import DoctorAppointmentsScreen from '../screens/doctor/DoctorAppointmentsScreen';
import DoctorShiftRequestsScreen from '../screens/doctor/DoctorShiftRequestsScreen';

const Stack = createNativeStackNavigator();

export default function DoctorHomeStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DoctorHome" component={DoctorHomeScreen} />
            <Stack.Screen name="DoctorAppointments" component={DoctorAppointmentsScreen} />
            <Stack.Screen name="DoctorShiftRequests" component={DoctorShiftRequestsScreen} />
        </Stack.Navigator>
    );
}
