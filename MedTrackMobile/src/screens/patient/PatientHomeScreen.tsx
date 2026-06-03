import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import ScreenWrapper from '../../components/ScreenWrapper';


export default function PatientHomeScreen() {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const { userID } = useContext(AuthContext);

    const [patient, setPatient] = useState<any>(null);
    const [apptCount, setApptCount] = useState(0);
    
    // Medical Records state
    const [recordsList, setRecordsList] = useState<any[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [loading, setLoading] = useState(true);

    const isProfileIncomplete = !patient?.fullName || !patient?.gender || !patient?.dob;

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!userID) return;
            try {
                // 1. Get Patient info
                const patientRes = await axiosClient.get(`/patients/patientByUserID/${userID}`);
                let currentPatientId = null;
                if (patientRes.data && patientRes.data.length > 0) {
                    setPatient(patientRes.data[0]);
                    currentPatientId = patientRes.data[0].patientID;
                }

                // 2. Check overdue and get appointments
                await axiosClient.put('/appointments/check-overdue', {});
                const apptRes = await axiosClient.get(`/appointments/${userID}`);
                setApptCount(apptRes.data ? apptRes.data.length : 0);

                // 3. Get all medical records
                if (currentPatientId) {
                    const recordsRes = await axiosClient.get(`/medical-records/${currentPatientId}`);
                    if (recordsRes.data && recordsRes.data.length > 0) {
                        const sortedRecords = [...recordsRes.data].sort((a, b) => 
                            new Date(b.timeCreate || b.createdAt || 0).getTime() - new Date(a.timeCreate || a.createdAt || 0).getTime()
                        );
                        setRecordsList(sortedRecords);
                        setSelectedRecord(sortedRecords[0]);
                    }
                }

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
            navigation.navigate('Profile');
        } else {
            navigation.navigate('MakeAppointment');
        }
    };

    const getHealthBadge = (type: string, value?: number | string | null) => {
        if (value === null || value === undefined || value === '') return { color: "#718096", label: "N/A" }; 

        switch (type) {
            case "pulse":
                if (Number(value) > 100) return { color: "#e53e3e", label: "High" };
                if (Number(value) < 60) return { color: "#d69e2e", label: "Low" };
                return { color: "#38a169", label: "Good" };

            case "temperature":
                if (Number(value) > 38) return { color: "#e53e3e", label: "Fever" };
                if (Number(value) < 36) return { color: "#d69e2e", label: "Low" };
                return { color: "#38a169", label: "Normal" };

            case "respiratory":
                if (Number(value) > 25) return { color: "#e53e3e", label: "Fast" };
                if (Number(value) < 12) return { color: "#d69e2e", label: "Slow" };
                return { color: "#38a169", label: "Good" };

            case "bloodPressure":
                if (typeof value === "string" && value.includes("/")) {
                    const [systolicStr, diastolicStr] = value.split("/");
                    const systolic = Number(systolicStr);
                    const diastolic = Number(diastolicStr);
                    if (isNaN(systolic) || isNaN(diastolic)) return { color: "#718096", label: "Invalid" };
                    if (systolic > 140 || diastolic > 90) return { color: "#e53e3e", label: "High" };
                    if (systolic < 90 || diastolic < 60) return { color: "#d69e2e", label: "Low" };
                    return { color: "#38a169", label: "Normal" };
                }
                return { color: "#718096", label: "N/A" };

            case "spO2":
                if (Number(value) < 90) return { color: "#e53e3e", label: "Low" };
                if (Number(value) < 95) return { color: "#d69e2e", label: "Slightly Low" };
                return { color: "#38a169", label: "Good" };

            case "heartRate":
                if (Number(value) > 100) return { color: "#e53e3e", label: "High" };
                if (Number(value) < 60) return { color: "#d69e2e", label: "Low" };
                return { color: "#38a169", label: "Normal" };

            case "oxygenTherapy":
                if (String(value).toLowerCase().includes("mask")) return { color: "#d69e2e", label: "On Mask" };
                if (String(value).toLowerCase().includes("oxygen")) return { color: "#e53e3e", label: "Required" };
                return { color: "#38a169", label: "Room Air" };

            case "sensorium":
                if (String(value).toLowerCase() === "alert" || String(value).toLowerCase() === "tỉnh táo" || Number(value) === 15) return { color: "#38a169", label: "Alert" };
                if (String(value).toLowerCase() === "drowsy" || String(value).toLowerCase() === "lơ mơ") return { color: "#d69e2e", label: "Drowsy" };
                return { color: "#e53e3e", label: "Abnormal" };

            case "painScale":
                if (Number(value) <= 3) return { color: "#38a169", label: "Mild" };
                if (Number(value) <= 6) return { color: "#d69e2e", label: "Moderate" };
                return { color: "#e53e3e", label: "Severe" };

            default:
                return { color: "transparent", label: "" };
        }
    };

    const renderVitalCard = (label: string, iconSource: any, unit: string, type: string, value?: number | string | null) => {
        const { color, label: statusLabel } = getHealthBadge(type, value);
        const displayValue = value != null && value !== '' ? value : 'N/A';

        return (
            <View style={styles.vitalCard}>
                <View style={styles.vitalCardHeader}>
                    <Text style={styles.vitalCardTitle}>{label}</Text>
                    {statusLabel ? (
                        <View style={[styles.badge, { backgroundColor: color }]}>
                            <Text style={styles.badgeText}>{statusLabel}</Text>
                        </View>
                    ) : null}
                </View>
                <View style={styles.vitalCardBody}>
                    <Image source={iconSource} style={styles.vitalIcon} resizeMode="contain" />
                    <View style={styles.vitalValueWrapper}>
                        <Text style={styles.vitalValueText}>{displayValue}</Text>
                        {unit ? <Text style={styles.vitalUnitText}>{unit}</Text> : null}
                    </View>
                </View>
            </View>
        );
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
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

                {/* Medical Vital Signs */}
                {selectedRecord && (
                    <View style={styles.vitalsSection}>
                        <View style={styles.vitalsSectionHeader}>
                            <Text style={styles.sectionTitle}>Chỉ số sinh tồn</Text>
                            <TouchableOpacity 
                                style={styles.datePickerBtn}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.datePickerText}>Ngày: {formatDate(selectedRecord.timeCreate || selectedRecord.createdAt)}</Text>
                                <Ionicons name="chevron-down" size={16} color="#fff" style={{marginLeft: 4}}/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.vitalsGrid}>
                            {renderVitalCard("Pulse", require('../../../assets/images/pulse.webp'), "L/ph", "pulse", selectedRecord.pulse)}
                            {renderVitalCard("Temperature", require('../../../assets/images/thermometer.webp'), "°C", "temperature", selectedRecord.temperature)}
                            {renderVitalCard("Respiratory", require('../../../assets/images/respiratory-system.webp'), "times/min", "respiratory", selectedRecord.respiratoryRate)}
                            {renderVitalCard("Blood Pressure", require('../../../assets/images/blood-pressure.webp'), "mmHg", "bloodPressure", selectedRecord.bloodPressure)}
                            {renderVitalCard("Height", require('../../../assets/images/scale.webp'), "cm", "other", selectedRecord.height)}
                            {renderVitalCard("Weight", require('../../../assets/images/height.webp'), "kg", "other", selectedRecord.weight)}
                            {renderVitalCard("Sensorium", require('../../../assets/images/sensory.webp'), "", "sensorium", selectedRecord.sensorium)}
                            {renderVitalCard("Pain Scale", require('../../../assets/images/gauge.webp'), "/10", "painScale", selectedRecord.hurtScale)}
                            {renderVitalCard("Urine", require('../../../assets/images/dark-urine.webp'), "ml", "other", selectedRecord.urine)}
                            {renderVitalCard("SpO2", require('../../../assets/images/oxygen-saturation.webp'), "%", "spO2", selectedRecord.SP02)}
                            {renderVitalCard("Heart Rate", require('../../../assets/images/heart-rate.webp'), "bpm", "heartRate", selectedRecord.heartRate)}
                            {renderVitalCard("Oxygen", require('../../../assets/images/oxygen.webp'), "", "oxygenTherapy", selectedRecord.oxygenTherapy)}
                        </View>
                    </View>
                )}

            </ScrollView>

            {/* Date Picker Modal */}
            <Modal visible={showDatePicker} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chọn ngày xem chỉ số</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={recordsList}
                            keyExtractor={(item) => item.medicalRecordID?.toString() || Math.random().toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={[
                                        styles.dateOption, 
                                        selectedRecord?.medicalRecordID === item.medicalRecordID && styles.dateOptionSelected
                                    ]}
                                    onPress={() => {
                                        setSelectedRecord(item);
                                        setShowDatePicker(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.dateOptionText,
                                        selectedRecord?.medicalRecordID === item.medicalRecordID && styles.dateOptionTextSelected
                                    ]}>
                                        {formatDate(item.timeCreate || item.createdAt)}
                                    </Text>
                                    {selectedRecord?.medicalRecordID === item.medicalRecordID && (
                                        <Ionicons name="checkmark-circle" size={20} color="#002677" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </ScreenWrapper>
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

    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, marginTop: 10 },
    actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    actionCard: { width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    iconCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    actionText: { fontSize: 15, fontWeight: '600', color: '#333', textAlign: 'center' },

    medicineCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, marginBottom: 20 },
    medicineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    medicineTitle: { fontSize: 16, fontWeight: 'bold', color: '#002677' },
    medicineSub: { fontSize: 14, color: '#666' },

    vitalsSection: { marginTop: 10 },
    vitalsSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    datePickerBtn: { flexDirection: 'row', backgroundColor: '#3182ce', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignItems: 'center' },
    datePickerText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },

    vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    vitalCard: { width: '48%', backgroundColor: '#fff', padding: 15, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, marginBottom: 15 },
    vitalCardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 15, minHeight: 40 },
    vitalCardTitle: { fontSize: 14, color: '#002677', flex: 1, marginRight: 5, fontWeight: '600' },
    badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, alignSelf: 'flex-start' },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    vitalCardBody: { flexDirection: 'row', alignItems: 'center' },
    vitalIcon: { width: 36, height: 36, marginRight: 10 },
    vitalValueWrapper: { flexDirection: 'row', alignItems: 'baseline', flex: 1, flexWrap: 'wrap' },
    vitalValueText: { fontSize: 18, fontWeight: 'bold', color: '#002677', marginRight: 4 },
    vitalUnitText: { fontSize: 12, color: '#666' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    dateOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    dateOptionSelected: { backgroundColor: '#f5f7fa' },
    dateOptionText: { fontSize: 16, color: '#333' },
    dateOptionTextSelected: { color: '#002677', fontWeight: 'bold' }
});