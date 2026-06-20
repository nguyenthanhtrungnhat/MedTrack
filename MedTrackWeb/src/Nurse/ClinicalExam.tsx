import React, { useState, useEffect } from 'react';
import API from "../api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ClinicalExam() {
    const [patients, setPatients] = useState<any[]>([]);
    const [searchPatientTerm, setSearchPatientTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<string>('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [formData, setFormData] = useState({
        height: '',
        weight: '',
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        generalCondition: '',
        symptoms: '',
        diagnosis: ''
    });

    const [touched, setTouched] = useState<any>({});
    const [errors, setErrors] = useState<any>({});

    const token = sessionStorage.getItem('token');

    // Validation rules
    const validateField = (name: string, value: string): string => {
        if (!value) return ""; // allow empty temporarily, but handle on submit
        const num = parseFloat(value);
        switch (name) {
            case "height": return (isNaN(num) || num < 20 || num > 300) ? "Height must be 20–300 cm." : "";
            case "weight": return (isNaN(num) || num < 1 || num > 500) ? "Weight must be 1–500 kg." : "";
            case "heartRate": return (isNaN(num) || num < 30 || num > 220) ? "Heart rate must be 30–220 bpm." : "";
            case "temperature": return (isNaN(num) || num < 25 || num > 45) ? "Temperature must be 25–45°C." : "";
            case "bloodPressure":
                const parts = value.split("/");
                if (parts.length !== 2) return "Must be format SYS/DIA";
                const [sys, dia] = parts.map(Number);
                return (isNaN(sys) || isNaN(dia) || sys < 30 || sys > 250 || dia < 20 || dia > 150)
                    ? "SYS 30-250, DIA 20-150 mmHg." : "";
            default: return "";
        }
    };

    useEffect(() => {
        // Fetch all patients to populate dropdown
        API.get('/patients').then(res => {
            setPatients(res.data);
        }).catch(err => {
            toast.error("Failed to load patients");
            console.error(err);
        });
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setTouched({ ...touched, [name]: true });
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPatient) {
            toast.warning("Please select a patient.");
            return;
        }

        const currentErrors = {
            height: validateField("height", formData.height),
            weight: validateField("weight", formData.weight),
            heartRate: validateField("heartRate", formData.heartRate),
            temperature: validateField("temperature", formData.temperature),
            bloodPressure: validateField("bloodPressure", formData.bloodPressure),
        };

        const hasErrors = Object.values(currentErrors).some(err => err !== "");
        if (hasErrors || !formData.height || !formData.weight || !formData.bloodPressure || !formData.heartRate || !formData.temperature) {
            setTouched({
                height: true, weight: true, heartRate: true, temperature: true, bloodPressure: true
            });
            setErrors(currentErrors);
            toast.warning("Please fix the validation errors before submitting.");
            return;
        }

        try {
            await API.post('/clinical-exams', {
                patientID: parseInt(selectedPatient),
                ...formData
            });
            toast.success("Clinical Examination submitted successfully!");
            setFormData({
                height: '', weight: '', bloodPressure: '', heartRate: '',
                temperature: '', generalCondition: '', symptoms: '', diagnosis: ''
            });
            setSelectedPatient('');
        } catch (error) {
            console.error(error);
            toast.error("Error submitting clinical examination.");
        }
    };

    return (
        <div className="mb-4 dropShadow">
            <ToastContainer />
            <div className="card shadow">
                <div className="card-header blueBg text-white ">
                    <h5>Clinical Examination (Nurse)</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 position-relative">
                            <label className="form-label fw-bold">Select Patient</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type to search patient by name or CIC..."
                                value={searchPatientTerm}
                                onChange={(e) => {
                                    setSearchPatientTerm(e.target.value);
                                    setShowDropdown(true);
                                    setSelectedPatient(''); // clear selection if typing
                                }}
                                onFocus={() => setShowDropdown(true)}
                            />
                            {showDropdown && searchPatientTerm && (
                                <ul className="list-group position-absolute w-100 shadow-sm" style={{ zIndex: 1000, maxHeight: '250px', overflowY: 'auto' }}>
                                    {patients
                                        .filter(p =>
                                            p.fullName?.toLowerCase().includes(searchPatientTerm.toLowerCase()) ||
                                            p.CIC?.includes(searchPatientTerm)
                                        )
                                        .slice(0, 50)
                                        .map(p => (
                                            <li
                                                key={p.patientID}
                                                className="list-group-item list-group-item-action"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setSelectedPatient(p.patientID);
                                                    setSearchPatientTerm(`${p.fullName} (CIC: ${p.CIC})`);
                                                    setShowDropdown(false);
                                                }}
                                            >
                                                {p.fullName} (CIC: {p.CIC})
                                            </li>
                                        ))}
                                    {patients.filter(p => p.fullName?.toLowerCase().includes(searchPatientTerm.toLowerCase()) || p.CIC?.includes(searchPatientTerm)).length === 0 && (
                                        <li className="list-group-item text-muted">No patients found</li>
                                    )}
                                </ul>
                            )}
                        </div>

                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Height (cm)</label>
                                <input type="number" step="0.1" name="height" className={`form-control ${touched.height && errors.height ? 'is-invalid' : ''}`} value={formData.height} onChange={handleChange} required />
                                {touched.height && errors.height && <div className="invalid-feedback">{errors.height}</div>}
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Weight (kg)</label>
                                <input type="number" step="0.1" name="weight" className={`form-control ${touched.weight && errors.weight ? 'is-invalid' : ''}`} value={formData.weight} onChange={handleChange} required />
                                {touched.weight && errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Heart Rate (bpm)</label>
                                <input type="number" name="heartRate" className={`form-control ${touched.heartRate && errors.heartRate ? 'is-invalid' : ''}`} value={formData.heartRate} onChange={handleChange} required />
                                {touched.heartRate && errors.heartRate && <div className="invalid-feedback">{errors.heartRate}</div>}
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Temperature (°C)</label>
                                <input type="number" step="0.1" name="temperature" className={`form-control ${touched.temperature && errors.temperature ? 'is-invalid' : ''}`} value={formData.temperature} onChange={handleChange} required />
                                {touched.temperature && errors.temperature && <div className="invalid-feedback">{errors.temperature}</div>}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Blood Pressure</label>
                            <input type="text" name="bloodPressure" className={`form-control ${touched.bloodPressure && errors.bloodPressure ? 'is-invalid' : ''}`} placeholder="e.g., 120/80" value={formData.bloodPressure} onChange={handleChange} required />
                            {touched.bloodPressure && errors.bloodPressure && <div className="invalid-feedback">{errors.bloodPressure}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">General Condition</label>
                            <textarea name="generalCondition" className="form-control" rows={2} value={formData.generalCondition} onChange={handleChange}></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Symptoms</label>
                            <textarea name="symptoms" className="form-control" rows={3} value={formData.symptoms} onChange={handleChange}></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Initial Diagnosis</label>
                            <textarea name="diagnosis" className="form-control" rows={3} value={formData.diagnosis} onChange={handleChange}></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Submit Clinical Exam</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
