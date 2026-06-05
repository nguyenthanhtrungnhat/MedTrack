import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import HamburgerMenu from '../../components/HamburgerMenu';
import { NURSE_MENU_ITEMS } from '../../components/NurseLayout';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function NurseHomeScreen() {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const { userID } = useContext(AuthContext);

    const [nurse, setNurse] = useState<any>(null);
    const [scheduleCount, setScheduleCount] = useState(0);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!userID) return;
            setLoading(true);
            try {
                // 1. Get Nurse Info
                const nurseRes = await axiosClient.get(`/nurses/by-user/${userID}`);
                const nurseData = nurseRes.data;
                setNurse(nurseData);
                const nurseID = nurseData?.nurseID;
                
                if (nurseID) {
                    // 2. Get Schedules Count
                    try {
                        const schedRes = await axiosClient.get(`/schedules/nurse/${nurseID}`);
                        setScheduleCount(Array.isArray(schedRes.data) ? schedRes.data.length : 0);
                    } catch (e) {
                        setScheduleCount(0);
                    }
                }

                // 3. Get Rooms
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
        <TouchableOpacity style={styles.roomCard} onPress={() => navigation.navigate('RoomList')}>
            <View style={styles.roomIconBg}>
                <Ionicons name="bed" size={24} color="#002677" />
            </View>
            <View>
                <Text style={styles.roomName}>{item.department || "Room"}</Text>
                <Text style={styles.roomLocation}>{item.location}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading && !nurse) {
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
                            menuItems={NURSE_MENU_ITEMS}
                            activeKey="Dashboard"
                            onSelect={(key) => navigation.navigate(key)}
                        />
                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.greeting}>Welcome Nurse,</Text>
                            <Text style={styles.nurseName}>{nurse?.fullName || 'Loading...'}</Text>
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
                        onPress={() => navigation.navigate('DrawerSchedule')}
                    >
                        <View style={styles.widgetHeader}>
                            <Ionicons name="calendar" size={28} color="#38a169" />
                            <Text style={[styles.widgetValue, { color: '#38a169' }]}>{scheduleCount}</Text>
                        </View>
                        <Text style={styles.widgetTitle}>Assigned Tasks</Text>
                        <Text style={styles.widgetSubtitle}>Tap to view schedule</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.widgetCard, { borderLeftColor: '#3182ce', borderLeftWidth: 4 }]}
                        onPress={() => navigation.navigate('DrawerShiftRequests')}
                    >
                        <View style={styles.widgetHeader}>
                            <Ionicons name="swap-horizontal" size={28} color="#3182ce" />
                            <Text style={[styles.widgetValue, { color: '#3182ce' }]}>-</Text>
                        </View>
                        <Text style={styles.widgetTitle}>Shift Requests</Text>
                        <Text style={styles.widgetSubtitle}>Manage requests</Text>
                    </TouchableOpacity>
                </View>

                {/* Medicine Schedule Widget */}
                <View style={styles.medicineCard}>
                    <View style={styles.medicineHeader}>
                        <Text style={styles.medicineTitle}>Medicine Schedule</Text>
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
                {rooms.length === 0 ? (
                    <Text style={styles.emptyText}>No departments found</Text>
                ) : (
                    <FlatList
                        data={rooms}
                        keyExtractor={(item) => item.roomID?.toString() || Math.random().toString()}
                        renderItem={renderRoom}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    greeting: { fontSize: 14, color: '#718096' },
    nurseName: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    profileBtn: { padding: 4 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d3748', marginBottom: 15 },
    widgetContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    widgetCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 15, marginHorizontal: 5, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    widgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    widgetValue: { fontSize: 24, fontWeight: 'bold' },
    widgetTitle: { fontSize: 14, fontWeight: '600', color: '#2d3748', marginBottom: 4 },
    widgetSubtitle: { fontSize: 12, color: '#718096' },
    medicineCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 25, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    medicineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    medicineTitle: { fontSize: 16, fontWeight: 'bold', color: '#002677' },
    medicineBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ebf8ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    medicineBadgeText: { color: '#002677', fontWeight: 'bold', marginRight: 4 },
    medicineLink: { color: '#3182ce', fontSize: 14, fontWeight: '500' },
    roomCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginRight: 15, width: 140, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    roomIconBg: { backgroundColor: '#ebf8ff', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    roomName: { fontSize: 14, fontWeight: 'bold', color: '#2d3748', marginBottom: 4 },
    roomLocation: { fontSize: 12, color: '#718096' },
    emptyText: { color: '#a0aec0', fontStyle: 'italic' },
});
