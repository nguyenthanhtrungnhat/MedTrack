import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axiosClient from '../../api/axiosClient';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function NurseDailyCheckingScreen() {
    const navigation = useNavigation<any>();

    const [patients, setPatients] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [formData, setFormData] = useState({
        patientID: "",
        pulse: "",
        spo2: "",
        temperature: "",
        oxygenTherapy: "",
        bloodPressure: "",
        height: "",
        weight: "",
        sensorium: "",
        respiratoryRate: "",
        urine: "",
        heartRate: "",
        hurtScale: "",
        currentCondition: ""
    });

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axiosClient.get("/patients");
                if (Array.isArray(res.data)) {
                    setPatients(res.data);
                }
            } catch (e) {
                console.error("Failed to fetch patients", e);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const handleSearchChange = (text: string) => {
        setSearchTerm(text);
        if (!text.trim()) {
            setFilteredPatients([]);
            setShowResults(false);
            setFormData(prev => ({ ...prev, patientID: "" }));
            return;
        }

        const filtered = patients.filter(p =>
            (p.fullName || "").toLowerCase().includes(text.toLowerCase())
        );
        setFilteredPatients(filtered);
        setShowResults(true);
    };

    const handleSelectPatient = (patient: any) => {
        setFormData(prev => ({ ...prev, patientID: patient.patientID.toString() }));
        setSearchTerm(patient.fullName);
        setShowResults(false);
    };

    const validateField = (name: string, value: string): string => {
        const num = parseFloat(value);
        switch (name) {
            case "pulse": return (!value || isNaN(num) || num < 30 || num > 220) ? "Pulse must be 30–220 bpm." : "";
            case "spo2": return (!value || isNaN(num) || num < 70 || num > 100) ? "SpO₂ must be 70–100%." : "";
            case "temperature": return (!value || isNaN(num) || num < 25 || num > 45) ? "Temperature must be 25–45°C." : "";
            case "oxygenTherapy": return (!value || isNaN(num) || num < 0 || num > 60) ? "Oxygen therapy must be 0–60 L/min." : "";
            case "bloodPressure":
                if (!value) return "Blood pressure must be SYS/DIA 30/20–250/150 mmHg.";
                const [sys, dia] = value.split("/").map(Number);
                return (isNaN(sys) || isNaN(dia) || sys < 30 || sys > 250 || dia < 20 || dia > 150)
                    ? "Blood pressure must be SYS/DIA 30/20–250/150 mmHg." : "";
            case "height": return (!value || isNaN(num) || num < 30 || num > 250) ? "Height must be 30–250 cm." : "";
            case "weight": return (!value || isNaN(num) || num < 1 || num > 500) ? "Weight must be 1–500 kg." : "";
            case "sensorium": return (!value || isNaN(num) || num < 1 || num > 15) ? "Sensorium must be 1–15." : "";
            case "respiratoryRate": return (!value || isNaN(num) || num < 5 || num > 60) ? "Respiratory rate must be 5–60/min." : "";
            case "urine": return (!value || isNaN(num) || num < 0 || num > 5000) ? "Urine output must be 0–5000 ml/h." : "";
            case "heartRate": return (!value || isNaN(num) || num < 30 || num > 220) ? "Heart rate must be 30–220 bpm." : "";
            case "hurtScale": return (!value || isNaN(num) || num < 0 || num > 10) ? "Pain scale must be 0–10." : "";
            case "currentCondition": return !value.trim() ? "Condition is required." : "";
            default: return "";
        }
    };

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = async () => {
        if (!formData.patientID) {
            Alert.alert("Error", "Please select a patient first.");
            return;
        }

        const newErrors: { [key: string]: string } = {};
        Object.keys(formData).forEach(key => {
            if (key !== 'patientID') {
                newErrors[key] = validateField(key, (formData as any)[key]);
            }
        });
        setErrors(newErrors);
        
        const allTouched = Object.keys(formData).reduce((acc, k) => ({...acc, [k]: true}), {});
        setTouched(allTouched);

        if (Object.values(newErrors).some(err => err)) {
            Alert.alert("Error", "Please fix the validation errors.");
            return;
        }

        setSubmitting(true);
        try {
            await axiosClient.post("/medical-records", {
                patientID: parseInt(formData.patientID),
                heartRate: parseFloat(formData.heartRate) || 0,
                pulse: parseFloat(formData.pulse) || 0,
                height: parseFloat(formData.height) || 0,
                weight: parseFloat(formData.weight) || 0,
                hurtScale: parseFloat(formData.hurtScale) || 0,
                temperature: parseFloat(formData.temperature) || 0,
                currentCondition: formData.currentCondition,
                SP02: parseFloat(formData.spo2) || 0,
                healthStatus: 1,
                respiratoryRate: parseFloat(formData.respiratoryRate) || 0,
                bloodPressure: formData.bloodPressure,
                urine: parseFloat(formData.urine) || 0,
                oxygenTherapy: parseInt(formData.oxygenTherapy) || 0,
                sensorium: parseInt(formData.sensorium) || 0,
            });

            Alert.alert("Success", "Daily checking submitted successfully!");
            // Reset form
            setFormData({
                patientID: "", pulse: "", spo2: "", temperature: "", oxygenTherapy: "",
                bloodPressure: "", height: "", weight: "", sensorium: "", respiratoryRate: "",
                urine: "", heartRate: "", hurtScale: "", currentCondition: ""
            });
            setSearchTerm('');
            setTouched({});
            setErrors({});

        } catch (error: any) {
            console.error("Submit medical record error:", error);
            Alert.alert("Error", "Failed to submit data.");
        } finally {
            setSubmitting(false);
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
                <Text style={styles.headerTitle}>Daily Checking</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Select Patient</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Search patient by name..."
                            value={searchTerm}
                            onChangeText={handleSearchChange}
                        />
                        {showResults && filteredPatients.length > 0 && (
                            <View style={styles.dropdown}>
                                {filteredPatients.map(p => (
                                    <TouchableOpacity 
                                        key={p.patientID} 
                                        style={styles.dropdownItem}
                                        onPress={() => handleSelectPatient(p)}
                                    >
                                        <Text style={styles.dropdownName}>{p.fullName}</Text>
                                        <Text style={styles.dropdownEmail}>{p.email}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Diagnostic Indicators</Text>
                        
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Pulse <Text style={styles.requiredAsterisk}>*</Text></Text>
                                <TextInput style={[styles.input, touched.pulse && errors.pulse ? styles.inputError : null]} placeholder="L/ph" keyboardType="numeric" value={formData.pulse} onChangeText={(t) => handleChange('pulse', t)} />
                                {touched.pulse && !!errors.pulse && <Text style={styles.errorText}>{errors.pulse}</Text>}
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>SpO₂ <Text style={styles.requiredAsterisk}>*</Text></Text>
                                <TextInput style={[styles.input, touched.spo2 && errors.spo2 ? styles.inputError : null]} placeholder="%" keyboardType="numeric" value={formData.spo2} onChangeText={(t) => handleChange('spo2', t)} />
                                {touched.spo2 && !!errors.spo2 && <Text style={styles.errorText}>{errors.spo2}</Text>}
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Temperature <Text style={styles.requiredAsterisk}>*</Text></Text>
                                <TextInput style={[styles.input, touched.temperature && errors.temperature ? styles.inputError : null]} placeholder="℃" keyboardType="numeric" value={formData.temperature} onChangeText={(t) => handleChange('temperature', t)} />
                                {touched.temperature && !!errors.temperature && <Text style={styles.errorText}>{errors.temperature}</Text>}
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>Oxygen Therapy <Text style={styles.requiredAsterisk}>*</Text></Text>
                                <TextInput style={[styles.input, touched.oxygenTherapy && errors.oxygenTherapy ? styles.inputError : null]} placeholder="L/min" keyboardType="numeric" value={formData.oxygenTherapy} onChangeText={(t) => handleChange('oxygenTherapy', t)} />
                                {touched.oxygenTherapy && !!errors.oxygenTherapy && <Text style={styles.errorText}>{errors.oxygenTherapy}</Text>}
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Blood Pressure <Text style={styles.requiredAsterisk}>*</Text></Text>
                                <TextInput style={[styles.input, touched.bloodPressure && errors.bloodPressure ? styles.inputError : null]} placeholder="SYS/DIA mmHg" value={formData.bloodPressure} onChangeText={(t) => handleChange('bloodPressure', t)} />
                                {touched.bloodPressure && !!errors.bloodPressure && <Text style={styles.errorText}>{errors.bloodPressure}</Text>}
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>Height <Text style={styles.requiredAsterisk}>*</Text></Text>
                                <TextInput style={[styles.input, touched.height && errors.height ? styles.inputError : null]} placeholder="cm" keyboardType="numeric" value={formData.height} onChangeText={(t) => handleChange('height', t)} />
                                {touched.height && !!errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Weight <Text style={styles.requiredAsterisk}>*</Text></Text>
                                <TextInput style={[styles.input, touched.weight && errors.weight ? styles.inputError : null]} placeholder="kg" keyboardType="numeric" value={formData.weight} onChangeText={(t) => handleChange('weight', t)} />
                                {touched.weight && !!errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>Sensorium <Text style={styles.requiredAsterisk}>*</Text></Text>
                                <TextInput style={[styles.input, touched.sensorium && errors.sensorium ? styles.inputError : null]} placeholder="1-15" keyboardType="numeric" value={formData.sensorium} onChangeText={(t) => handleChange('sensorium', t)} />
                                {touched.sensorium && !!errors.sensorium && <Text style={styles.errorText}>{errors.sensorium}</Text>}
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Respiratory Rate <Text style={styles.requiredAsterisk}>*</Text></Text>
                                <TextInput style={[styles.input, touched.respiratoryRate && errors.respiratoryRate ? styles.inputError : null]} placeholder="times/min" keyboardType="numeric" value={formData.respiratoryRate} onChangeText={(t) => handleChange('respiratoryRate', t)} />
                                {touched.respiratoryRate && !!errors.respiratoryRate && <Text style={styles.errorText}>{errors.respiratoryRate}</Text>}
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>Urine <Text style={styles.requiredAsterisk}>*</Text></Text>
                                <TextInput style={[styles.input, touched.urine && errors.urine ? styles.inputError : null]} placeholder="ml/h" keyboardType="numeric" value={formData.urine} onChangeText={(t) => handleChange('urine', t)} />
                                {touched.urine && !!errors.urine && <Text style={styles.errorText}>{errors.urine}</Text>}
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Heart Rate <Text style={styles.requiredAsterisk}>*</Text></Text>
                                <TextInput style={[styles.input, touched.heartRate && errors.heartRate ? styles.inputError : null]} placeholder="bpm" keyboardType="numeric" value={formData.heartRate} onChangeText={(t) => handleChange('heartRate', t)} />
                                {touched.heartRate && !!errors.heartRate && <Text style={styles.errorText}>{errors.heartRate}</Text>}
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>Pain Scale <Text style={styles.requiredAsterisk}>*</Text></Text>
                                <TextInput style={[styles.input, touched.hurtScale && errors.hurtScale ? styles.inputError : null]} placeholder="0-10" keyboardType="numeric" value={formData.hurtScale} onChangeText={(t) => handleChange('hurtScale', t)} />
                                {touched.hurtScale && !!errors.hurtScale && <Text style={styles.errorText}>{errors.hurtScale}</Text>}
                            </View>
                        </View>

                        <Text style={styles.label}>Current Condition <Text style={styles.requiredAsterisk}>*</Text></Text>
                        <TextInput 
                            style={[styles.input, styles.textArea, touched.currentCondition && errors.currentCondition ? styles.inputError : null]} 
                            placeholder="Enter current condition..."
                            multiline 
                            numberOfLines={3} 
                            textAlignVertical="top"
                            value={formData.currentCondition} 
                            onChangeText={(t) => handleChange('currentCondition', t)}
                        />
                        {touched.currentCondition && !!errors.currentCondition && <Text style={[styles.errorText, { marginBottom: 15 }]}>{errors.currentCondition}</Text>}

                        <TouchableOpacity 
                            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} 
                            onPress={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.submitBtnText}>Submit Data</Text>
                            )}
                        </TouchableOpacity>
                    </View>
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
    scrollContent: { padding: 15, paddingBottom: 40 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, zIndex: 1 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#2b6cb0', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#edf2f7', paddingBottom: 8 },
    row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
    col: { flex: 1 },
    label: { fontSize: 13, fontWeight: '600', color: '#4a5568', marginBottom: 6 },
    requiredAsterisk: { color: 'red' },
    input: { backgroundColor: '#f7fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginBottom: 5 },
    inputError: { borderColor: '#e53e3e', backgroundColor: '#fff5f5' },
    errorText: { color: '#e53e3e', fontSize: 11, marginTop: -3, marginBottom: 5 },
    textArea: { height: 80, marginBottom: 5 },
    dropdown: { position: 'absolute', top: 80, left: 15, right: 15, backgroundColor: '#fff', borderRadius: 8, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, zIndex: 10, maxHeight: 150 },
    dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    dropdownName: { fontSize: 14, fontWeight: 'bold', color: '#2d3748' },
    dropdownEmail: { fontSize: 12, color: '#718096' },
    submitBtn: { backgroundColor: '#38a169', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    submitBtnDisabled: { backgroundColor: '#9ae6b4' },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
