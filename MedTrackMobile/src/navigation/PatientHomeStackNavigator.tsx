import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PatientHomeScreen from '../screens/patient/PatientHomeScreen';
import MedicalHistoryScreen from '../screens/patient/MedicalHistoryScreen';

const Stack = createNativeStackNavigator();

export default function PatientHomeStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PatientHomeMain" component={PatientHomeScreen} />
            <Stack.Screen name="MedicalHistory" component={MedicalHistoryScreen} />
        </Stack.Navigator>
    );
}