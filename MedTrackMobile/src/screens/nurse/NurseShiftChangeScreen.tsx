import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function NurseShiftChangeScreen() {
    const { userID } = useContext(AuthContext);
    const navigation = useNavigation<any>();

    const [nurseID, setNurseID] = useState<number | null>(null);
    const [schedules, setSchedules] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [selectedScheduleID, setSelectedScheduleID] = useState<string>('');
    const [expectedDate, setExpectedDate] = useState<string>('');
    const [dateObj, setDateObj] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [reason, setReason] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!userID) return;
            setLoading(true);
            try {
                // Get Nurse ID
                const nurseRes = await axiosClient.get(`/nurses/by-user/${userID}`);
                const nID = nurseRes.data?.nurseID;
                setNurseID(nID);

                if (nID) {
                    await fetchSchedules(nID);
                    await fetchRequests(nID);
                }
            } catch (error) {
                console.error("Error loading shift data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userID]);

    const fetchSchedules = async (nID: number) => {
        try {
            const res = await axiosClient.get(`/schedules/nurse/${nID}`);
            if (Array.isArray(res.data)) setSchedules(res.data);
        } catch (e) {
            console.log("Failed to load schedules", e);
        }
    };

    const fetchRequests = async (nID: number) => {
        try {
            const res = await axiosClient.get(`/schedule-requests/status/${nID}`);
            if (Array.isArray(res.data)) setRequests(res.data);
        } catch (e) {
            console.log("Failed to load requests", e);
        }
    };

    const onPickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDateObj(selectedDate);
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            setExpectedDate(`${year}-${month}-${day}`);
        }
    };

    const handleSubmitRequest = async () => {
        if (!selectedScheduleID || !expectedDate || !reason) {
            Alert.alert("Missing Information", "Please fill in all fields.");
            return;
        }

        setSubmitting(true);
        try {
            await axiosClient.post("/schedule-requests", {
                scheduleID: Number(selectedScheduleID),
                newDate: expectedDate,
                reason: reason
            });
            Alert.alert("Success", "Shift change request submitted successfully!");
            // Reset form
            setSelectedScheduleID('');
            setExpectedDate('');
            setReason('');
            
            // Refresh requests
            if (nurseID) await fetchRequests(nurseID);

        } catch (error: any) {
            console.error("Submit shift error:", error);
            Alert.alert("Error", error.response?.data?.message || "Failed to submit request.");
        } finally {
            setSubmitting(false);
        }
    };

    const renderStatusBadge = (status: number) => {
        switch (status) {
            case 0: return <View style={[styles.badge, styles.badgePending]}><Text style={styles.badgeTextPending}>Pending</Text></View>;
            case 1: return <View style={[styles.badge, styles.badgeApproved]}><Text style={styles.badgeTextApproved}>Approved</Text></View>;
            case 2: return <View style={[styles.badge, styles.badgeRejected]}><Text style={styles.badgeTextRejected}>Rejected</Text></View>;
            default: return null;
        }
    };

    if (loading) {
        return (
            <ScreenWrapper style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#002677" />
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#002677" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Shift Change Requests</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    {/* Submit Request Form */}
                    <Text style={styles.sectionTitle}>Submit New Request</Text>
                    <View style={styles.formCard}>
                        <Text style={styles.label}>Select Schedule ID</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 1"
                            value={selectedScheduleID}
                            onChangeText={setSelectedScheduleID}
                            keyboardType="numeric"
                        />
                        <Text style={styles.helperText}>Check 'My Schedule' for your Schedule IDs.</Text>

                        <Text style={styles.label}>Expected New Date</Text>
                        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowPicker(true)}>
                            <Ionicons name="calendar-outline" size={20} color="#4a5568" style={{marginRight: 8}}/>
                            <Text style={styles.dateBtnText}>{expectedDate || 'Select Date'}</Text>
                        </TouchableOpacity>

                        {showPicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={dateObj}
                                mode="date"
                                is24Hour={true}
                                display="default"
                                onChange={onPickerChange}
                                minimumDate={new Date()}
                            />
                        )}

                        <Text style={styles.label}>Reason</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Reason for change..."
                            value={reason}
                            onChangeText={setReason}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />

                        <TouchableOpacity 
                            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} 
                            onPress={handleSubmitRequest}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.submitBtnText}>Submit Request</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Request History */}
                    <Text style={styles.sectionTitle}>Your Request History</Text>
                    {requests.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <Text style={styles.emptyText}>No requests found.</Text>
                        </View>
                    ) : (
                        requests.map((r, index) => (
                            <View key={r.requestID || index} style={styles.historyCard}>
                                <View style={styles.historyHeader}>
                                    <Text style={styles.historyTitle}>Schedule ID: {r.scheduleID || 'Unknown'}</Text>
                                    {renderStatusBadge(r.status)}
                                </View>
                                <View style={styles.historyBody}>
                                    <Text style={styles.historyText}><Text style={styles.bold}>Old Date:</Text> {r.oldDate}</Text>
                                    <Text style={styles.historyText}><Text style={styles.bold}>New Date:</Text> {r.newDate}</Text>
                                    <Text style={styles.historyText}><Text style={styles.bold}>Reason:</Text> {r.reason}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    backBtn: { padding: 4, marginLeft: -4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    scrollContent: { padding: 15, paddingBottom: 30 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2d3748', marginBottom: 12, marginTop: 5 },
    formCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 25, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    label: { fontSize: 14, fontWeight: '600', color: '#4a5568', marginBottom: 6 },
    input: { backgroundColor: '#f7fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, marginBottom: 5 },
    dateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f7fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, marginBottom: 15 },
    dateBtnText: { color: '#4a5568', fontSize: 15 },
    textArea: { height: 80, marginBottom: 15 },
    helperText: { fontSize: 12, color: '#a0aec0', marginBottom: 15, fontStyle: 'italic' },
    submitBtn: { backgroundColor: '#3182ce', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 5 },
    submitBtnDisabled: { backgroundColor: '#90cdf4' },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    emptyCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed' },
    emptyText: { color: '#a0aec0' },
    historyCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#edf2f7', paddingBottom: 8 },
    historyTitle: { fontSize: 15, fontWeight: 'bold', color: '#2b6cb0' },
    historyBody: { gap: 6 },
    historyText: { fontSize: 14, color: '#4a5568' },
    bold: { fontWeight: '600' },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgePending: { backgroundColor: '#fefcbf' },
    badgeTextPending: { color: '#b7791f', fontSize: 12, fontWeight: 'bold' },
    badgeApproved: { backgroundColor: '#c6f6d5' },
    badgeTextApproved: { color: '#276749', fontSize: 12, fontWeight: 'bold' },
    badgeRejected: { backgroundColor: '#fed7d7' },
    badgeTextRejected: { color: '#c53030', fontSize: 12, fontWeight: 'bold' },
});
