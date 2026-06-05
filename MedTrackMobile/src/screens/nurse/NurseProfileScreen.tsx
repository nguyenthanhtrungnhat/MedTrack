import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function NurseProfileScreen() {
    const { userID, logout } = useContext(AuthContext);
    const navigation = useNavigation();

    const [nurseInfo, setNurseInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNurseData = async () => {
            if (!userID) return;
            try {
                // Get Nurse Info from user ID
                const nurseRes = await axiosClient.get(`/nurses/by-user/${userID}`);
                setNurseInfo(nurseRes.data);
            } catch (error) {
                console.error("Error fetching nurse profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNurseData();
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
                <Text style={styles.headerTitle}>Nurse Profile</Text>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Ionicons name="log-out-outline" size={24} color="#E53E3E" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="person" size={50} color="#fff" />
                    </View>
                    <Text style={styles.name}>{nurseInfo?.fullName || 'Nurse'}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Nurse ID: {nurseInfo?.nurseID || 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Personal Information</Text>
                    {renderField("mail", "Email", nurseInfo?.email)}
                    {renderField("call", "Phone", nurseInfo?.phone)}
                    {renderField("male-female", "Gender", nurseInfo?.gender == "1" ? "Male" : nurseInfo?.gender == "2" ? "Female" : "")}
                    {renderField("calendar", "Date of Birth", nurseInfo?.dob?.split("T")[0])}
                    {renderField("card", "ID Card", nurseInfo?.CIC)}
                    {renderField("location", "Address", nurseInfo?.address)}
                </View>

                <Text style={styles.noteText}>* To change personal information, please contact HR.</Text>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    logoutBtn: { padding: 4 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    avatarSection: { alignItems: 'center', marginBottom: 25 },
    avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#cbd5e0', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 3, borderColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    name: { fontSize: 22, fontWeight: 'bold', color: '#2d3748', marginBottom: 4 },
    badge: { backgroundColor: '#ebf8ff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    badgeText: { color: '#3182ce', fontWeight: 'bold', fontSize: 12 },
    infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 20, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#4a5568', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#edf2f7', paddingBottom: 8 },
    fieldContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    iconContainer: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ebf8ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    textContainer: { flex: 1 },
    label: { fontSize: 12, color: '#718096', marginBottom: 2 },
    value: { fontSize: 15, color: '#2d3748', fontWeight: '500' },
    noteText: { textAlign: 'center', color: '#a0aec0', fontSize: 12, marginTop: 10 },
});
