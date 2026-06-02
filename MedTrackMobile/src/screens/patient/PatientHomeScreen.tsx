import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function PatientHomeScreen() {
    const navigation = useNavigation<any>();
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Xin chào,</Text>
                        <Text style={styles.patientName}>Bệnh nhân</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationBtn}>
                        <Ionicons name="notifications-outline" size={24} color="#002677" />
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Dịch vụ</Text>
                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionCard}>
                        <Ionicons name="calendar-outline" size={32} color="#002677" />
                        <Text style={styles.actionText}>Đặt lịch khám</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('MedicalHistory')}
                    >
                        <Ionicons name="document-text-outline" size={32} color="#002677" />
                        <Text style={styles.actionText}>Hồ sơ bệnh án</Text>
                    </TouchableOpacity>
                </View>

                {/* Vital Signs Overview (Mockup) */}
                <Text style={styles.sectionTitle}>Chỉ số sinh tồn gần nhất</Text>
                <View style={styles.vitalCard}>
                    <View style={styles.vitalRow}>
                        <Text style={styles.vitalLabel}>Huyết áp</Text>
                        <Text style={styles.vitalValue}>120/80 mmHg</Text>
                    </View>
                    <View style={styles.vitalRow}>
                        <Text style={styles.vitalLabel}>Nhịp tim</Text>
                        <Text style={styles.vitalValue}>75 bpm</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    scrollContent: { padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    greeting: { fontSize: 16, color: '#505F63' },
    patientName: { fontSize: 24, fontWeight: 'bold', color: '#002677' },
    notificationBtn: { padding: 8, backgroundColor: '#fff', borderRadius: 50, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, marginTop: 10 },
    actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    actionCard: { width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    actionText: { marginTop: 10, fontSize: 14, fontWeight: '600', color: '#333' },
    vitalCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    vitalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    vitalLabel: { fontSize: 16, color: '#666' },
    vitalValue: { fontSize: 16, fontWeight: 'bold', color: '#002677' }
});