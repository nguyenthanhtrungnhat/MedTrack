import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import HamburgerMenu from '../../components/HamburgerMenu';
import { DOCTOR_MENU_ITEMS } from '../../components/DoctorLayout';
import ScreenWrapper from '../../components/ScreenWrapper';


export default function DoctorHomeScreen() {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const { userID } = useContext(AuthContext);

    const [doctor, setDoctor] = useState<any>(null);
    const [apptCount, setApptCount] = useState(0);
    const [pendingShiftRequestCount, setPendingShiftRequestCount] = useState(0);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!userID) return;
            setLoading(true);
            try {
                // 1. Get Doctor Info
                const docRes = await axiosClient.get(`/doctors/by-user/${userID}`);
                const doctorData = docRes.data;
                const docID = doctorData.doctorID;
                
                if (docID) {
                    const detailRes = await axiosClient.get(`/doctors/${docID}`);
                    setDoctor(detailRes.data);

                    // 2. Get Appointments Count
                    const apptRes = await axiosClient.get(`/appointments/doctor/${docID}`);
                    setApptCount(Array.isArray(apptRes.data) ? apptRes.data.length : 0);
                }

                // 3. Get Pending Shift Requests
                const shiftRes = await axiosClient.get('/schedule-requests/pending/count');
                setPendingShiftRequestCount(shiftRes.data?.count || 0);

                // 4. Get Rooms
                const roomsRes = await axiosClient.get('/rooms');
                setRooms(roomsRes.data || []);

            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isFocused) {
            fetchDashboardData();
        }
    }, [userID, isFocused]);

    const renderRoom = ({ item }: { item: any }) => (
        <View style={styles.roomCard}>
            <View style={styles.roomIconBg}>
                <Ionicons name="bed" size={24} color="#002677" />
            </View>
            <View>
                <Text style={styles.roomName}>{item.department || "Room"}</Text>
                <Text style={styles.roomLocation}>{item.location}</Text>
            </View>
        </View>
    );

    if (loading && !doctor) {
        return (
            <ScreenWrapper style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#002677" />
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <HamburgerMenu
                            menuItems={DOCTOR_MENU_ITEMS}
                            activeKey="Dashboard"
                            onSelect={(key) => navigation.navigate(key)}
                        />
                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.greeting}>Welcome Doctor,</Text>
                            <Text style={styles.doctorName}>{doctor?.fullName || 'Loading...'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
                        <Ionicons name="person-circle" size={45} color="#002677" />
                    </TouchableOpacity>
                </View>

                {/* Dashboard Widgets */}
                <Text style={styles.sectionTitle}>Work Overview</Text>
                <View style={styles.widgetContainer}>
                    <TouchableOpacity 
                        style={[styles.widgetCard, { borderLeftColor: '#38a169', borderLeftWidth: 4 }]}
                        onPress={() => navigation.navigate('DoctorAppointments')}
                    >
                        <View style={styles.widgetHeader}>
                            <Ionicons name="calendar" size={28} color="#38a169" />
                            <Text style={[styles.widgetValue, { color: '#38a169' }]}>{apptCount}</Text>
                        </View>
                        <Text style={styles.widgetTitle}>Today's Appointments</Text>
                        <Text style={styles.widgetSubtitle}>Tap to view details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.widgetCard, { borderLeftColor: '#3182ce', borderLeftWidth: 4 }]}
                        onPress={() => navigation.navigate('DoctorShiftRequests')}
                    >
                        <View style={styles.widgetHeader}>
                            <Ionicons name="document-text" size={28} color="#3182ce" />
                            {pendingShiftRequestCount > 0 && (
                                <View style={styles.redBadge}><Text style={styles.redBadgeText}>{pendingShiftRequestCount}</Text></View>
                            )}
                            <Text style={[styles.widgetValue, { color: '#3182ce' }]}>{pendingShiftRequestCount}</Text>
                        </View>
                        <Text style={styles.widgetTitle}>Shift Requests</Text>
                        <Text style={styles.widgetSubtitle}>From Nurses</Text>
                    </TouchableOpacity>
                </View>

                {/* Medicine Schedule Widget (Placeholder like Web) */}
                <View style={styles.medicineCard}>
                    <View style={styles.medicineHeader}>
                        <Text style={styles.medicineTitle}>General Reminders</Text>
                        <View style={styles.medicineBadge}>
                            <Text style={styles.medicineBadgeText}>0</Text>
                            <Ionicons name="notifications" size={16} color="#002677" />
                        </View>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.medicineLink}>View Details</Text>
                    </TouchableOpacity>
                </View>

                {/* Room List */}
                <Text style={styles.sectionTitle}>Department List</Text>
                <FlatList
                    data={rooms}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(r) => r.roomID.toString()}
                    renderItem={renderRoom}
                    contentContainerStyle={{ paddingRight: 20 }}
                />

            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' },
    scrollContent: { padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    menuBtn: { marginRight: 15 },
    greeting: { fontSize: 16, color: '#505F63', marginBottom: 4 },
    doctorName: { fontSize: 22, fontWeight: 'bold', color: '#002677' },
    profileBtn: { padding: 2 },
    
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    
    widgetContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    widgetCard: { width: '48%', backgroundColor: '#fff', padding: 15, borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
    widgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, position: 'relative' },
    widgetValue: { fontSize: 26, fontWeight: 'bold' },
    widgetTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    widgetSubtitle: { fontSize: 12, color: '#666' },
    redBadge: { position: 'absolute', top: -5, left: 15, backgroundColor: '#e53e3e', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
    redBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

    medicineCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, marginBottom: 25 },
    medicineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    medicineTitle: { fontSize: 16, fontWeight: 'bold', color: '#002677' },
    medicineBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ebf8ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
    medicineBadgeText: { color: '#002677', fontWeight: 'bold', marginRight: 5 },
    medicineLink: { color: '#3182ce', textDecorationLine: 'underline', fontSize: 14 },

    roomCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginRight: 15, elevation: 2, minWidth: 200, borderWidth: 1, borderColor: '#edf2f7' },
    roomIconBg: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#ebf8ff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    roomName: { fontSize: 15, fontWeight: 'bold', color: '#2d3748', marginBottom: 2 },
    roomLocation: { fontSize: 13, color: '#718096' }
});
