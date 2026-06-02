import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function PatientProfileScreen() {
    const { logout } = useContext(AuthContext);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={50} color="#fff" />
                </View>
                <Text style={styles.name}>Tài khoản Bệnh nhân</Text>
                <Text style={styles.email}>Đang kết nối an toàn</Text>

                <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    avatarPlaceholder: { width: 100, height: 100, backgroundColor: '#A0AEC0', borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    name: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    email: { fontSize: 14, color: '#666', marginBottom: 40 },
    logoutBtn: { flexDirection: 'row', backgroundColor: '#E53E3E', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, alignItems: 'center' },
    logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});