import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import ScreenWrapper from '../../components/ScreenWrapper';


export default function DoctorProfileScreen() {
    const { userID, logout } = useContext(AuthContext);
    const navigation = useNavigation();

    const [doctorInfo, setDoctorInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctorData = async () => {
            if (!userID) return;
            try {
                // 1. Get Doctor ID from user ID
                const docRes = await axiosClient.get(`/doctors/by-user/${userID}`);
                const doctorID = docRes.data.doctorID;

                // 2. Get detailed Doctor Info
                if (doctorID) {
                    const detailRes = await axiosClient.get(`/doctors/${doctorID}`);
                    setDoctorInfo(detailRes.data);
                }
            } catch (error) {
                console.error("Error fetching doctor profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorData();
    }, [userID]);

    if (loading) {
        return (
            <ScreenWrapper style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#002677" />
            </ScreenWrapper>
        );
    }

    const renderField = (icon: any, label: string, value: string) => (
        <View style={styles.fieldContainer}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={20} color="#002677" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value || 'Not updated'}</Text>
            </View>
        </View>
    );

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Doctor Profile</Text>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Ionicons name="log-out-outline" size={24} color="#E53E3E" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="person" size={50} color="#fff" />
                    </View>
                    <Text style={styles.name}>{doctorInfo?.fullName || 'Doctor'}</Text>
                    <Text style={styles.department}>{doctorInfo?.department || 'Department Unknown'}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Doc ID: {doctorInfo?.doctorID || 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Personal Information</Text>
                    {renderField("mail", "Email", doctorInfo?.email)}
                    {renderField("call", "Phone", doctorInfo?.phone)}
                    {renderField("male-female", "Gender", doctorInfo?.gender == "1" ? "Male" : doctorInfo?.gender == "2" ? "Female" : "")}
                    {renderField("calendar", "Date of Birth", doctorInfo?.dob?.split("T")[0])}
                    {renderField("card", "ID Card", doctorInfo?.CIC)}
                    {renderField("location", "Address", doctorInfo?.address)}
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Work Information</Text>
                    {renderField("business", "Office", doctorInfo?.office)}
                </View>

                <Text style={styles.noteText}>* To change personal information, please contact HR.</Text>

            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#002677' },
    logoutBtn: { padding: 5 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    
    avatarSection: { alignItems: 'center', marginBottom: 25 },
    avatarPlaceholder: { width: 100, height: 100, backgroundColor: '#A0AEC0', borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 15, elevation: 3 },
    name: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    department: { fontSize: 16, color: '#666', marginBottom: 10 },
    badge: { backgroundColor: '#e2e8f0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15 },
    badgeText: { fontSize: 12, color: '#4a5568', fontWeight: 'bold' },

    infoCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 10 },
    
    fieldContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ebf8ff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    textContainer: { flex: 1 },
    label: { fontSize: 12, color: '#718096', marginBottom: 2 },
    value: { fontSize: 15, color: '#2d3748', fontWeight: '500' },

    noteText: { textAlign: 'center', color: '#a0aec0', fontSize: 13, marginTop: 10, fontStyle: 'italic' }
});
