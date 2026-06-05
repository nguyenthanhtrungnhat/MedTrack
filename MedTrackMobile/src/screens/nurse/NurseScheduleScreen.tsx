import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function NurseScheduleScreen() {
    const { userID } = useContext(AuthContext);
    const navigation = useNavigation<any>();
    
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchSchedule = async () => {
            if (!userID) return;
            try {
                // Get Nurse ID first
                const nurseRes = await axiosClient.get(`/nurses/by-user/${userID}`);
                const nurseID = nurseRes.data?.nurseID;

                if (nurseID) {
                    const schedRes = await axiosClient.get(`/schedules/nurse/${nurseID}`);
                    if (Array.isArray(schedRes.data)) {
                        setSchedules(schedRes.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching nurse schedule:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [userID]);

    const renderScheduleItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.dateBadge}>
                    <Text style={styles.dateText}>{item.date}</Text>
                </View>
                <Text style={styles.statusText}>Assigned</Text>
            </View>
            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={18} color="#718096" />
                    <Text style={styles.infoText}>Start at: {item.start_at}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="hourglass-outline" size={18} color="#718096" />
                    <Text style={styles.infoText}>Duration: {item.working_hours} hours</Text>
                </View>
            </View>
        </View>
    );

    const markedDates = schedules.reduce((acc: any, schedule: any) => {
        const dateStr = schedule.date?.split('T')[0] || schedule.date;
        if (dateStr) {
            acc[dateStr] = {
                marked: true,
                dotColor: '#3182ce',
                selected: dateStr === selectedDate,
                selectedColor: dateStr === selectedDate ? '#3182ce' : undefined,
            };
        }
        return acc;
    }, {});

    // Ensure selected date is highlighted even if it has no schedules
    if (!markedDates[selectedDate]) {
        markedDates[selectedDate] = { selected: true, selectedColor: '#3182ce' };
    }

    const selectedSchedules = schedules.filter(s => {
        const d = s.date?.split('T')[0] || s.date;
        return d === selectedDate;
    });

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#002677" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Schedule</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#002677" />
                </View>
            ) : (
                <>
                    <Calendar
                        onDayPress={(day: any) => setSelectedDate(day.dateString)}
                        markedDates={markedDates}
                        theme={{
                            selectedDayBackgroundColor: '#3182ce',
                            todayTextColor: '#3182ce',
                            arrowColor: '#002677',
                            dotColor: '#3182ce',
                        }}
                        style={styles.calendar}
                    />
                    
                    <View style={styles.listHeader}>
                        <Text style={styles.listTitle}>Schedules on {selectedDate}</Text>
                    </View>

                    {selectedSchedules.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="calendar-clear-outline" size={60} color="#cbd5e0" />
                            <Text style={styles.emptyText}>No assigned schedules for this day.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={selectedSchedules}
                            keyExtractor={(item, index) => item.scheduleID?.toString() || index.toString()}
                            renderItem={renderScheduleItem}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </>
            )}
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    backBtn: { padding: 4, marginLeft: -4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    calendar: { marginBottom: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    listHeader: { paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#f7fafc', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    listTitle: { fontSize: 16, fontWeight: 'bold', color: '#2d3748' },
    listContent: { padding: 15 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#edf2f7', paddingBottom: 10 },
    dateBadge: { backgroundColor: '#ebf8ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    dateText: { color: '#3182ce', fontWeight: 'bold', fontSize: 14 },
    statusText: { color: '#38a169', fontWeight: 'bold', fontSize: 13 },
    cardBody: { gap: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    infoText: { marginLeft: 8, fontSize: 15, color: '#4a5568' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { marginTop: 15, fontSize: 15, color: '#a0aec0' },
});
