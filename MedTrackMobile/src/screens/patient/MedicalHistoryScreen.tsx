import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import ScreenWrapper from '../../components/ScreenWrapper';


export default function MedicalHistoryScreen() {
    const navigation = useNavigation();
    const { userID } = useContext(AuthContext);
    
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // 1. Get patientID from userID
                const patientRes = await axiosClient.get(`/patients/patientByUserID/${userID}`);
                if (patientRes.data && patientRes.data.length > 0) {
                    const patientID = patientRes.data[0].patientID;
                    
                    // 2. Get medical records
                    const recordsRes = await axiosClient.get(`/medical-records/${patientID}`);
                    if (recordsRes.data) {
                        // Sort by timeCreate descending
                        const sortedRecords = [...recordsRes.data].sort((a, b) => 
                            new Date(b.timeCreate || b.createdAt || 0).getTime() - new Date(a.timeCreate || a.createdAt || 0).getTime()
                        );
                        setRecords(sortedRecords);
                    } else {
                        setRecords([]);
                    }
                } else {
                    setError('Không tìm thấy thông tin bệnh nhân.');
                }
            } catch (err: any) {
                console.error("Error fetching medical records:", err);
                if (err.response?.status === 404) {
                     setRecords([]); // Không có dữ liệu
                } else {
                     setError('Không thể tải dữ liệu hồ sơ bệnh án.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (userID) {
            fetchRecords();
        } else {
            setLoading(false);
        }
    }, [userID]);

    const renderItem = ({ item }: { item: any }) => {
        // Format date: DD/MM/YYYY HH:mm
        const dateObj = new Date(item.timeCreate || item.createdAt || Date.now());
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

        return (
            <View style={styles.recordCard}>
                <View style={styles.recordHeader}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
                
                <Text style={styles.diagnosis}>
                    {item.currentCondition || item.healthStatus || 'Đang cập nhật tình trạng'}
                </Text>
                
                <View style={styles.vitalsContainer}>
                    {item.pulse != null && (
                        <View style={styles.vitalItem}>
                            <Ionicons name="heart-outline" size={16} color="#e74c3c" />
                            <Text style={styles.vitalText}>Mạch: {item.pulse} l/p</Text>
                        </View>
                    )}
                    {item.bloodPressure != null && item.bloodPressure !== '' && (
                        <View style={styles.vitalItem}>
                            <Ionicons name="water-outline" size={16} color="#3498db" />
                            <Text style={styles.vitalText}>HA: {item.bloodPressure} mmHg</Text>
                        </View>
                    )}
                    {item.temperature != null && (
                        <View style={styles.vitalItem}>
                            <Ionicons name="thermometer-outline" size={16} color="#f39c12" />
                            <Text style={styles.vitalText}>Nhiệt độ: {item.temperature}°C</Text>
                        </View>
                    )}
                    {item.SP02 != null && (
                        <View style={styles.vitalItem}>
                            <Ionicons name="speedometer-outline" size={16} color="#9b59b6" />
                            <Text style={styles.vitalText}>SpO2: {item.SP02}%</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#002677" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hồ sơ bệnh án</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#002677" />
                    <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
                </View>
            ) : error ? (
                <View style={styles.centerContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={() => { setLoading(true); setError(null); }}>
                        <Text style={styles.retryBtnText}>Thử lại</Text>
                    </TouchableOpacity>
                </View>
            ) : records.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Ionicons name="document-text-outline" size={48} color="#bdc3c7" />
                    <Text style={styles.emptyText}>Chưa có hồ sơ bệnh án nào.</Text>
                </View>
            ) : (
                <FlatList
                    data={records}
                    keyExtractor={(item) => (item.recordID || Math.random()).toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    backBtn: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    listContainer: { padding: 20 },
    recordCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
    recordHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    date: { fontSize: 14, color: '#666', marginLeft: 6 },
    diagnosis: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
    vitalsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 },
    vitalItem: { flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 8 },
    vitalText: { fontSize: 13, color: '#555', marginLeft: 5 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    loadingText: { marginTop: 10, color: '#666' },
    errorText: { marginTop: 10, color: '#e74c3c', textAlign: 'center', marginBottom: 15 },
    emptyText: { marginTop: 10, color: '#666', fontSize: 16 },
    retryBtn: { backgroundColor: '#002677', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    retryBtnText: { color: '#fff', fontWeight: 'bold' }
});