import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function PatientProfileScreen() {
    const { userID, logout } = useContext(AuthContext);
    const navigation = useNavigation();

    const [form, setForm] = useState({
        CIC: "",
        fullName: "",
        gender: "",
        dob: "",
        phone: "",
        address: "",
        HI: "",
        relativeName: "",
        relativeNumber: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchPatient = async () => {
            if (!userID) return;
            try {
                const res = await axiosClient.get(`/patients/patientByUserID/${userID}`);
                if (res.data && res.data.length > 0) {
                    const patient = res.data[0];
                    setForm({
                        CIC: patient.CIC || "",
                        fullName: patient.fullName || "",
                        gender: patient.gender ? String(patient.gender) : "",
                        dob: patient.dob ? patient.dob.split("T")[0] : "",
                        phone: patient.phone || "",
                        address: patient.address || "",
                        HI: patient.HI || "",
                        relativeName: patient.relativeName || "",
                        relativeNumber: patient.relativeNumber ? String(patient.relativeNumber) : "",
                    });
                }
            } catch (error) {
                console.error("Error fetching patient profile:", error);
                Alert.alert('Lỗi', 'Không thể tải thông tin hồ sơ.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [userID]);

    const handleSave = async () => {
        if (!form.fullName || !form.gender || !form.dob || !form.phone || !form.address) {
            Alert.alert('Thiếu thông tin', 'Vui lòng điền đủ các trường bắt buộc (Họ tên, Giới tính, Ngày sinh, SĐT, Địa chỉ).');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                ...form,
                userID,
            };
            const res = await axiosClient.put('/users/patient/complete', payload);
            if (res.status === 200 || res.status === 201) {
                Alert.alert('Thành công', 'Thông tin cá nhân đã được lưu.');
                navigation.goBack();
            } else {
                Alert.alert('Lỗi', 'Có lỗi xảy ra khi lưu thông tin.');
            }
        } catch (error: any) {
            console.error("Error saving profile:", error);
            if (error.response?.status === 400) {
                Alert.alert('Lỗi', error.response.data?.message || 'Thông tin không hợp lệ.');
            } else {
                Alert.alert('Lỗi', 'Lưu thông tin thất bại. Vui lòng thử lại.');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#002677" />
                <Text style={styles.loadingText}>Đang tải thông tin...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#002677" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Ionicons name="log-out-outline" size={24} color="#E53E3E" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Họ và Tên *</Text>
                        <TextInput
                            style={styles.input}
                            value={form.fullName}
                            onChangeText={(text) => setForm({ ...form, fullName: text })}
                            placeholder="Nhập họ và tên"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Số điện thoại *</Text>
                        <TextInput
                            style={styles.input}
                            value={form.phone}
                            onChangeText={(text) => setForm({ ...form, phone: text })}
                            placeholder="Nhập số điện thoại"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Giới tính *</Text>
                        <View style={styles.genderContainer}>
                            <TouchableOpacity
                                style={[styles.genderBtn, form.gender === '1' && styles.genderBtnActive]}
                                onPress={() => setForm({ ...form, gender: '1' })}
                            >
                                <Ionicons name="male" size={20} color={form.gender === '1' ? "#fff" : "#666"} />
                                <Text style={[styles.genderText, form.gender === '1' && styles.genderTextActive]}> Nam</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.genderBtn, form.gender === '2' && styles.genderBtnActive]}
                                onPress={() => setForm({ ...form, gender: '2' })}
                            >
                                <Ionicons name="female" size={20} color={form.gender === '2' ? "#fff" : "#666"} />
                                <Text style={[styles.genderText, form.gender === '2' && styles.genderTextActive]}> Nữ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Ngày sinh (YYYY-MM-DD) *</Text>
                        <TextInput
                            style={styles.input}
                            value={form.dob}
                            onChangeText={(text) => setForm({ ...form, dob: text })}
                            placeholder="Ví dụ: 1990-05-25"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Địa chỉ *</Text>
                        <TextInput
                            style={styles.input}
                            value={form.address}
                            onChangeText={(text) => setForm({ ...form, address: text })}
                            placeholder="Nhập địa chỉ"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Số CMND/CCCD</Text>
                        <TextInput
                            style={styles.input}
                            value={form.CIC}
                            onChangeText={(text) => setForm({ ...form, CIC: text })}
                            placeholder="Nhập CMND/CCCD"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Mã BHYT</Text>
                        <TextInput
                            style={styles.input}
                            value={form.HI}
                            onChangeText={(text) => setForm({ ...form, HI: text })}
                            placeholder="Nhập mã Bảo hiểm y tế"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Tên người thân (Liên hệ khẩn cấp)</Text>
                        <TextInput
                            style={styles.input}
                            value={form.relativeName}
                            onChangeText={(text) => setForm({ ...form, relativeName: text })}
                            placeholder="Tên người thân"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>SĐT người thân</Text>
                        <TextInput
                            style={styles.input}
                            value={form.relativeNumber}
                            onChangeText={(text) => setForm({ ...form, relativeNumber: text })}
                            placeholder="Số điện thoại người thân"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.saveBtn, saving && styles.saveBtnDisabled]} 
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveBtnText}>Lưu Thông Tin</Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, color: '#666' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', elevation: 2 },
    backBtn: { padding: 5 },
    logoutBtn: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    keyboardView: { flex: 1 },
    scrollContent: { padding: 20 },
    formGroup: { marginBottom: 15 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, fontSize: 16, color: '#333' },
    genderContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    genderBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5 },
    genderBtnActive: { backgroundColor: '#002677', borderColor: '#002677' },
    genderText: { fontSize: 16, color: '#666' },
    genderTextActive: { color: '#fff', fontWeight: 'bold' },
    saveBtn: { backgroundColor: '#002677', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20, marginBottom: 40 },
    saveBtnDisabled: { backgroundColor: '#A0AEC0' },
    saveBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});