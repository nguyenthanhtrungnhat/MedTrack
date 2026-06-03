import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HamburgerMenu from '../../components/HamburgerMenu';
import { DOCTOR_MENU_ITEMS } from '../../components/DoctorLayout';
import ScreenWrapper from '../../components/ScreenWrapper';


export default function DoctorShiftRequestsScreen() {
    const { userID } = useContext(AuthContext);
    const navigation = useNavigation<any>();

    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('/schedule-requests');
            setRequests(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error fetching shift requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userID) {
            fetchRequests();
        }
    }, [userID]);

    const handleStatusChange = (requestID: number, status: number) => {
        const actionName = status === 1 ? 'Approve' : 'Reject';
        Alert.alert(
            `Confirm ${actionName}`,
            `Are you sure you want to ${actionName.toLowerCase()} this request?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Confirm', 
                    onPress: async () => {
                        try {
                            await axiosClient.patch(`/schedule-request/${requestID}/status`, { status });
                            Alert.alert('Success', `Request ${actionName.toLowerCase()}d.`);
                            fetchRequests(); // Reload
                        } catch (error) {
                            Alert.alert('Error', 'Unable to process request. Please try again later.');
                            console.error(error);
                        }
                    }
                }
            ]
        );
    };

    const renderRequest = ({ item }: { item: any }) => {
        const statusText = item.status === 0 ? "Pending" : item.status === 1 ? "Approved" : "Rejected";
        const statusColor = item.status === 0 ? "#d69e2e" : item.status === 1 ? "#38a169" : "#e53e3e";
        const bgColor = item.status === 0 ? "#fffff0" : item.status === 1 ? "#f0fff4" : "#fff5f5";

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.reqIdText}>Req ID: #{item.requestID}</Text>
                    <View style={[styles.badge, { backgroundColor: bgColor }]}>
                        <Text style={[styles.badgeText, { color: statusColor }]}>{statusText}</Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={16} color="#4a5568" />
                        <Text style={styles.infoText}>Schedule ID: {item.scheduleID}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="swap-horizontal-outline" size={16} color="#4a5568" />
                        <Text style={styles.infoText}>Proposed Date: <Text style={styles.boldText}>{item.newDate ? new Date(item.newDate).toLocaleDateString() : 'Unknown'}</Text></Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="document-text-outline" size={16} color="#4a5568" />
                        <Text style={styles.infoText}>Reason: {item.reason || 'No reason provided'}</Text>
                    </View>
                </View>

                {item.status === 0 && (
                    <View style={styles.actionRow}>
                        <TouchableOpacity 
                            style={[styles.actionBtn, styles.rejectBtn]} 
                            onPress={() => handleStatusChange(item.requestID, 2)}
                        >
                            <Ionicons name="close-circle" size={18} color="#fff" style={{marginRight: 5}}/>
                            <Text style={styles.btnText}>Reject</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.actionBtn, styles.approveBtn]} 
                            onPress={() => handleStatusChange(item.requestID, 1)}
                        >
                            <Ionicons name="checkmark-circle" size={18} color="#fff" style={{marginRight: 5}}/>
                            <Text style={styles.btnText}>Approve</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <HamburgerMenu
                    menuItems={DOCTOR_MENU_ITEMS}
                    activeKey="DrawerShiftRequests"
                    onSelect={(key) => navigation.navigate(key)}
                />
                <Text style={styles.headerTitle}>Shift Requests from Nurses</Text>
                <View style={{ width: 30 }} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#002677" />
                </View>
            ) : (
                <FlatList
                    data={requests}
                    keyExtractor={(item) => item.requestID.toString()}
                    renderItem={renderRequest}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No shift requests available.</Text>
                    }
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
    backBtn: { padding: 5 },
    
    listContainer: { padding: 20 },
    card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    reqIdText: { fontSize: 14, fontWeight: 'bold', color: '#718096' },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
    badgeText: { fontSize: 12, fontWeight: 'bold' },
    
    cardBody: { marginBottom: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    infoText: { fontSize: 14, color: '#4a5568', marginLeft: 8, flex: 1 },
    boldText: { fontWeight: 'bold', color: '#2d3748' },
    
    actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#edf2f7' },
    actionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, marginLeft: 10 },
    approveBtn: { backgroundColor: '#38a169' },
    rejectBtn: { backgroundColor: '#e53e3e' },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

    emptyText: { textAlign: 'center', color: '#a0aec0', marginTop: 30, fontSize: 16 }
});
