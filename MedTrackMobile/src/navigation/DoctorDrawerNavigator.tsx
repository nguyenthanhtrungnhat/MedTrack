import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DoctorTabNavigator from './DoctorTabNavigator';
import DoctorAppointmentsScreen from '../screens/doctor/DoctorAppointmentsScreen';
import DoctorShiftRequestsScreen from '../screens/doctor/DoctorShiftRequestsScreen';
import TestResultScreen from '../screens/doctor/TestResultScreen';
import TestResultDetailsScreen from '../screens/doctor/TestResultDetailsScreen';
import PrescriptionListScreen from '../screens/doctor/PrescriptionListScreen';
import MakePrescriptionScreen from '../screens/doctor/MakePrescriptionScreen';
import TreatmentDashboardScreen from '../screens/doctor/TreatmentDashboardScreen';
import TreatmentTimelineScreen from '../screens/doctor/TreatmentTimelineScreen';
import TreatmentDetailScreen from '../screens/doctor/TreatmentDetailScreen';
import AssignScheduleScreen from '../screens/doctor/AssignScheduleScreen';
import RoomListScreen from '../screens/doctor/RoomListScreen';
import BedListScreen from '../screens/doctor/BedListScreen';
import BedDetailsScreen from '../screens/doctor/BedDetailsScreen';

const Stack = createNativeStackNavigator();

export default function DoctorStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Dashboard"           component={DoctorTabNavigator} />
            <Stack.Screen name="DrawerAppointments"  component={DoctorAppointmentsScreen} />
            <Stack.Screen name="DrawerShiftRequests" component={DoctorShiftRequestsScreen} />
            <Stack.Screen name="TestResult"          component={TestResultScreen} />
            <Stack.Screen name="TestResultDetails"   component={TestResultDetailsScreen} />
            <Stack.Screen name="MakePrescription"    component={MakePrescriptionScreen} />
            <Stack.Screen name="PrescriptionList"    component={PrescriptionListScreen} />
            <Stack.Screen name="TreatmentDashboard"  component={TreatmentDashboardScreen} />
            <Stack.Screen name="TreatmentDetail"     component={TreatmentDetailScreen} />
            <Stack.Screen name="TreatmentTimeline"   component={TreatmentTimelineScreen} />
            <Stack.Screen name="AssignSchedule"      component={AssignScheduleScreen} />
            <Stack.Screen name="RoomList"            component={RoomListScreen} />
            <Stack.Screen name="BedList"             component={BedListScreen} />
            <Stack.Screen name="BedDetails"          component={BedDetailsScreen} />
        </Stack.Navigator>
    );
}
