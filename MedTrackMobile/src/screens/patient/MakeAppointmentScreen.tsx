import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    FlatList,
    Platform
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../components/ScreenWrapper';


export default function MakeAppointmentScreen() {
    const { userID } = useContext(AuthContext);
    const navigation = useNavigation();

    const [doctors, setDoctors] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
    const [dateTime, setDateTime] = useState('');
    const [dateObj, setDateObj] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const [location, setLocation] = useState('');

    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        const initData = async () => {
            if (!userID) return;
            try {
                // Check overdue first
                await axiosClient.put('/appointments/check-overdue', {});
                
                // Load Doctors
                const docRes = await axiosClient.get('/doctors');
                setDoctors(docRes.data || []);

                // Load Appointments
                await loadAppointments();

            } catch (error) {
                console.error("Error loading appointment data:", error);
                Alert.alert('Lỗi', 'Không thể tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, [userID]);

    const loadAppointments = async () => {
        try {
            const apptRes = await axiosClient.get(`/appointments/${userID}`);
            setAppointments(apptRes.data || []);
        } catch (error) {
            console.error("Error loading appointments:", error);
        }
    };

    const handleDoctorSelect = (doc: any) => {
        setSelectedDoctorId(doc.doctorID);
        setLocation(doc.office || '');
    };

    const showMode = (currentMode: 'date' | 'time') => {
        setShowPicker(true);
        setPickerMode(currentMode);
    };

    const onPickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDateObj(selectedDate);
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const hours = String(selectedDate.getHours()).padStart(2, '0');
            const minutes = String(selectedDate.getMinutes()).padStart(2, '0');
            setDateTime(`${year}-${month}-${day} ${hours}:${minutes}`);
        }
    };

    const handleCreate = async () => {
        if (!selectedDoctorId || !dateTime) {
            Alert.alert('Thiếu thông tin', 'Vui lòng chọn bác sĩ và ngày giờ khám.');
            return;
        }

        // Prevent duplicate booking
        const isDuplicate = appointments.some(a => a.doctorID === selectedDoctorId && a.dateTime === dateTime);
        if (isDuplicate) {
            Alert.alert('Trùng lặp', 'Bạn đã đặt lịch với bác sĩ này vào thời gian trên.');
            return;
        }

        setBooking(true);
        try {
            await axiosClient.post('/appointments', {
                doctorID: selectedDoctorId,
                userID,
                dateTime,
                location
            });
            Alert.alert('Thành công', 'Đặt lịch khám thành công!');
            
            setSelectedDoctorId(null);
            setDateTime('');
            setLocation('');
            
            await loadAppointments();
        } catch (error: any) {
            console.error("Error booking appointment:", error);
            if (error.response?.status === 400) {
                Alert.alert('Lỗi', error.response.data.message);
            } else {
                Alert.alert('Lỗi', 'Không thể đặt lịch khám. Vui lòng thử lại sau.');
            }
        } finally {
            setBooking(false);
        }
    };

    const renderDoctor = ({ item }: { item: any }) => {
        const isSelected = item.doctorID === selectedDoctorId;
        return (
            <TouchableOpacity 
                style={[styles.doctorCard, isSelected && styles.doctorCardSelected]} 
                onPress={() => handleDoctorSelect(item)}
            >
                <Ionicons name="person-circle" size={40} color={isSelected ? "#fff" : "#002677"} />
                <View style={styles.doctorInfo}>
                    <Text style={[styles.doctorName, isSelected && styles.textWhite]}>BS. {item.fullName}</Text>
                    <Text style={[styles.doctorDept, isSelected && styles.textWhite]}>{item.department}</Text>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={24} color="#fff" />}
            </TouchableOpacity>
        );
    };

    const renderAppointment = ({ item }: { item: any }) => {
        const isOverdue = item.appointmentStatus === 1;
        return (
            <View style={[styles.apptCard, isOverdue ? styles.apptOverdue : styles.apptComing]}>
                <View style={styles.apptHeader}>
                    <Text style={styles.apptDate}><Ionicons name="calendar" size={14}/> {item.dateTime}</Text>
                    <View style={[styles.badge, isOverdue ? styles.badgeOverdue : styles.badgeComing]}>
                        <Text style={styles.badgeText}>{isOverdue ? "Quá hạn" : "Sắp tới"}</Text>
                    </View>
                </View>
                <Text style={styles.apptDoctor}>Bác sĩ: {item.doctorName}</Text>
                <Text style={styles.apptLocation}>Phòng: {item.location}</Text>
            </View>
        );
    };

    if (loading) {
        return (
            <ScreenWrapper style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#002677" />
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#002677" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đặt lịch khám</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <Text style={styles.sectionTitle}>1. Chọn Bác sĩ</Text>
                <FlatList
                    horizontal
                    data={doctors}
                    keyExtractor={(d) => d.doctorID.toString()}
                    renderItem={renderDoctor}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.doctorList}
                />

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>2. Ngày giờ khám</Text>
                    <View style={styles.dateTimeContainer}>
                        <TouchableOpacity style={styles.dateBtn} onPress={() => showMode('date')}>
                            <Ionicons name="calendar-outline" size={20} color="#002677" style={{marginRight: 8}}/>
                            <Text style={styles.dateBtnText}>{dateTime ? dateTime.split(' ')[0] : 'Chọn ngày'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dateBtn} onPress={() => showMode('time')}>
                            <Ionicons name="time-outline" size={20} color="#002677" style={{marginRight: 8}}/>
                            <Text style={styles.dateBtnText}>{dateTime && dateTime.includes(' ') ? dateTime.split(' ')[1] : 'Chọn giờ'}</Text>
                        </TouchableOpacity>
                    </View>

                    {showPicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={dateObj}
                            mode={pickerMode}
                            is24Hour={true}
                            display="default"
                            onChange={onPickerChange}
                            minimumDate={new Date()}
                        />
                    )}

                    <Text style={styles.sectionTitle}>3. Phòng khám (Tự động)</Text>
                    <TextInput
                        style={[styles.input, styles.inputDisabled]}
                        value={location}
                        placeholder="Chọn bác sĩ để hiển thị phòng"
                        editable={false}
                    />

                    <TouchableOpacity 
                        style={[styles.bookBtn, booking && styles.bookBtnDisabled]} 
                        onPress={handleCreate}
                        disabled={booking}
                    >
                        {booking ? <ActivityIndicator color="#fff" /> : <Text style={styles.bookBtnText}>Xác nhận đặt lịch</Text>}
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Lịch hẹn của bạn ({appointments.length})</Text>
                {appointments.length === 0 ? (
                    <Text style={styles.emptyText}>Bạn chưa có lịch hẹn nào.</Text>
                ) : (
                    appointments.map(a => <View key={a.appointmentID}>{renderAppointment({ item: a })}</View>)
                )}

            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    backBtn: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    scrollContent: { paddingBottom: 40 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginLeft: 20, marginTop: 20, marginBottom: 10 },
    doctorList: { paddingHorizontal: 15 },
    doctorCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginHorizontal: 5, elevation: 2, borderWidth: 1, borderColor: '#eee', minWidth: 200 },
    doctorCardSelected: { backgroundColor: '#002677', borderColor: '#002677' },
    doctorInfo: { marginLeft: 10, flex: 1 },
    doctorName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    doctorDept: { fontSize: 13, color: '#666' },
    textWhite: { color: '#fff' },
    formContainer: { paddingHorizontal: 20, marginTop: 10 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, fontSize: 16, color: '#333' },
    inputDisabled: { backgroundColor: '#F0F0F0', color: '#999' },
    dateTimeContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    dateBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#002677', padding: 12, borderRadius: 8 },
    dateBtnText: { color: '#002677', fontSize: 16, fontWeight: 'bold' },
    bookBtn: { backgroundColor: '#27ae60', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    bookBtnDisabled: { backgroundColor: '#95a5a6' },
    bookBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 30, marginHorizontal: 20 },
    emptyText: { textAlign: 'center', color: '#999', marginTop: 10 },
    apptCard: { padding: 15, borderRadius: 10, marginHorizontal: 20, marginBottom: 15, borderWidth: 1 },
    apptComing: { backgroundColor: '#e8f5e9', borderColor: '#c8e6c9' },
    apptOverdue: { backgroundColor: '#ffebee', borderColor: '#ffcdd2' },
    apptHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    apptDate: { fontWeight: 'bold', color: '#333' },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    badgeComing: { backgroundColor: '#4caf50' },
    badgeOverdue: { backgroundColor: '#f44336' },
    badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    apptDoctor: { fontSize: 14, color: '#555', marginBottom: 4 },
    apptLocation: { fontSize: 14, color: '#555' }
});
