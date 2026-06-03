import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosClient from '../../api/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HamburgerMenu from '../../components/HamburgerMenu';
import { DOCTOR_MENU_ITEMS } from '../../components/DoctorLayout';
import ScreenWrapper from '../../components/ScreenWrapper';


export default function TreatmentDashboardScreen() {
    const navigation = useNavigation<any>();
    const [sheets, setSheets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSheets = async () => {
            try {
                const res = await axiosClient.get('/treatmenttimeline/all');
                setSheets(res.data || []);
            } catch (err) {
                console.error("Error fetching treatment timelines:", err);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = navigation.addListener('focus', () => {
            fetchSheets();
        });

        fetchSheets();
        return unsubscribe;
    }, [navigation]);

    if (loading) {
        return (
            <ScreenWrapper style={styles.container}>
                <View style={styles.header}>
                    <HamburgerMenu menuItems={DOCTOR_MENU_ITEMS} activeKey="TreatmentDashboard" onSelect={(key) => navigation.navigate(key)} />
                    <Text style={styles.headerTitle}>Treatment Dashboard</Text>
                    <View style={{ width: 30 }} />
                </View>
                <View style={styles.centerContainer}><ActivityIndicator size="large" color="#002677" /></View>
            </ScreenWrapper>
        );
    }

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity 
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('TreatmentDetail', { id: item.sheetID })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.patientCode}>{item.patientCode}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>#{item.sheetID}</Text>
                </View>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.infoText}><Text style={styles.boldText}>Admission No:</Text> {item.admissionNumber}</Text>
                <Text style={styles.infoText} numberOfLines={2}><Text style={styles.boldText}>Diagnosis:</Text> {item.diagnosis}</Text>
            </View>
            <View style={styles.cardFooter}>
                <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                <View style={styles.actionBtn}>
                    <Text style={styles.actionText}>View Details</Text>
                    <Ionicons name="arrow-forward" size={14} color="#3182ce" />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <HamburgerMenu menuItems={DOCTOR_MENU_ITEMS} activeKey="TreatmentDashboard" onSelect={(key) => navigation.navigate(key)} />
                <Text style={styles.headerTitle}>Treatment Dashboard</Text>
                <View style={{ width: 30 }} />
            </View>

            <FlatList
                data={sheets}
                keyExtractor={(item) => item.sheetID.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={
                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>Patient Treatment Records</Text>
                        <Text style={styles.infoDesc}>Monitor and manage all created medical records.</Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="folder-open-outline" size={50} color="#cbd5e0" />
                        <Text style={styles.emptyText}>No records found.</Text>
                        <Text style={styles.emptySubText}>Start by scanning a new record.</Text>
                    </View>
                }
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    listContainer: { padding: 15 },
    infoBox: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
    infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#2d3748', marginBottom: 4 },
    infoDesc: { fontSize: 13, color: '#718096' },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    patientCode: { fontSize: 18, fontWeight: 'bold', color: '#2b6cb0' },
    badge: { backgroundColor: '#edf2f7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { fontSize: 12, fontWeight: 'bold', color: '#4a5568' },
    cardBody: { marginBottom: 15 },
    infoText: { fontSize: 14, color: '#4a5568', marginBottom: 4 },
    boldText: { fontWeight: '600', color: '#2d3748' },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#edf2f7', paddingTop: 10 },
    dateText: { fontSize: 12, color: '#a0aec0' },
    actionBtn: { flexDirection: 'row', alignItems: 'center' },
    actionText: { fontSize: 13, color: '#3182ce', fontWeight: '500', marginRight: 4 },
    emptyContainer: { alignItems: 'center', marginTop: 50 },
    emptyText: { fontSize: 16, fontWeight: 'bold', color: '#4a5568', marginTop: 10 },
    emptySubText: { fontSize: 14, color: '#a0aec0', marginTop: 4 },
});
