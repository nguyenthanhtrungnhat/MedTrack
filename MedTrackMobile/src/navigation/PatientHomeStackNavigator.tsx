import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PatientHomeScreen from '../screens/patient/PatientHomeScreen';
import MedicalHistoryScreen from '../screens/patient/MedicalHistoryScreen';
import MakeAppointmentScreen from '../screens/patient/MakeAppointmentScreen';

const Stack = createNativeStackNavigator();

export default function PatientHomeStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PatientHomeMain" component={PatientHomeScreen} />
            <Stack.Screen name="MedicalHistory" component={MedicalHistoryScreen} />
            <Stack.Screen name="MakeAppointment" component={MakeAppointmentScreen} />
        </Stack.Navigator>
    );
}