import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HamburgerMenu from '../../components/HamburgerMenu';
import { DOCTOR_MENU_ITEMS } from '../../components/DoctorLayout';
import ScreenWrapper from '../../components/ScreenWrapper';


export default function DoctorAppointmentsScreen() {
    const { userID } = useContext(AuthContext);
    const navigation = useNavigation<any>();

    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!userID) return;
            try {
                // Get Doctor ID
                const docRes = await axiosClient.get(`/doctors/by-user/${userID}`);
                const doctorID = docRes.data.doctorID;

                if (doctorID) {
                    // Update overdue status
                    await axiosClient.put('/appointments/check-overdue', {});
                    
                    // Fetch all appointments for this doctor
                    const apptRes = await axiosClient.get(`/appointments/all-appointment/doctor/${doctorID}`);
                    setAppointments(Array.isArray(apptRes.data) ? apptRes.data : []);
                }
            } catch (error) {
                console.error("Error fetching doctor appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [userID]);

    const renderAppointment = ({ item }: { item: any }) => {
        const isOverdue = item.appointmentStatus === 1;
        const statusColor = isOverdue ? '#e53e3e' : '#38a169';
        const bgColor = isOverdue ? '#fff5f5' : '#f0fff4';

        return (
            <View style={[styles.card, { borderLeftColor: statusColor }]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.dateText}>
                        <Ionicons name="calendar-outline" size={16} /> {new Date(item.dateTime).toLocaleDateString()}
                    </Text>
                    <View style={[styles.badge, { backgroundColor: bgColor }]}>
                        <Text style={[styles.badgeText, { color: statusColor }]}>
                            {isOverdue ? 'Overdue' : 'Upcoming'}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.cardBody}>
                    <View style={styles.infoRow}>
                        <Ionicons name="person-outline" size={18} color="#4a5568" />
                        <Text style={styles.infoText}>Patient: <Text style={styles.boldText}>{item.patientName || 'Unknown'}</Text></Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={18} color="#4a5568" />
                        <Text style={styles.infoText}>Room: {item.location || '-'}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <HamburgerMenu
                    menuItems={DOCTOR_MENU_ITEMS}
                    activeKey="DrawerAppointments"
                    onSelect={(key) => navigation.navigate(key)}
                />
                <Text style={styles.headerTitle}>Patient Appointments</Text>
                <View style={{ width: 30 }} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#002677" />
                </View>
            ) : (
                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.appointmentID.toString()}
                    renderItem={renderAppointment}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No appointments available.</Text>
                    }
                />
            )}
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    backBtn: { padding: 5 },
    
    listContainer: { padding: 20 },
    card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, elevation: 2, borderLeftWidth: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    dateText: { fontSize: 16, fontWeight: 'bold', color: '#2d3748' },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
    badgeText: { fontSize: 12, fontWeight: 'bold' },
    
    cardBody: { marginLeft: 5 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    infoText: { fontSize: 15, color: '#4a5568', marginLeft: 10 },
    boldText: { fontWeight: 'bold', color: '#2d3748' },
    
    emptyText: { textAlign: 'center', color: '#a0aec0', marginTop: 30, fontSize: 16 }
});
