import axios from 'axios';
import './css/AllDesign.css';
import PatientInformation from './PatientInformation';
import { useEffect, useState } from 'react';
import { PatientProps } from './interface';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function BedDetails() {
    const [user, setUser] = useState<PatientProps | null>(null);
    const { patientID } = useParams();
    const token = sessionStorage.getItem("token");
    const patientByIdUrl = `http://localhost:3000/patients/${patientID}`;
    const [loading, setLoading] = useState(true);
    const roleID = sessionStorage.getItem("roleID");
    const [showDischargeModal, setShowDischargeModal] = useState(false);
    const [dischargeDiagnosis, setDischargeDiagnosis] = useState("");
    const [dischargeCondition, setDischargeCondition] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadUser();
    }, [patientByIdUrl]);

    const loadUser = () => {
        if (!patientID) return;
        setLoading(true);
        axios.get(patientByIdUrl, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setUser(response.data))
            .catch(error => console.error('Error fetching user:', error))
            .finally(() => setLoading(false));
    };

    const handleDischargeSubmit = async () => {
        if (!dischargeDiagnosis || !dischargeCondition) {
            return toast.warning("Please fill in both diagnosis and condition");
        }
        if (!user?.admissionID) return toast.error("No active admission found");
        
        try {
            setSubmitting(true);
            await axios.put(`http://localhost:3000/admission/${user.admissionID}/discharge-order`, {
                dischargeDiagnosis,
                dischargeCondition
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Discharge Order created!");
            setShowDischargeModal(false);
            loadUser(); // refresh patient data
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create discharge order");
        } finally {
            setSubmitting(false);
        }
    };

    return (

        <div className="row align-items-stretch">
            {/* Left column */}
            <div className="col-lg-6 col-sm-12 d-flex">
                <div className="w-100 d-flex flex-column border whiteBg marginBottom dropShadow p-3">

                    {loading ? (
                        <PatientInformation
                            patientID={user?.patientID}
                            image={user?.image || ""}
                            fullName={user?.fullName || ""}
                            gender={
                                user?.gender == "1"
                                    ? "Male"
                                    : user?.gender == "2"
                                        ? "Female"
                                        : ""
                            }
                            dob={user?.dob?.split("T")[0] || ""}
                            phone={user?.phone || ""}
                            CIC={Number(user?.CIC)}
                            address={user?.address || ""}
                            email={user?.email || ""}
                            HI={user?.HI || ""}
                            admissionDate={user?.admissionDate?.split("T")[0] || ""}
                            relativeName={user?.relativeName || ""}
                            relativeNumber={Number(user?.relativeNumber) || ""}
                            loading={loading}
                        />

                    ) : (
                        <PatientInformation
                            patientID={user?.patientID}
                            image={user?.image || ""}
                            fullName={user?.fullName || ""}
                            gender={
                                user?.gender == "1"
                                    ? "Male"
                                    : user?.gender == "2"
                                        ? "Female"
                                        : ""
                            }
                            dob={user?.dob?.split("T")[0] || ""}
                            phone={user?.phone || ""}
                            CIC={Number(user?.CIC)}
                            address={user?.address || ""}
                            email={user?.email || ""}
                            HI={user?.HI || ""}
                            admissionDate={user?.admissionDate?.split("T")[0] || ""}
                            relativeName={user?.relativeName || ""}
                            relativeNumber={Number(user?.relativeNumber) || ""}
                            loading={loading}
                        />
                    )}
                </div>
            </div>

            {/* Right column */}
            <div className="col-lg-6 col-sm-12 d-flex">
                <div className="w-100 d-flex flex-column border whiteBg marginBottom dropShadow p-3">
                    <h5 className="blueText">Diagnose</h5>

                    <p className="blueText">Hospitalization diagnosis:</p>
                    {user?.hospitalizationsDiagnosis ? (
                        <p>{user.hospitalizationsDiagnosis}</p>
                    ) : (
                        <p className="placeholder-glow">
                            <span className="placeholder col-8"></span>
                        </p>
                    )}

                    <p className="blueText">Summary of disease process:</p>
                    {user?.summaryCondition ? (
                        <p>{user.summaryCondition}</p>
                    ) : (
                        <p className="placeholder-glow">
                            <span className="placeholder col-10"></span>
                        </p>
                    )}

                    <p className="blueText">Discharge diagnosis:</p>
                    {user?.dischargeDiagnosis ? (
                        <p>{user.dischargeDiagnosis}</p>
                    ) : (
                        <p className="text-muted">Not discharged yet.</p>
                    )}

                    {roleID === "1" && user?.admissionStatus === "In-treatment" && (
                        <button className="btn btn-warning mt-auto" onClick={() => setShowDischargeModal(true)}>
                            Create Discharge Order
                        </button>
                    )}
                </div>
            </div>

            {/* Discharge Modal */}
            {showDischargeModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create Discharge Order</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDischargeModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label>Discharge Diagnosis</label>
                                    <textarea 
                                        className="form-control" 
                                        rows={3} 
                                        value={dischargeDiagnosis} 
                                        onChange={e => setDischargeDiagnosis(e.target.value)} 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Discharge Condition</label>
                                    <textarea 
                                        className="form-control" 
                                        rows={3} 
                                        value={dischargeCondition} 
                                        onChange={e => setDischargeCondition(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDischargeModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleDischargeSubmit} disabled={submitting}>
                                    {submitting ? "Submitting..." : "Submit Order"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
