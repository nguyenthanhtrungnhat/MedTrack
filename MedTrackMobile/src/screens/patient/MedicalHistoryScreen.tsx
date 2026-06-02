import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Dữ liệu giả (Dummy Data) để test giao diện
const dummyRecords = [
    { id: '1', date: '2026-05-01', diagnosis: 'Viêm họng cấp', doctor: 'Dr. Nguyen' },
    { id: '2', date: '2026-04-15', diagnosis: 'Kiểm tra sức khỏe định kỳ', doctor: 'Dr. Tran' },
];

export default function MedicalHistoryScreen() {
    const navigation = useNavigation();

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.recordCard}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.diagnosis}>{item.diagnosis}</Text>
            <Text style={styles.doctor}>BS: {item.doctor}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#002677" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hồ sơ bệnh án</Text>
                <View style={{ width: 24 }} /> {/* Để cân bằng layout */}
            </View>

            <FlatList
                data={dummyRecords}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', elevation: 2 },
    backBtn: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    listContainer: { padding: 20 },
    recordCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
    date: { fontSize: 14, color: '#666', marginBottom: 5 },
    diagnosis: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    doctor: { fontSize: 14, color: '#002677' },
});