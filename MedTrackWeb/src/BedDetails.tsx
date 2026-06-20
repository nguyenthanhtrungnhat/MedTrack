import './css/AllDesign.css';
import PatientInformation from './PatientInformation';
import { useEffect, useState } from 'react';
import { PatientProps } from './interface';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from "./api";
export default function BedDetails() {
    const [user, setUser] = useState<PatientProps | null>(null);
    const { patientID } = useParams();
    const [loading, setLoading] = useState(true);
    const roleID = sessionStorage.getItem("roleID");
    const [showDischargeModal, setShowDischargeModal] = useState(false);
    const [diagnosisType, setDiagnosisType] = useState("");
    const [diagnosisText, setDiagnosisText] = useState("");
    const [summary, setSummary] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [clinicalExam, setClinicalExam] = useState<any>(null);

    useEffect(() => {
        loadUser();
        loadClinicalExam();
    }, [patientID]);

    const loadUser = () => {
        if (!patientID) return;
        setLoading(true);
        API.get(`/patients/${patientID}`)
            .then(response => {
                console.log("Patient Information", response.data);
                setUser(response.data);
            })
            .catch(error => console.error('Error fetching user:', error))
            .finally(() => setLoading(false));
    };

    const loadClinicalExam = () => {
        if (!patientID) return;
        API.get(`/clinical-exams/patient/${patientID}`)
            .then(response => {
                if (response.data && response.data.length > 0) {
                    setClinicalExam(response.data[0]); // get latest
                }
            })
            .catch(error => console.error('Error fetching clinical exam:', error));
    };

    const handleDischargeSubmit = async () => {
        if (!diagnosisType || !diagnosisText) {
            return toast.warning("Please fill in diagnosis type and diagnosis text");
        }
        if (!user?.admissionID) return toast.error("No active admission found");

        try {
            setSubmitting(true);
            await API.put(`/admission/${user.admissionID}/discharge-order`, {
                diagnosisType,
                diagnosisText,
                summary
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
                        <div>
                            <p className="placeholder-glow">
                                <span className="placeholder col-8"></span>
                            </p>

                            <p className="placeholder-glow">
                                <span className="placeholder col-6"></span>
                            </p>

                            <p className="placeholder-glow">
                                <span className="placeholder col-10"></span>
                            </p>

                            <p className="placeholder-glow">
                                <span className="placeholder col-7"></span>
                            </p>

                            <p className="placeholder-glow">
                                <span className="placeholder col-9"></span>
                            </p>
                        </div>
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
                            relativeNumber={user?.relativeNumber || ""}
                            loading={false}
                        />
                    )}
                </div>
            </div>

            {/* Right column */}
            <div className="col-lg-6 col-sm-12 d-flex">
                <div className="w-100 d-flex flex-column border whiteBg marginBottom dropShadow p-3">
                    <h5 className="blueText">Latest Clinical Exam</h5>
                    {clinicalExam ? (
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Height:</strong> {clinicalExam.height} cm</p>
                                <p><strong>Weight:</strong> {clinicalExam.weight} kg</p>
                                <p><strong>Blood Pressure:</strong> {clinicalExam.bloodPressure}</p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Heart Rate:</strong> {clinicalExam.heartRate} bpm</p>
                                <p><strong>Temperature:</strong> {clinicalExam.temperature} °C</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted">No clinical exam data available.</p>
                    )}
                    <hr />

                    <h5 className="blueText mt-2">Diagnose</h5>

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
                                    <label>Diagnosis Type</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={diagnosisType}
                                        onChange={e => setDiagnosisType(e.target.value)}
                                        placeholder="e.g. Primary, Secondary..."
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Diagnosis Text</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        value={diagnosisText}
                                        onChange={e => setDiagnosisText(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Summary of disease process & discharge instructions</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        value={summary}
                                        onChange={e => setSummary(e.target.value)}
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
