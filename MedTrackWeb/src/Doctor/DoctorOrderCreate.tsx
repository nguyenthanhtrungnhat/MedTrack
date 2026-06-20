import { useEffect, useMemo, useState } from "react";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";

export default function DoctorOrderCreate() {
    const doctorID = sessionStorage.getItem("doctorID");

    const [patients, setPatients] = useState<any[]>([]);
    const [testTypes, setTestTypes] = useState<any[]>([]);

    const [searchCIC, setSearchCIC] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [activeAdmission, setActiveAdmission] = useState<any>(null);
    const [testTypeID, setTestTypeID] = useState("");
    const [diagnosisNote, setDiagnosisNote] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPatients();
        loadTestTypes();
    }, []);

    const loadPatients = async () => {
        try {
            const res = await API.get(
                "/patients"
            );

            setPatients(res.data);
        } catch {
            toast.error("Failed to load patients");
        }
    };

    const loadTestTypes = async () => {
        try {
            const res = await API.get(
                "/testtype"
            );

            setTestTypes(res.data);
        } catch {
            toast.error("Failed to load test types");
        }
    };

    const filteredPatients = useMemo(() => {
        if (!searchCIC.trim()) return [];

        return patients.filter(
            (p) =>
                p.CIC?.toLowerCase().includes(
                    searchCIC.toLowerCase()
                ) ||
                p.fullName?.toLowerCase().includes(
                    searchCIC.toLowerCase()
                )
        );
    }, [patients, searchCIC]);

    const handleSelectPatient = async (patient: any) => {
        setSelectedPatient(patient);
        setSearchCIC(patient.CIC);

        try {
            const res = await API.get(
                `/doctororder/active-admission/${patient.patientID}`
            );

            setActiveAdmission(res.data);
        } catch {
            setActiveAdmission(null);
            toast.warning("Patient has no active admission");
        }
    };

    const handleCreate = async () => {
        if (!selectedPatient) {
            return toast.warning("Please select a patient");
        }
        if (!activeAdmission) {
            return toast.warning("Patient has no active admission");
        }
        if (!testTypeID) {
            return toast.warning("Please select test type");
        }
        if (!diagnosisNote.trim()) {
            return toast.warning("Please enter diagnosis note");
        }

        try {
            setLoading(true);

            const loadingToast = toast.loading("Creating doctor order...");

            await API.post(
                "/doctororder",
                {
                    userID: selectedPatient.userID,
                    doctorID,
                    admissionID: activeAdmission.admissionID,
                    testTypeID,
                    diagnosisNote,
                }
            );

            toast.dismiss(loadingToast);
            toast.success("Doctor order created successfully");

            setSelectedPatient(null);
            setSearchCIC("");
            setTestTypeID("");
            setDiagnosisNote("");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to create order"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow">
            <ToastContainer />

            <div className="card-header blueBg text-white">
                <h5 className="mb-0">Create Doctor Order</h5>
            </div>

            <div className="card-body">

                {/* ================= ONLY SEARCH UI FIXED ================= */}
                <div className="mb-3 position-relative">
                    <label className="form-label">
                        Patient CIC / Name
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter CIC or patient name..."
                        value={searchCIC}
                        onChange={(e) => {
                            setSearchCIC(e.target.value);
                            setSelectedPatient(null);
                        }}
                    />

                    {/* DROPDOWN UI FIX */}
                    {!selectedPatient &&
                        searchCIC.trim() &&
                        filteredPatients.length > 0 && (
                            <div
                                className="border rounded mt-1 shadow-sm bg-white position-absolute w-100"
                                style={{
                                    maxHeight: "260px", // 🔥 limit UI height
                                    overflowY: "auto",  // 🔥 scroll inside
                                    zIndex: 9999,
                                }}
                            >
                                {filteredPatients.slice(0, 5).map((p) => (
                                    <div
                                        key={p.userID}
                                        className="p-2 border-bottom"
                                        style={{
                                            cursor: "pointer",
                                            transition: "0.15s",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background =
                                                "#f5f5f5")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background =
                                                "white")
                                        }
                                        onClick={() =>
                                            handleSelectPatient(p)
                                        }
                                    >
                                        <strong>{p.fullName}</strong>
                                        <br />
                                        <small className="text-muted">
                                            CIC: {p.CIC}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>

                {/* ================= SELECTED PATIENT ================= */}
                {selectedPatient && (
                    <div className="alert alert-info">
                        <strong>Selected Patient</strong>
                        <hr />
                        <div><b>Name:</b> {selectedPatient.fullName}</div>
                        <div><b>CIC:</b> {selectedPatient.CIC}</div>
                        <div><b>User ID:</b> {selectedPatient.userID}</div>
                    </div>
                )}

                {/* ================= ACTIVE ADMISSION ================= */}
                {activeAdmission && (
                    <div className="alert alert-success">
                        <div><b>Admission ID:</b> {activeAdmission.admissionID}</div>
                        <div><b>Status:</b> {activeAdmission.status}</div>
                        <div><b>Priority:</b> {activeAdmission.priority}</div>
                    </div>
                )}

                {/* ================= TEST TYPE ================= */}
                <div className="mb-3">
                    <label className="form-label">Test Type</label>

                    <select
                        className="form-select"
                        value={testTypeID}
                        onChange={(e) =>
                            setTestTypeID(e.target.value)
                        }
                    >
                        <option value="">Select Test Type</option>
                        {testTypes.map((t) => (
                            <option
                                key={t.testTypeID}
                                value={t.testTypeID}
                            >
                                {t.typeName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ================= DIAGNOSIS ================= */}
                <div className="mb-3">
                    <label className="form-label">Diagnosis Note</label>

                    <textarea
                        className="form-control"
                        rows={5}
                        value={diagnosisNote}
                        onChange={(e) =>
                            setDiagnosisNote(e.target.value)
                        }
                        placeholder="Enter diagnosis, reason for test, clinical notes..."
                    />
                </div>

                {/* ================= BUTTON ================= */}
                <button
                    className="btn btn-primary"
                    disabled={loading}
                    onClick={handleCreate}
                >
                    {loading ? "Creating..." : "Create Order"}
                </button>
            </div>
        </div>
    );
}