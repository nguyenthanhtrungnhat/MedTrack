import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axiosClient from '../../api/axiosClient';
import ScreenWrapper from '../../components/ScreenWrapper';


export default function BedListScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { roomID } = route.params || {};

    const [beds, setBeds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBeds = async () => {
            if (!roomID) return;
            try {
                const res = await axiosClient.get(`/rooms/${roomID}/patients`);
                setBeds(res.data || []);
            } catch (err) {
                console.error("Error fetching beds:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBeds();
    }, [roomID]);

    const renderBed = ({ item, index }: { item: any, index: number }) => (
        <TouchableOpacity 
            style={styles.bedCard}
            onPress={() => navigation.navigate('BedDetails', { patientID: item.patientID })}
        >
            <View style={styles.cardContent}>
                <Text style={styles.bedTitle}>Bed {index + 1}</Text>
                <Text style={styles.bedDesc}>
                    With supporting text below as a natural lead-in to additional content.
                </Text>
                <Text style={styles.patientInfo}>
                    Name: {item.fullName || item.username} - id: {item.patientID}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#002677" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bed list</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#002677" />
                </View>
            ) : beds.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>No patients in this room.</Text>
                </View>
            ) : (
                <FlatList
                    data={beds}
                    keyExtractor={(item, index) => item.patientID?.toString() || index.toString()}
                    renderItem={renderBed}
                    contentContainerStyle={styles.listContainer}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                />
            )}
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f7fb' },
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
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 15, color: 'gray' },
    listContainer: { padding: 16, paddingBottom: 30 },
    row: {
        justifyContent: 'space-between',
    },
    bedCard: {
        flex: 1,
        backgroundColor: '#e6faf5',
        borderRadius: 12,
        margin: 6,
        padding: 16,
        borderWidth: 1,
        borderColor: '#bce4d8',
        elevation: 2,
    },
    cardContent: {
        alignItems: 'center',
    },
    bedTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    bedDesc: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
        marginBottom: 12,
    },
    patientInfo: {
        fontSize: 13,
        fontWeight: '700',
        color: '#002677',
        textAlign: 'center',
    },
});
