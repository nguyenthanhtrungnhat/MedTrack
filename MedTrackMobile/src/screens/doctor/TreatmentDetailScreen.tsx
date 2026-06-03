import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosClient from '../../api/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../../components/ScreenWrapper';


export default function TreatmentDetailScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axiosClient.get(`/treatmenttimeline/${id}`);
                setData(res.data);
            } catch (err) {
                console.error("Error fetching detail:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <ScreenWrapper style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#002677" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Treatment Details</Text>
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
                    <Text style={styles.headerTitle}>Treatment Details</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.centerContainer}><Text style={styles.errorText}>Record not found</Text></View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#002677" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Treatment Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.infoCard}>
                    <Text style={styles.patientCode}>{data.patientCode}</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Admission No:</Text>
                        <Text style={styles.infoValue}>{data.admissionNumber}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Diagnosis:</Text>
                        <Text style={styles.infoValue}>{data.diagnosis}</Text>
                    </View>
                    <Text style={styles.dateText}>{new Date(data.createdAt).toLocaleString()}</Text>
                </View>

                <Text style={styles.sectionTitle}>Treatment Timeline</Text>

                {data.logs && data.logs.map((log: any, index: number) => (
                    <View key={index} style={styles.logCard}>
                        <View style={styles.logHeader}>
                            <View style={styles.timeBadge}>
                                <Ionicons name="time-outline" size={14} color="#fff" />
                                <Text style={styles.timeText}>{log.logTime}</Text>
                            </View>
                            <Text style={styles.entryText}>Entry #{index + 1}</Text>
                        </View>
                        
                        <View style={styles.soapGrid}>
                            <View style={styles.soapCol}>
                                <Text style={styles.soapLabel}>S (Subjective):</Text>
                                <Text style={styles.soapValue}>{log.subjective || '-'}</Text>
                            </View>
                            <View style={styles.soapCol}>
                                <Text style={styles.soapLabel}>O (Objective):</Text>
                                <Text style={styles.soapValue}>{log.objective || '-'}</Text>
                            </View>
                            <View style={styles.soapCol}>
                                <Text style={styles.soapLabel}>A (Assessment):</Text>
                                <Text style={styles.soapValue}>{log.assessment || '-'}</Text>
                            </View>
                            <View style={styles.soapCol}>
                                <Text style={styles.soapLabel}>P (Plan):</Text>
                                <Text style={styles.soapValue}>{log.plan || '-'}</Text>
                            </View>
                            <View style={[styles.soapCol, { width: '100%' }]}>
                                <Text style={styles.soapLabel}>I (Instruction):</Text>
                                <Text style={styles.soapValue}>{log.instruction || '-'}</Text>
                            </View>
                        </View>
                    </View>
                ))}
                
                <View style={{ height: 30 }} />
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    backBtn: { padding: 4 },
    content: { padding: 15 },
    errorText: { color: '#e53e3e', fontSize: 16 },
    infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, elevation: 2 },
    patientCode: { fontSize: 22, fontWeight: 'bold', color: '#2b6cb0', marginBottom: 15 },
    infoRow: { flexDirection: 'row', marginBottom: 8 },
    infoLabel: { width: 100, fontSize: 14, color: '#718096', fontWeight: '500' },
    infoValue: { flex: 1, fontSize: 14, color: '#2d3748', fontWeight: '600' },
    dateText: { fontSize: 12, color: '#a0aec0', marginTop: 10, textAlign: 'right' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d3748', marginBottom: 15 },
    logCard: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#3182ce', elevation: 1 },
    logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    timeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2d3748', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    timeText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
    entryText: { fontSize: 12, color: '#a0aec0', fontWeight: '600' },
    soapGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    soapCol: { width: '48%', marginBottom: 12 },
    soapLabel: { fontSize: 12, fontWeight: 'bold', color: '#4a5568', marginBottom: 4 },
    soapValue: { fontSize: 13, color: '#2d3748', lineHeight: 18 },
});
