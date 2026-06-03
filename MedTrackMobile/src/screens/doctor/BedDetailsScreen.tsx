import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axiosClient from '../../api/axiosClient';
import { LineChart } from 'react-native-chart-kit';
import ScreenWrapper from '../../components/ScreenWrapper';


const screenWidth = Dimensions.get('window').width;

const parseBloodPressure = (bpStr: string) => {
    if (!bpStr) return null;
    const parts = bpStr.split('/');
    if (parts.length === 2) {
        return {
            systolic: Number(parts[0]),
            diastolic: Number(parts[1])
        };
    }
    return null;
};

export default function BedDetailsScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { patientID } = route.params || {};

    const [patient, setPatient] = useState<any>(null);
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!patientID) return;
            try {
                const [patientRes, recordsRes] = await Promise.all([
                    axiosClient.get(`/patients/${patientID}`),
                    axiosClient.get(`/medical-records/${patientID}`)
                ]);
                setPatient(patientRes.data);
                setRecords(recordsRes.data || []);
            } catch (err) {
                console.error("Error fetching bed details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [patientID]);

    if (loading) {
        return (
            <ScreenWrapper style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#002677" />
            </ScreenWrapper>
        );
    }

    if (!patient) {
        return (
            <ScreenWrapper style={styles.centerContainer}>
                <Text>Patient not found.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
                    <Text style={{ color: '#002677' }}>Back</Text>
                </TouchableOpacity>
            </ScreenWrapper>
        );
    }

    const sortedRecords = [...records].sort(
        (a, b) => new Date(a.timeCreate).getTime() - new Date(b.timeCreate).getTime()
    );

    const labels = sortedRecords.map(r => {
        const d = new Date(r.timeCreate);
        return `${d.getDate()}/${d.getMonth()+1}`;
    });

    const heartRateData = sortedRecords.map(r => Number(r.heartRate) || 0);
    const tempData = sortedRecords.map(r => Number(r.temperature) || 0);
    
    const bpDataSystolic: number[] = [];
    const bpDataDiastolic: number[] = [];
    const bpLabels: string[] = [];

    sortedRecords.forEach(r => {
        const bp = parseBloodPressure(r.bloodPressure);
        if (bp) {
            bpDataSystolic.push(bp.systolic);
            bpDataDiastolic.push(bp.diastolic);
            const d = new Date(r.timeCreate);
            bpLabels.push(`${d.getDate()}/${d.getMonth()+1}`);
        }
    });

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#002677" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bed Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Patient Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Patient Information</Text>
                    <Text style={styles.infoText}><Text style={styles.bold}>Name:</Text> {patient.fullName || patient.username}</Text>
                    <Text style={styles.infoText}><Text style={styles.bold}>Patient ID:</Text> {patient.patientID}</Text>
                    <Text style={styles.infoText}><Text style={styles.bold}>DOB:</Text> {patient.dob ? patient.dob.split('T')[0] : 'N/A'}</Text>
                    <Text style={styles.infoText}><Text style={styles.bold}>Gender:</Text> {patient.gender === '1' ? 'Male' : 'Female'}</Text>
                    <Text style={styles.infoText}><Text style={styles.bold}>Phone:</Text> {patient.phone || 'N/A'}</Text>
                    <Text style={styles.infoText}><Text style={styles.bold}>HI:</Text> {patient.HI || 'N/A'}</Text>
                </View>

                {/* Diagnose */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Diagnose</Text>
                    <Text style={styles.infoText}><Text style={styles.bold}>Admission Diagnose:</Text> {patient.hospitalizationsDiagnosis || 'N/A'}</Text>
                    <Text style={styles.infoText}><Text style={styles.bold}>Summary:</Text> {patient.summaryCondition || 'N/A'}</Text>
                    <Text style={styles.infoText}><Text style={styles.bold}>Discharge Diagnose:</Text> {patient.dischargeDiagnosis || 'N/A'}</Text>
                </View>

                {/* Charts */}
                {sortedRecords.length > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Health Charts</Text>
                        
                        <Text style={styles.chartTitle}>Heart Rate (bpm)</Text>
                        <ScrollView horizontal>
                            <LineChart
                                data={{
                                    labels: labels.length > 0 ? labels : ['N/A'],
                                    datasets: [{ data: heartRateData.length > 0 ? heartRateData : [0] }]
                                }}
                                width={Math.max(screenWidth - 32, labels.length * 50)}
                                height={220}
                                yAxisSuffix=""
                                yAxisInterval={1}
                                chartConfig={{
                                    backgroundColor: '#fff',
                                    backgroundGradientFrom: '#fff',
                                    backgroundGradientTo: '#fff',
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    propsForDots: { r: "4", strokeWidth: "2", stroke: "#ff6384" }
                                }}
                                bezier
                                style={styles.chart}
                            />
                        </ScrollView>

                        <Text style={styles.chartTitle}>Temperature (°C)</Text>
                        <ScrollView horizontal>
                            <LineChart
                                data={{
                                    labels: labels.length > 0 ? labels : ['N/A'],
                                    datasets: [{ data: tempData.length > 0 ? tempData : [0] }]
                                }}
                                width={Math.max(screenWidth - 32, labels.length * 50)}
                                height={220}
                                yAxisSuffix="°C"
                                yAxisInterval={1}
                                chartConfig={{
                                    backgroundColor: '#fff',
                                    backgroundGradientFrom: '#fff',
                                    backgroundGradientTo: '#fff',
                                    decimalPlaces: 1,
                                    color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    propsForDots: { r: "4", strokeWidth: "2", stroke: "#36a2eb" }
                                }}
                                bezier
                                style={styles.chart}
                            />
                        </ScrollView>

                        {bpLabels.length > 0 && (
                            <>
                                <Text style={styles.chartTitle}>Blood Pressure (mmHg)</Text>
                                <ScrollView horizontal>
                                    <LineChart
                                        data={{
                                            labels: bpLabels,
                                            datasets: [
                                                { data: bpDataSystolic, color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})` },
                                                { data: bpDataDiastolic, color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})` }
                                            ],
                                            legend: ["Systolic", "Diastolic"]
                                        }}
                                        width={Math.max(screenWidth - 32, bpLabels.length * 50)}
                                        height={220}
                                        yAxisSuffix=""
                                        yAxisInterval={1}
                                        chartConfig={{
                                            backgroundColor: '#fff',
                                            backgroundGradientFrom: '#fff',
                                            backgroundGradientTo: '#fff',
                                            decimalPlaces: 0,
                                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        }}
                                        bezier
                                        style={styles.chart}
                                    />
                                </ScrollView>
                            </>
                        )}
                    </View>
                ) : (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Health Charts</Text>
                        <Text style={{ fontStyle: 'italic', color: 'gray' }}>No health data (medical records) for this patient.</Text>
                    </View>
                )}

            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f7fb' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backBtn: { padding: 4 },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
        color: '#002677',
    },
    scrollContent: { padding: 16, paddingBottom: 40 },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#002677',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 6,
    },
    bold: {
        fontWeight: '600',
    },
    chartTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginTop: 16,
        marginBottom: 8,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 12,
    }
});
