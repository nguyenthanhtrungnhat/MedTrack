import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HamburgerMenu from '../../components/HamburgerMenu';
import { DOCTOR_MENU_ITEMS } from '../../components/DoctorLayout';
import ScreenWrapper from '../../components/ScreenWrapper';


const screens = [
    { key: 'TreatmentTimeline', title: 'Medical Record', icon: 'time-outline' as const, text: 'Interface under development...' },
    { key: 'TreatmentDashboard', title: 'Treatment Dashboard', icon: 'analytics-outline' as const, text: 'Interface under development...' }
];

function PlaceholderScreen({ screenKey }: { screenKey: string }) {
    const navigation = useNavigation<any>();
    const info = screens.find(s => s.key === screenKey)!;
    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <HamburgerMenu menuItems={DOCTOR_MENU_ITEMS} activeKey={screenKey} onSelect={(key) => navigation.navigate(key)} />
                <Text style={styles.headerTitle}>{info.title}</Text>
                <View style={{ width: 30 }} />
            </View>
            <View style={styles.centerContainer}>
                <Ionicons name={info.icon} size={60} color="#a0aec0" />
                <Text style={styles.text}>{info.text}</Text>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    text: { color: '#a0aec0', marginTop: 10, fontSize: 16 }
});

export function TreatmentTimelineScreen() { return <PlaceholderScreen screenKey="TreatmentTimeline" />; }
export function TreatmentDashboardScreen() { return <PlaceholderScreen screenKey="TreatmentDashboard" />; }
