import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axiosClient from '../../api/axiosClient';
import ScreenWrapper from '../../components/ScreenWrapper';


export default function RoomListScreen() {
    const navigation = useNavigation<any>();
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await axiosClient.get('/rooms');
                setRooms(res.data || []);
            } catch (err) {
                console.error("Error fetching rooms:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    const renderRoom = ({ item }: { item: any }) => (
        <TouchableOpacity 
            style={styles.roomCard}
            onPress={() => navigation.navigate('BedList', { roomID: item.roomID, department: item.department })}
        >
            <View style={styles.cardContent}>
                <Text style={styles.roomTitle}>Room {item.roomID}</Text>
                <Text style={styles.roomDesc}>
                    With supporting text below as a natural lead-in to additional content.
                </Text>
                <Text style={styles.departmentText}>{item.department} Department</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#002677" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Room list</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#002677" />
                </View>
            ) : (
                <FlatList
                    data={rooms}
                    keyExtractor={(item) => item.roomID.toString()}
                    renderItem={renderRoom}
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
    listContainer: { padding: 16, paddingBottom: 30 },
    row: {
        justifyContent: 'space-between',
    },
    roomCard: {
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
    roomTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    roomDesc: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
        marginBottom: 12,
    },
    departmentText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#002677',
        textAlign: 'center',
    },
});
