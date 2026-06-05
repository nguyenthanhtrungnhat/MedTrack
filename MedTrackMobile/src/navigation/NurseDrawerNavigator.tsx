import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NurseTabNavigator from './NurseTabNavigator';
import NurseScheduleScreen from '../screens/nurse/NurseScheduleScreen';
import NurseShiftChangeScreen from '../screens/nurse/NurseShiftChangeScreen';
import NurseDailyCheckingScreen from '../screens/nurse/NurseDailyCheckingScreen';

// Reusing shared screens from the doctor folder (as agreed in the plan)
import RoomListScreen from '../screens/doctor/RoomListScreen';
import BedListScreen from '../screens/doctor/BedListScreen';
import BedDetailsScreen from '../screens/doctor/BedDetailsScreen';
import TestResultScreen from '../screens/doctor/TestResultScreen';
import TestResultDetailsScreen from '../screens/doctor/TestResultDetailsScreen';

const Stack = createNativeStackNavigator();

export default function NurseStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Dashboard"           component={NurseTabNavigator} />
            <Stack.Screen name="DrawerSchedule"      component={NurseScheduleScreen} />
            <Stack.Screen name="DrawerShiftRequests" component={NurseShiftChangeScreen} />
            <Stack.Screen name="DrawerDailyChecking" component={NurseDailyCheckingScreen} />
            <Stack.Screen name="RoomList"            component={RoomListScreen} />
            <Stack.Screen name="BedList"             component={BedListScreen} />
            <Stack.Screen name="BedDetails"          component={BedDetailsScreen} />
            <Stack.Screen name="TestResult"          component={TestResultScreen} />
            <Stack.Screen name="TestResultDetails"   component={TestResultDetailsScreen} />
        </Stack.Navigator>
    );
}
