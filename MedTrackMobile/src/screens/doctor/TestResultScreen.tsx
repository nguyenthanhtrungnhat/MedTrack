import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HamburgerMenu from '../../components/HamburgerMenu';
import { DOCTOR_MENU_ITEMS } from '../../components/DoctorLayout';
import { NURSE_MENU_ITEMS } from '../../components/NurseLayout';
import ScreenWrapper from '../../components/ScreenWrapper';


export default function TestResultScreen() {
    const { userID, roleID } = useContext(AuthContext);
    const navigation = useNavigation<any>();

    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!userID) return;
            try {
                const res = await axiosClient.get('/testresult');
                setResults(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Error fetching test results:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [userID]);

    const renderResult = ({ item }: { item: any }) => {
        const statusColor = item.status === 'Completed' ? '#38a169' : item.status === 'Failed' ? '#e53e3e' : '#d69e2e';
        const bgColor = item.status === 'Completed' ? '#f0fff4' : item.status === 'Failed' ? '#fff5f5' : '#fffff0';

        return (
            <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('TestResultDetails', { id: item.testResultID })}
                activeOpacity={0.7}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.codeText}>Code: {item.testResultCode}</Text>
                    <View style={[styles.badge, { backgroundColor: bgColor }]}>
                        <Text style={[styles.badgeText, { color: statusColor }]}>{item.status}</Text>
                    </View>
                </View>
                <View style={styles.cardBody}>
                    <Text style={styles.titleText}>{item.title}</Text>
                    <View style={styles.infoRow}>
                        <Ionicons name="flask-outline" size={16} color="#4a5568" />
                        <Text style={styles.infoText}>Type: {item.typeName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="person-outline" size={16} color="#4a5568" />
                        <Text style={styles.infoText}>Patient: <Text style={styles.boldText}>{item.username}</Text></Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={16} color="#4a5568" />
                        <Text style={styles.infoText}>Date: {new Date(item.datetime).toLocaleString()}</Text>
                    </View>
                </View>
                <View style={styles.cardFooter}>
                    <Text style={styles.footerText}>View Details</Text>
                    <Ionicons name="chevron-forward" size={16} color="#3182ce" />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <HamburgerMenu 
                    menuItems={roleID === 2 ? NURSE_MENU_ITEMS : DOCTOR_MENU_ITEMS} 
                    activeKey="TestResult" 
                    onSelect={(key) => navigation.navigate(key)} 
                />
                <Text style={styles.headerTitle}>Test Results</Text>
                <View style={{ width: 30 }} />
            </View>
            {loading ? (
                <View style={styles.centerContainer}><ActivityIndicator size="large" color="#002677" /></View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.testResultID.toString()}
                    renderItem={renderResult}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={<Text style={styles.emptyText}>No test results found.</Text>}
                />
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
    card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    codeText: { fontSize: 14, fontWeight: 'bold', color: '#718096' },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
    badgeText: { fontSize: 12, fontWeight: 'bold' },
    cardBody: { marginBottom: 10 },
    titleText: { fontSize: 16, fontWeight: 'bold', color: '#2d3748', marginBottom: 8 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    infoText: { fontSize: 14, color: '#4a5568', marginLeft: 8 },
    boldText: { fontWeight: 'bold', color: '#2d3748' },
    cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#edf2f7' },
    footerText: { fontSize: 13, color: '#3182ce', fontWeight: '500', marginRight: 4 },
    emptyText: { textAlign: 'center', color: '#a0aec0', marginTop: 30, fontSize: 16 }
});
