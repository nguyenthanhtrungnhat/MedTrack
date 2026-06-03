import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HamburgerMenu from '../../components/HamburgerMenu';
import { DOCTOR_MENU_ITEMS } from '../../components/DoctorLayout';
import * as ImagePicker from 'expo-image-picker';
import ScreenWrapper from '../../components/ScreenWrapper';


export default function TreatmentTimelineScreen() {
    const { userID } = useContext(AuthContext);
    const navigation = useNavigation<any>();

    const [imageUri, setImageUri] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        admissionNumber: '',
        patientCode: '',
        diagnosis: ''
    });
    const [logs, setLogs] = useState<any[]>([]);

    const pickImage = async (useCamera: boolean) => {
        let result;
        if (useCamera) {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                Alert.alert("Permission", "You need to grant Camera permission to take photos.");
                return;
            }
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: 'images',
                quality: 0.8,
            });
        } else {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert("Permission", "You need to grant Media Library permission.");
                return;
            }
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                quality: 0.8,
            });
        }

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
            // Reset state when selecting new image
            setForm({ admissionNumber: '', patientCode: '', diagnosis: '' });
            setLogs([]);
        }
    };

    const normalizeLogs = (rawLogs: any[]) => {
        return rawLogs.map(log => {
            let s = "", o = "", a = "", p = "";
            const text = (log.subjective || "").toLowerCase();
            const parts = text.split(/[.,]/);

            for (let part of parts) {
                part = part.trim();
                if (!part) continue;
                if (part.includes("patient") || part.includes("pain") || part.includes("feels")) {
                    s += part + ". ";
                } else if (part.includes("bp") || part.includes("blood pressure") || part.includes("heart rate") || part.includes("temperature")) {
                    o += part + ". ";
                } else if (part.includes("continue") || part.includes("medication") || part.includes("give") || part.includes("administer")) {
                    p += part + ". ";
                } else if (part.includes("stable") || part.includes("improved") || part.includes("worse")) {
                    a += part + ". ";
                } else {
                    s += part + ". ";
                }
            }
            return {
                ...log,
                subjective: s.trim(),
                objective: o.trim(),
                assessment: a.trim(),
                plan: p.trim(),
                instruction: log.instruction || "",
            };
        });
    };

    const handleScan = async () => {
        if (!imageUri) {
            Alert.alert("No image", "Please take or select a medical record photo.");
            return;
        }

        setScanning(true);
        try {
            const formData = new FormData();
            const filename = imageUri.split('/').pop() || 'image.jpg';
            
            // Extract extension to guess mime type
            const extension = filename.split('.').pop()?.toLowerCase();
            const fileType = extension === 'png' ? 'image/png' : 'image/jpeg';
            
            formData.append('file', {
                uri: imageUri,
                name: filename,
                type: fileType,
            } as any);

            const res = await axiosClient.post('/treatmenttimeline/ocr', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 30000,
            });

            setForm(res.data.form || { admissionNumber: '', patientCode: '', diagnosis: '' });
            setLogs(normalizeLogs(res.data.logs || []));
            Alert.alert("Success", "Finished analyzing the image.");
        } catch (error) {
            console.error("Scan error:", error);
            Alert.alert("Error", "Could not analyze the image. Please try again.");
        } finally {
            setScanning(false);
        }
    };

    const handleUpdateLog = (index: number, field: string, value: string) => {
        const newLogs = [...logs];
        newLogs[index][field] = value;
        setLogs(newLogs);
    };

    const handleSave = async () => {
        if (!form.patientCode) {
            Alert.alert("Missing Info", "Patient ID (HI) cannot be empty.");
            return;
        }

        setSaving(true);
        try {
            await axiosClient.post('/treatmenttimeline', {
                admissionNumber: form.admissionNumber,
                patientCode: form.patientCode,
                diagnosis: form.diagnosis,
                doctorID: userID,
                logs
            });
            Alert.alert("Success", "Medical record saved successfully!", [
                { text: "OK", onPress: () => navigation.navigate("TreatmentDashboard") }
            ]);
        } catch (error) {
            console.error("Save error:", error);
            Alert.alert("Error", "Could not save medical record.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <HamburgerMenu menuItems={DOCTOR_MENU_ITEMS} activeKey="TreatmentTimeline" onSelect={(key) => navigation.navigate(key)} />
                <Text style={styles.headerTitle}>Medical Record</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Scan Record (OCR)</Text>
                    
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cameraBtn} onPress={() => pickImage(true)}>
                            <Ionicons name="camera-outline" size={24} color="#fff" />
                            <Text style={styles.btnText}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.galleryBtn} onPress={() => pickImage(false)}>
                            <Ionicons name="image-outline" size={24} color="#fff" />
                            <Text style={styles.btnText}>Gallery</Text>
                        </TouchableOpacity>
                    </View>

                    {imageUri && (
                        <View style={styles.previewContainer}>
                            <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />
                            <TouchableOpacity 
                                style={[styles.scanBtn, scanning && { opacity: 0.7 }]} 
                                onPress={handleScan}
                                disabled={scanning}
                            >
                                {scanning ? <ActivityIndicator color="#fff" /> : <Text style={styles.scanBtnText}>Scan OCR (AI)</Text>}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {logs.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Analysis Results</Text>

                        <Text style={styles.label}>Patient Code (HI) <Text style={{color:'red'}}>*</Text></Text>
                        <TextInput style={styles.input} value={form.patientCode} onChangeText={(val) => setForm({...form, patientCode: val})} />

                        <Text style={styles.label}>Admission Number</Text>
                        <TextInput style={styles.input} value={form.admissionNumber} onChangeText={(val) => setForm({...form, admissionNumber: val})} />

                        <Text style={styles.label}>Diagnosis</Text>
                        <TextInput style={styles.input} value={form.diagnosis} onChangeText={(val) => setForm({...form, diagnosis: val})} multiline />

                        <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Treatment Logs</Text>
                        
                        {logs.map((log, index) => (
                            <View key={index} style={styles.logBox}>
                                <Text style={styles.logTitle}>Log #{index + 1}</Text>
                                
                                <Text style={styles.subLabel}>Time</Text>
                                <TextInput style={styles.logInput} value={log.logTime} onChangeText={(val) => handleUpdateLog(index, 'logTime', val)} />

                                <Text style={styles.subLabel}>S (Subjective)</Text>
                                <TextInput style={styles.logInput} value={log.subjective} onChangeText={(val) => handleUpdateLog(index, 'subjective', val)} />

                                <Text style={styles.subLabel}>O (Objective)</Text>
                                <TextInput style={styles.logInput} value={log.objective} onChangeText={(val) => handleUpdateLog(index, 'objective', val)} />

                                <Text style={styles.subLabel}>A (Assessment)</Text>
                                <TextInput style={styles.logInput} value={log.assessment} onChangeText={(val) => handleUpdateLog(index, 'assessment', val)} />

                                <Text style={styles.subLabel}>P (Plan)</Text>
                                <TextInput style={styles.logInput} value={log.plan} onChangeText={(val) => handleUpdateLog(index, 'plan', val)} />

                                <Text style={styles.subLabel}>Instruction</Text>
                                <TextInput style={styles.logInput} value={log.instruction} onChangeText={(val) => handleUpdateLog(index, 'instruction', val)} />
                            </View>
                        ))}

                        <TouchableOpacity 
                            style={[styles.saveBtn, saving && { opacity: 0.7 }]} 
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Record</Text>}
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    content: { padding: 15 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 1 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2d3748', marginBottom: 15 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
    cameraBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3182ce', paddingVertical: 12, borderRadius: 8, marginRight: 5 },
    galleryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#38a169', paddingVertical: 12, borderRadius: 8, marginLeft: 5 },
    btnText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
    previewContainer: { marginTop: 20, alignItems: 'center' },
    previewImage: { width: '100%', height: 250, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 15 },
    scanBtn: { backgroundColor: '#d69e2e', width: '100%', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    scanBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#4a5568', marginBottom: 6 },
    input: { backgroundColor: '#f7fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, marginBottom: 15, color: '#2d3748' },
    logBox: { backgroundColor: '#f7fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, marginBottom: 15 },
    logTitle: { fontSize: 14, fontWeight: 'bold', color: '#002677', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#edf2f7', paddingBottom: 6 },
    subLabel: { fontSize: 12, color: '#718096', marginBottom: 4, fontWeight: '500' },
    logInput: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#edf2f7', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, fontSize: 14, marginBottom: 10, color: '#2d3748' },
    saveBtn: { backgroundColor: '#002677', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
