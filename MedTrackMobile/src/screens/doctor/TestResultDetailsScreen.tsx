import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../../components/ScreenWrapper';


export default function TestResultDetailsScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axiosClient.get(`/testresult/${id}`);
                setData(res.data);
            } catch (error) {
                console.error("Error fetching test details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <ScreenWrapper style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#002677" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Test Result Details</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.centerContainer}><ActivityIndicator size="large" color="#002677" /></View>
            </ScreenWrapper>
        );
    }

    if (!data) {
        return (
            <ScreenWrapper style={styles.container}>
                 <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#002677" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Test Result Details</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.centerContainer}><Text style={styles.errorText}>Result not found</Text></View>
            </ScreenWrapper>
        );
    }

    const renderItem = ({ item }: { item: any }) => {
        const flagColor = item.abnormalFlag === 'High' ? '#e53e3e' : item.abnormalFlag === 'Low' ? '#d69e2e' : '#38a169';
        const flagBg = item.abnormalFlag === 'High' ? '#fff5f5' : item.abnormalFlag === 'Low' ? '#fffff0' : '#f0fff4';

        return (
            <View style={styles.measurementCard}>
                <Text style={styles.paramName}>{item.parameterName}</Text>
                <View style={styles.measurementRow}>
                    <View style={styles.measurementCol}>
                        <Text style={styles.measurementLabel}>Result</Text>
                        <Text style={styles.measurementValue}>{item.resultValue} {item.unit}</Text>
                    </View>
                    <View style={styles.measurementCol}>
                        <Text style={styles.measurementLabel}>Reference</Text>
                        <Text style={styles.measurementValue}>{item.referenceRange}</Text>
                    </View>
                    <View style={styles.measurementCol}>
                        <Text style={styles.measurementLabel}>Flag</Text>
                        <View style={[styles.flagBadge, { backgroundColor: flagBg }]}>
                            <Text style={[styles.flagText, { color: flagColor }]}>{item.abnormalFlag}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const statusColor = data.status === 'Completed' ? '#38a169' : data.status === 'Failed' ? '#e53e3e' : '#d69e2e';
    const statusBg = data.status === 'Completed' ? '#f0fff4' : data.status === 'Failed' ? '#fff5f5' : '#fffff0';

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#002677" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Test Result Details</Text>
                <View style={{ width: 24 }} />
            </View>
            
            <FlatList
                data={data.items || []}
                keyExtractor={(item) => item.itemID.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={
                    <View style={styles.infoCard}>
                        <View style={styles.infoHeader}>
                            <Text style={styles.infoTitle}>{data.title}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                                <Text style={[styles.statusText, { color: statusColor }]}>{data.status}</Text>
                            </View>
                        </View>
                        <View style={styles.infoGrid}>
                            <View style={styles.infoCell}>
                                <Text style={styles.infoLabel}>Patient</Text>
                                <Text style={styles.infoValue}>{data.username}</Text>
                            </View>
                            <View style={styles.infoCell}>
                                <Text style={styles.infoLabel}>Code</Text>
                                <Text style={styles.infoValue}>{data.testResultCode}</Text>
                            </View>
                            <View style={styles.infoCell}>
                                <Text style={styles.infoLabel}>Type</Text>
                                <Text style={styles.infoValue}>{data.typeName}</Text>
                            </View>
                            <View style={styles.infoCell}>
                                <Text style={styles.infoLabel}>Date</Text>
                                <Text style={styles.infoValue}>{new Date(data.datetime).toLocaleString()}</Text>
                            </View>
                        </View>
                        <Text style={styles.sectionTitle}>Measurements</Text>
                    </View>
                }
                ListEmptyComponent={<Text style={styles.emptyText}>No measurements found.</Text>}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    backBtn: { padding: 4 },
    listContainer: { padding: 15 },
    errorText: { color: '#e53e3e', fontSize: 16 },
    infoCard: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    infoTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d3748', flex: 1, marginRight: 10 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    infoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 5 },
    infoCell: { width: '50%', marginBottom: 15 },
    infoLabel: { fontSize: 12, color: '#718096', marginBottom: 4 },
    infoValue: { fontSize: 14, fontWeight: '600', color: '#2d3748' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#002677', marginTop: 10 },
    measurementCard: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
    paramName: { fontSize: 15, fontWeight: 'bold', color: '#2b6cb0', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#edf2f7', paddingBottom: 8 },
    measurementRow: { flexDirection: 'row', justifyContent: 'space-between' },
    measurementCol: { flex: 1, alignItems: 'center' },
    measurementLabel: { fontSize: 11, color: '#a0aec0', marginBottom: 4 },
    measurementValue: { fontSize: 14, fontWeight: '600', color: '#4a5568' },
    flagBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    flagText: { fontSize: 12, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', color: '#a0aec0', marginTop: 20, fontSize: 14 }
});
