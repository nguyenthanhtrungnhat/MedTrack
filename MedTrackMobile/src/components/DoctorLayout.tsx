import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HamburgerMenu, { MenuItem } from './HamburgerMenu';
import { useNavigation } from '@react-navigation/native';

export const DOCTOR_MENU_ITEMS: MenuItem[] = [
    { key: 'Dashboard',         label: 'Dashboard',           icon: 'home-outline' },
    { key: 'DrawerAppointments',label: 'Appointments',         icon: 'calendar-outline' },
    { key: 'DrawerShiftRequests',label: 'Shift Request',       icon: 'swap-horizontal-outline' },
    { key: 'TestResult',        label: 'Test Result',          icon: 'flask-outline' },
    { key: 'MakePrescription',  label: 'Make Prescription',    icon: 'create-outline' },
    { key: 'PrescriptionList',  label: 'Prescription List',    icon: 'list-outline' },
    { key: 'TreatmentTimeline', label: 'Treatment Timeline',   icon: 'time-outline' },
    { key: 'TreatmentDashboard',label: 'Treatment Dashboard',  icon: 'analytics-outline' },
    { key: 'AssignSchedule',    label: 'Assign Schedule',      icon: 'people-outline' },
    { key: 'RoomList',          label: 'Rooms & Beds',         icon: 'bed-outline' },
];

type Props = {
    children: React.ReactNode;
    activeKey?: string;
};

export default function DoctorLayout({ children, activeKey = 'Dashboard' }: Props) {
    const navigation = useNavigation<any>();

    const handleMenuSelect = (key: string) => {
        navigation.navigate(key);
    };

    return (
        <View style={styles.container}>
            {children}
            {/* The hamburger menu floats over content via the HamburgerMenu component's Modal */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
});
