import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HamburgerMenu from '../../components/HamburgerMenu';
import { DOCTOR_MENU_ITEMS } from '../../components/DoctorLayout';
import SearchSelectModal from '../../components/SearchSelectModal';
import ScreenWrapper from '../../components/ScreenWrapper';


export default function MakePrescriptionScreen() {
    const { userID } = useContext(AuthContext);
    const navigation = useNavigation<any>();

    const [patients, setPatients] = useState<any[]>([]);
    const [medicines, setMedicines] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [items, setItems] = useState<any[]>([]);

    const [showPatientModal, setShowPatientModal] = useState(false);
    const [showMedicineModal, setShowMedicineModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pRes, mRes] = await Promise.all([
                    axiosClient.get('/patients'),
                    axiosClient.get('/medicines')
                ]);
                setPatients(pRes.data);
                setMedicines(mRes.data);
            } catch (err) {
                Alert.alert("Error", "Failed to load patients and medicines data.");
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const handleAddMedicine = (medicine: any) => {
        if (items.some(i => i.medicineID === medicine.medicineID)) {
            Alert.alert("Notice", "This medicine has already been added.");
            return;
        }
        setItems([
            ...items,
            {
                medicineID: medicine.medicineID,
                medicineName: medicine.medicineName,
                dosageForm: medicine.dosageForm,
                dosage: '',
                frequency: '1',
                durationDays: '1',
                quantity: '1',
                instructions: ''
            }
        ]);
    };

    const handleUpdateItem = (index: number, field: string, value: string) => {
        const updated = [...items];
        updated[index][field] = value;
        
        // Auto calculate quantity if frequency or duration changes
        if (field === 'frequency' || field === 'durationDays') {
            const freq = parseInt(updated[index].frequency) || 0;
            const days = parseInt(updated[index].durationDays) || 0;
            updated[index].quantity = (freq * days).toString();
        }
        setItems(updated);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!selectedPatient) {
            Alert.alert("Missing Information", "Please select a patient.");
            return;
        }
        if (items.length === 0) {
            Alert.alert("Missing Information", "Please add at least 1 medicine.");
            return;
        }

        // Validate items
        const invalidItem = items.find(i => !i.dosage || !i.frequency || !i.durationDays);
        if (invalidItem) {
            Alert.alert("Missing Information", `Please provide full dosage and instructions for ${invalidItem.medicineName}`);
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                patientID: selectedPatient.patientID,
                doctorID: userID,
                diagnosis,
                notes,
                medicines: items.map(i => ({
                    ...i,
                    frequency: parseInt(i.frequency),
                    durationDays: parseInt(i.durationDays),
                    quantity: parseInt(i.quantity)
                }))
            };

            await axiosClient.post('/prescriptions', payload);
            Alert.alert("Success", "Prescription created successfully!", [
                { text: "OK", onPress: () => {
                    // Reset form
                    setSelectedPatient(null);
                    setDiagnosis('');
                    setNotes('');
                    setItems([]);
                    navigation.navigate('PrescriptionList');
                }}
            ]);
        } catch (error) {
            console.error("Submit error:", error);
            Alert.alert("Error", "An error occurred while creating prescription.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingData) {
        return (
            <ScreenWrapper style={styles.container}>
                <View style={styles.header}>
                    <HamburgerMenu menuItems={DOCTOR_MENU_ITEMS} activeKey="MakePrescription" onSelect={(key) => navigation.navigate(key)} />
                    <Text style={styles.headerTitle}>Make Prescription</Text>
                    <View style={{ width: 30 }} />
                </View>
                <View style={styles.centerContainer}><ActivityIndicator size="large" color="#002677" /></View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <HamburgerMenu menuItems={DOCTOR_MENU_ITEMS} activeKey="MakePrescription" onSelect={(key) => navigation.navigate(key)} />
                <Text style={styles.headerTitle}>Make Prescription</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView style={styles.scrollContent} keyboardShouldPersistTaps="handled">
                {/* General Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General Information</Text>
                    
                    <Text style={styles.label}>Patient <Text style={{ color: 'red' }}>*</Text></Text>
                    <TouchableOpacity style={styles.selectBtn} onPress={() => setShowPatientModal(true)}>
                        <Text style={[styles.selectBtnText, !selectedPatient && { color: '#a0aec0' }]}>
                            {selectedPatient ? `${selectedPatient.fullName} (ID: ${selectedPatient.patientID})` : 'Tap to select patient...'}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#a0aec0" />
                    </TouchableOpacity>

                    <Text style={styles.label}>Diagnosis</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Enter diagnosis..."
                        value={diagnosis}
                        onChangeText={setDiagnosis}
                    />

                    <Text style={styles.label}>Additional Notes</Text>
                    <TextInput 
                        style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
                        placeholder="Instructions for patient..."
                        multiline
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>

                {/* Medicines List */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>Prescription <Text style={{ color: 'red' }}>*</Text></Text>
                        <TouchableOpacity style={styles.addBtn} onPress={() => setShowMedicineModal(true)}>
                            <Ionicons name="add" size={18} color="#fff" />
                            <Text style={styles.addBtnText}>Add Medicine</Text>
                        </TouchableOpacity>
                    </View>

                    {items.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <Ionicons name="medkit-outline" size={40} color="#cbd5e0" />
                            <Text style={styles.emptyCardText}>No medicine selected yet</Text>
                        </View>
                    ) : (
                        items.map((item, index) => (
                            <View key={item.medicineID} style={styles.medicineCard}>
                                <View style={styles.medicineHeader}>
                                    <View>
                                        <Text style={styles.medicineName}>{item.medicineName}</Text>
                                        <Text style={styles.dosageForm}>{item.dosageForm}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => handleRemoveItem(index)} style={styles.removeBtn}>
                                        <Ionicons name="trash-outline" size={20} color="#e53e3e" />
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={styles.inputGrid}>
                                    <View style={styles.inputCol}>
                                        <Text style={styles.subLabel}>Dosage</Text>
                                        <TextInput 
                                            style={styles.gridInput} 
                                            placeholder={`E.g.: 1 ${item.dosageForm}`} 
                                            value={item.dosage}
                                            onChangeText={(val) => handleUpdateItem(index, 'dosage', val)}
                                        />
                                    </View>
                                    <View style={[styles.inputCol, { marginLeft: 10 }]}>
                                        <Text style={styles.subLabel}>Times/Day</Text>
                                        <TextInput 
                                            style={styles.gridInput} 
                                            keyboardType="numeric"
                                            value={item.frequency}
                                            onChangeText={(val) => handleUpdateItem(index, 'frequency', val)}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGrid}>
                                    <View style={styles.inputCol}>
                                        <Text style={styles.subLabel}>Duration (days)</Text>
                                        <TextInput 
                                            style={styles.gridInput} 
                                            keyboardType="numeric"
                                            value={item.durationDays}
                                            onChangeText={(val) => handleUpdateItem(index, 'durationDays', val)}
                                        />
                                    </View>
                                    <View style={[styles.inputCol, { marginLeft: 10 }]}>
                                        <Text style={styles.subLabel}>Total Quantity</Text>
                                        <TextInput 
                                            style={[styles.gridInput, { backgroundColor: '#edf2f7', color: '#4a5568' }]} 
                                            editable={false}
                                            value={item.quantity}
                                        />
                                    </View>
                                </View>

                                <Text style={styles.subLabel}>Usage Instructions</Text>
                                <TextInput 
                                    style={styles.gridInput} 
                                    placeholder="After meal, before bed..." 
                                    value={item.instructions}
                                    onChangeText={(val) => handleUpdateItem(index, 'instructions', val)}
                                />
                            </View>
                        ))
                    )}
                </View>

                {/* Footer Space */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Submit Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity 
                    style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]} 
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Create Prescription</Text>}
                </TouchableOpacity>
            </View>

            {/* Modals */}
            <SearchSelectModal
                visible={showPatientModal}
                onClose={() => setShowPatientModal(false)}
                data={patients}
                title="Select Patient"
                searchKey="fullName"
                displayKey="fullName"
                onSelect={setSelectedPatient}
            />

            <SearchSelectModal
                visible={showMedicineModal}
                onClose={() => setShowMedicineModal(false)}
                data={medicines}
                title="Select Medicine"
                searchKey="medicineName"
                displayKey="medicineName"
                subDisplayKey="dosageForm"
                onSelect={handleAddMedicine}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    scrollContent: { flex: 1, padding: 15 },
    section: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 1 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2d3748', marginBottom: 15 },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    label: { fontSize: 14, fontWeight: '600', color: '#4a5568', marginBottom: 6 },
    input: { backgroundColor: '#f7fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, marginBottom: 15 },
    selectBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f7fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 15 },
    selectBtnText: { fontSize: 15, color: '#2d3748' },
    addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3182ce', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
    addBtnText: { color: '#fff', fontWeight: '600', marginLeft: 4, fontSize: 13 },
    emptyCard: { alignItems: 'center', padding: 30, backgroundColor: '#f7fafc', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed' },
    emptyCardText: { color: '#a0aec0', marginTop: 10 },
    medicineCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, marginBottom: 12 },
    medicineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    medicineName: { fontSize: 16, fontWeight: 'bold', color: '#2b6cb0' },
    dosageForm: { fontSize: 12, color: '#718096', marginTop: 2 },
    removeBtn: { padding: 4 },
    inputGrid: { flexDirection: 'row', marginBottom: 10 },
    inputCol: { flex: 1 },
    subLabel: { fontSize: 12, color: '#718096', marginBottom: 4 },
    gridInput: { backgroundColor: '#f7fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, fontSize: 14 },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 15, paddingBottom: 25, borderTopWidth: 1, borderTopColor: '#e2e8f0', elevation: 10 },
    submitBtn: { backgroundColor: '#002677', padding: 15, borderRadius: 8, alignItems: 'center' },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
