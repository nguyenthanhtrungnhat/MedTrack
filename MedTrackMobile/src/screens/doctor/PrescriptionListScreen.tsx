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


export default function PrescriptionListScreen() {
    const { userID } = useContext(AuthContext);
    const navigation = useNavigation<any>();
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (!userID) return;
            try {
                const res = await axiosClient.get('/prescriptions');
                setPrescriptions(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Error fetching prescriptions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrescriptions();
    }, [userID]);

    const renderPrescription = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.reqIdText}>Prescription ID: #{item.prescriptionID}</Text>
                <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.cardBody}>
                <View style={styles.infoRow}><Ionicons name="person-outline" size={16} color="#4a5568" /><Text style={styles.infoText}>Patient: <Text style={styles.boldText}>{item.patientName}</Text></Text></View>
                <View style={styles.infoRow}><Ionicons name="medkit-outline" size={16} color="#4a5568" /><Text style={styles.infoText}>Doctor: {item.doctorName}</Text></View>
                <View style={styles.infoRow}><Ionicons name="warning-outline" size={16} color="#4a5568" /><Text style={styles.infoText}>Diagnosis: {item.diagnosis || 'None'}</Text></View>
            </View>
        </View>
    );

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <HamburgerMenu menuItems={DOCTOR_MENU_ITEMS} activeKey="PrescriptionList" onSelect={(key) => navigation.navigate(key)} />
                <Text style={styles.headerTitle}>Prescription List</Text>
                <View style={{ width: 30 }} />
            </View>
            {loading ? (
                <View style={styles.centerContainer}><ActivityIndicator size="large" color="#002677" /></View>
            ) : (
                <FlatList data={prescriptions} keyExtractor={(item) => item.prescriptionID.toString()} renderItem={renderPrescription} contentContainerStyle={styles.listContainer} ListEmptyComponent={<Text style={styles.emptyText}>No prescriptions found.</Text>} />
            )}
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    listContainer: { padding: 20 },
    card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, elevation: 2, borderLeftWidth: 4, borderLeftColor: '#3182ce' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    reqIdText: { fontSize: 14, fontWeight: 'bold', color: '#2d3748' },
    dateText: { fontSize: 13, color: '#718096' },
    cardBody: { marginBottom: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    infoText: { fontSize: 14, color: '#4a5568', marginLeft: 8 },
    boldText: { fontWeight: 'bold', color: '#2d3748' },
    emptyText: { textAlign: 'center', color: '#a0aec0', marginTop: 30, fontSize: 16 }
});
