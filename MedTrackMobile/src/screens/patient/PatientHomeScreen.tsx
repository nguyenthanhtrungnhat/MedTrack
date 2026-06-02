import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';

export default function PatientHomeScreen() {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const { userID } = useContext(AuthContext);

    const [patient, setPatient] = useState<any>(null);
    const [apptCount, setApptCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const isProfileIncomplete = !patient?.fullName || !patient?.gender || !patient?.dob;

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!userID) return;
            try {
                // 1. Get Patient info
                const patientRes = await axiosClient.get(`/patients/patientByUserID/${userID}`);
                if (patientRes.data && patientRes.data.length > 0) {
                    setPatient(patientRes.data[0]);
                }

                // 2. Check overdue and get appointments
                await axiosClient.put('/appointments/check-overdue', {});
                const apptRes = await axiosClient.get(`/appointments/${userID}`);
                setApptCount(apptRes.data ? apptRes.data.length : 0);
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

    const handleMakeAppointment = () => {
        if (isProfileIncomplete) {
            alert('Vui lòng cập nhật đầy đủ thông tin cá nhân trước khi đặt lịch khám.');
            navigation.navigate('Profile'); // Chuyển hướng sang tab Profile
        } else {
            navigation.navigate('MakeAppointment');
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#002677" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Xin chào,</Text>
                        <Text style={styles.patientName}>{patient?.fullName || 'Bệnh nhân'}</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationBtn} onPress={() => navigation.navigate('Profile')}>
                        <Ionicons name="person-circle-outline" size={28} color="#002677" />
                    </TouchableOpacity>
                </View>

                {isProfileIncomplete && (
                    <View style={styles.alertBanner}>
                        <Ionicons name="warning" size={24} color="#b7791f" />
                        <View style={styles.alertTextContainer}>
                            <Text style={styles.alertTitle}>Hồ sơ chưa hoàn thiện</Text>
                            <Text style={styles.alertDesc}>Vui lòng cập nhật thông tin cá nhân để sử dụng các dịch vụ.</Text>
                        </View>
                    </View>
                )}

                {/* Dashboard Widgets */}
                <View style={styles.widgetRow}>
                    <View style={[styles.widgetCard, { borderLeftColor: '#48bb78', borderLeftWidth: 4 }]}>
                        <Text style={styles.widgetTitle}>Lịch hẹn</Text>
                        <View style={styles.widgetValueContainer}>
                            <Text style={styles.widgetValue}>{apptCount}</Text>
                            <Ionicons name="calendar" size={24} color="#48bb78" />
                        </View>
                    </View>
                    <View style={[styles.widgetCard, { borderLeftColor: '#4299e1', borderLeftWidth: 4 }]}>
                        <Text style={styles.widgetTitle}>Yêu cầu</Text>
                        <View style={styles.widgetValueContainer}>
                            <Text style={styles.widgetValue}>0</Text>
                            <Ionicons name="document-text" size={24} color="#4299e1" />
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Dịch vụ của bạn</Text>
                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionCard} onPress={handleMakeAppointment}>
                        <View style={[styles.iconCircle, { backgroundColor: '#e6fffa' }]}>
                            <Ionicons name="calendar-outline" size={28} color="#319795" />
                        </View>
                        <Text style={styles.actionText}>Đặt lịch khám</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('MedicalHistory')}>
                        <View style={[styles.iconCircle, { backgroundColor: '#ebf8ff' }]}>
                            <Ionicons name="folder-open-outline" size={28} color="#3182ce" />
                        </View>
                        <Text style={styles.actionText}>Hồ sơ bệnh án</Text>
                    </TouchableOpacity>
                </View>

                {/* Medicine Schedule Mockup */}
                <View style={styles.medicineCard}>
                    <View style={styles.medicineHeader}>
                        <Text style={styles.medicineTitle}>Lịch uống thuốc</Text>
                        <Ionicons name="medkit-outline" size={20} color="#002677" />
                    </View>
                    <Text style={styles.medicineSub}>Bạn không có lịch uống thuốc nào hôm nay.</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' },
    scrollContent: { padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    greeting: { fontSize: 16, color: '#505F63' },
    patientName: { fontSize: 24, fontWeight: 'bold', color: '#002677' },
    notificationBtn: { padding: 5 },
    
    alertBanner: { flexDirection: 'row', backgroundColor: '#feebc8', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
    alertTextContainer: { marginLeft: 12, flex: 1 },
    alertTitle: { fontSize: 16, fontWeight: 'bold', color: '#975a16' },
    alertDesc: { fontSize: 13, color: '#975a16', marginTop: 4 },

    widgetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    widgetCard: { width: '48%', backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    widgetTitle: { fontSize: 14, color: '#666', marginBottom: 10 },
    widgetValueContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    widgetValue: { fontSize: 24, fontWeight: 'bold', color: '#333' },

    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    actionCard: { width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    iconCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    actionText: { fontSize: 15, fontWeight: '600', color: '#333', textAlign: 'center' },

    medicineCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    medicineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    medicineTitle: { fontSize: 16, fontWeight: 'bold', color: '#002677' },
    medicineSub: { fontSize: 14, color: '#666' }
});