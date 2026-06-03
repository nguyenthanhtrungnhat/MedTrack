import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axiosClient from '../../api/axiosClient';
import HamburgerMenu from '../../components/HamburgerMenu';
import { DOCTOR_MENU_ITEMS } from '../../components/DoctorLayout';
import SearchSelectModal from '../../components/SearchSelectModal';
import ScreenWrapper from '../../components/ScreenWrapper';


// Config Calendar language
LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today'
};
LocaleConfig.defaultLocale = 'en';

export default function AssignScheduleScreen() {
    const navigation = useNavigation<any>();

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [schedules, setSchedules] = useState<any[]>([]);
    const [nurses, setNurses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [editingID, setEditingID] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [roomID, setRoomID] = useState('');
    const [workingHours, setWorkingHours] = useState('8');
    const [selectedNurse, setSelectedNurse] = useState<any>(null);
    
    const [showNurseModal, setShowNurseModal] = useState(false);
    
    // Time picker state
    const [startTime, setStartTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [schedRes, nurseRes] = await Promise.all([
                axiosClient.get('/schedules'),
                axiosClient.get('/schedules/nurses')
            ]);
            setSchedules(schedRes.data || []);
            setNurses(nurseRes.data || []);
        } catch (error) {
            console.error("Error loading schedules:", error);
            Alert.alert("Error", "Could not load schedules.");
        } finally {
            setLoading(false);
        }
    };

    // Derived states
    const markedDates = useMemo(() => {
        let marks: any = {};
        schedules.forEach(s => {
            const d = s.date.split('T')[0];
            marks[d] = { marked: true, dotColor: '#3182ce' };
        });
        marks[selectedDate] = { ...marks[selectedDate], selected: true, selectedColor: '#002677' };
        return marks;
    }, [schedules, selectedDate]);

    const dailySchedules = useMemo(() => {
        return schedules.filter(s => s.date.split('T')[0] === selectedDate);
    }, [schedules, selectedDate]);

    const handleOpenCreate = () => {
        setEditingID(null);
        setName('');
        setRoomID('');
        setWorkingHours('8');
        setSelectedNurse(null);
        
        const now = new Date();
        now.setHours(8, 0, 0, 0);
        setStartTime(now);
        
        setModalVisible(true);
    };

    const handleOpenEdit = (schedule: any) => {
        setEditingID(schedule.scheduleID);
        setName(schedule.name);
        setRoomID(String(schedule.roomID));
        setWorkingHours(String(schedule.working_hours));
        
        const nurse = nurses.find(n => n.nurseID === schedule.nurseID);
        setSelectedNurse(nurse || null);
        
        const [hours, minutes] = schedule.start_at.split(':');
        const time = new Date();
        time.setHours(Number(hours), Number(minutes), 0, 0);
        setStartTime(time);
        
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!name || !selectedNurse || !roomID) {
            Alert.alert("Missing Info", "Please provide Shift Name, Room, and Nurse.");
            return;
        }

        const startAt = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}:00`;
        const payload = {
            name,
            date: selectedDate,
            start_at: startAt,
            working_hours: Number(workingHours),
            nurseID: selectedNurse.nurseID,
            roomID: Number(roomID),
            color: '#3182ce'
        };

        setSaving(true);
        try {
            if (editingID) {
                await axiosClient.put(`/schedules/${editingID}`, payload);
            } else {
                await axiosClient.post('/schedules', payload);
            }
            setModalVisible(false);
            loadData();
        } catch (error) {
            console.error("Save error:", error);
            Alert.alert("Error", "Could not save schedule.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert("Confirm", "Are you sure you want to delete this schedule?", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Delete", 
                style: "destructive",
                onPress: async () => {
                    setSaving(true);
                    try {
                        await axiosClient.delete(`/schedules/${editingID}`);
                        setModalVisible(false);
                        loadData();
                    } catch (error) {
                        console.error("Delete error:", error);
                        Alert.alert("Error", "Could not delete schedule.");
                    } finally {
                        setSaving(false);
                    }
                }
            }
        ]);
    };

    const formatTimeStr = (dateObj: Date) => {
        return `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <HamburgerMenu menuItems={DOCTOR_MENU_ITEMS} activeKey="AssignSchedule" onSelect={(key) => navigation.navigate(key)} />
                <Text style={styles.headerTitle}>Assign Schedule</Text>
                <TouchableOpacity onPress={handleOpenCreate}>
                    <Ionicons name="add-circle" size={28} color="#002677" />
                </TouchableOpacity>
            </View>

            {loading && schedules.length === 0 ? (
                <View style={styles.centerContainer}><ActivityIndicator size="large" color="#002677" /></View>
            ) : (
                <View style={{ flex: 1 }}>
                    <Calendar
                        onDayPress={(day: any) => setSelectedDate(day.dateString)}
                        markedDates={markedDates}
                        theme={{
                            selectedDayBackgroundColor: '#002677',
                            todayTextColor: '#e53e3e',
                            arrowColor: '#002677',
                            dotColor: '#3182ce',
                        }}
                    />

                    <View style={styles.dateHeader}>
                        <Text style={styles.dateTitle}>Schedules ({selectedDate})</Text>
                    </View>

                    <ScrollView style={styles.scheduleList}>
                        {dailySchedules.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No schedules for this day.</Text>
                            </View>
                        ) : (
                            dailySchedules.map((item) => (
                                <TouchableOpacity 
                                    key={item.scheduleID} 
                                    style={styles.card}
                                    onPress={() => handleOpenEdit(item)}
                                >
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle}>{item.name}</Text>
                                        <View style={styles.timeBadge}>
                                            <Ionicons name="time-outline" size={14} color="#2b6cb0" />
                                            <Text style={styles.timeText}>{item.start_at.substring(0,5)} ({item.working_hours}h)</Text>
                                        </View>
                                    </View>
                                    
                                    <View style={styles.cardInfo}>
                                        <Ionicons name="person-circle-outline" size={18} color="#718096" />
                                        <Text style={styles.infoText}>{item.fullName || `Nurse #${item.nurseID}`}</Text>
                                    </View>
                                    
                                    <View style={styles.cardInfo}>
                                        <Ionicons name="business-outline" size={18} color="#718096" />
                                        <Text style={styles.infoText}>Room: {item.roomID}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>

                    {/* FAB Button */}
                    <TouchableOpacity style={styles.fab} onPress={handleOpenCreate}>
                        <Ionicons name="add" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Modal Edit/Create */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editingID ? 'Edit Schedule' : 'New Schedule'}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#4a5568" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ padding: 20 }}>
                            <Text style={styles.label}>Shift Name</Text>
                            <TextInput style={styles.input} placeholder="E.g.: Morning, Night..." value={name} onChangeText={setName} />

                            <Text style={styles.label}>Select Nurse</Text>
                            <TouchableOpacity style={styles.selectBtn} onPress={() => setShowNurseModal(true)}>
                                <Text style={[styles.selectBtnText, !selectedNurse && { color: '#a0aec0' }]}>
                                    {selectedNurse ? selectedNurse.fullName : 'Tap to select nurse...'}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#a0aec0" />
                            </TouchableOpacity>

                            <View style={styles.row}>
                                <View style={styles.col}>
                                    <Text style={styles.label}>Room ID</Text>
                                    <TextInput style={styles.input} keyboardType="numeric" value={roomID} onChangeText={setRoomID} />
                                </View>
                                <View style={[styles.col, { marginLeft: 10 }]}>
                                    <Text style={styles.label}>Working Hours</Text>
                                    <TextInput style={styles.input} keyboardType="numeric" value={workingHours} onChangeText={setWorkingHours} />
                                </View>
                            </View>

                            <Text style={styles.label}>Start Time</Text>
                            <TouchableOpacity style={styles.timeBtn} onPress={() => setShowTimePicker(true)}>
                                <Ionicons name="time-outline" size={20} color="#002677" />
                                <Text style={styles.timeBtnText}>{formatTimeStr(startTime)}</Text>
                            </TouchableOpacity>

                            {showTimePicker && (
                                <DateTimePicker
                                    value={startTime}
                                    mode="time"
                                    is24Hour={true}
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowTimePicker(false);
                                        if (selectedDate) setStartTime(selectedDate);
                                    }}
                                />
                            )}
                            
                            <View style={{ height: 20 }} />
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            {editingID ? (
                                <TouchableOpacity style={[styles.btn, styles.btnDelete]} onPress={handleDelete} disabled={saving}>
                                    <Text style={styles.btnTextDelete}>Delete</Text>
                                </TouchableOpacity>
                            ) : <View style={{ flex: 1 }} />}

                            <TouchableOpacity style={[styles.btn, styles.btnSave, saving && { opacity: 0.7 }]} onPress={handleSave} disabled={saving}>
                                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextSave}>Save</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Nurse Select Modal */}
            <SearchSelectModal
                visible={showNurseModal}
                onClose={() => setShowNurseModal(false)}
                data={nurses}
                title="Select Nurse"
                searchKey="fullName"
                displayKey="fullName"
                onSelect={setSelectedNurse}
            />

        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    dateHeader: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 5 },
    dateTitle: { fontSize: 16, fontWeight: 'bold', color: '#2d3748' },
    scheduleList: { flex: 1, padding: 15 },
    emptyContainer: { padding: 30, alignItems: 'center' },
    emptyText: { color: '#a0aec0', fontSize: 15 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#3182ce', elevation: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#2d3748' },
    timeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ebf8ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    timeText: { color: '#2b6cb0', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
    cardInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    infoText: { fontSize: 14, color: '#4a5568', marginLeft: 6 },
    fab: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#002677', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    label: { fontSize: 14, fontWeight: 'bold', color: '#4a5568', marginBottom: 6 },
    input: { backgroundColor: '#f7fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, marginBottom: 15, color: '#2d3748' },
    selectBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f7fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 15 },
    selectBtnText: { fontSize: 15, color: '#2d3748' },
    row: { flexDirection: 'row' },
    col: { flex: 1 },
    timeBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ebf8ff', alignSelf: 'flex-start', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#bee3f8' },
    timeBtnText: { fontSize: 16, fontWeight: 'bold', color: '#002677', marginLeft: 8 },
    modalFooter: { flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: '#edf2f7' },
    btn: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
    btnDelete: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e53e3e' },
    btnTextDelete: { color: '#e53e3e', fontSize: 16, fontWeight: 'bold' },
    btnSave: { backgroundColor: '#002677' },
    btnTextSave: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
