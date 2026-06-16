import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function AdmissionOrderCreate() {
    const token = sessionStorage.getItem("token");
    const doctorID = sessionStorage.getItem("doctorID");

    const [patients, setPatients] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);

    const [searchCIC, setSearchCIC] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    const [departmentID, setDepartmentID] = useState("");
    const [advanceFee, setAdvanceFee] = useState("");
    const [priority, setPriority] = useState("Normal");
    const [expectedDate, setExpectedDate] = useState("");
    const [hospitalizationsDiagnosis, setDiagnosis] = useState("");
    const [summaryCondition, setCondition] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPatients();
        loadDepartments();
    }, []);

    const loadPatients = async () => {
        try {
            const res = await axios.get("http://localhost:3000/patients", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPatients(res.data);
        } catch {
            toast.error("Failed to load patients");
        }
    };

    const loadDepartments = async () => {
        try {
            const res = await axios.get("http://localhost:3000/departments", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDepartments(res.data);
        } catch {
            toast.error("Failed to load departments");
        }
    };

    const filteredPatients = useMemo(() => {
        if (!searchCIC.trim()) return [];
        return patients.filter((p) =>
            p.CIC?.toLowerCase().includes(searchCIC.toLowerCase()) ||
            p.fullName?.toLowerCase().includes(searchCIC.toLowerCase())
        );
    }, [patients, searchCIC]);

    const handleSelectPatient = (patient: any) => {
        setSelectedPatient(patient);
        setSearchCIC(patient.CIC);
    };

    const handleCreate = async () => {
        if (!selectedPatient) return toast.warning("Please select a patient");
        if (!departmentID) return toast.warning("Please select department");
        if (!advanceFee || Number(advanceFee) <= 0) return toast.warning("Please enter valid advance fee");
        if (!expectedDate) return toast.warning("Please select expected date");
        if (!hospitalizationsDiagnosis.trim()) return toast.warning("Please enter diagnosis");

        try {
            setLoading(true);
            const loadingToast = toast.loading("Creating Admission Order...");

            await axios.post(
                "http://localhost:3000/admission",
                {
                    patientID: selectedPatient.patientID,
                    departmentID,
                    advanceFee: Number(advanceFee),
                    priority,
                    expectedDate,
                    hospitalizationsDiagnosis,
                    summaryCondition
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.dismiss(loadingToast);
            toast.success("Admission Order created successfully");

            setSelectedPatient(null);
            setSearchCIC("");
            setDepartmentID("");
            setAdvanceFee("");
            setExpectedDate("");
            setDiagnosis("");
            setCondition("");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow mb-4">
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="card-header blueBg text-white">
                <h5 className="mb-0">Create Admission Order</h5>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Patient CIC / Name</label>
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
                        {!selectedPatient && searchCIC.trim() && filteredPatients.length > 0 && (
                            <div className="border rounded mt-2 bg-light position-absolute z-3 w-50">
                                {filteredPatients.map((p) => (
                                    <div
                                        key={p.patientID}
                                        className="p-2 border-bottom cursor-pointer"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleSelectPatient(p)}
                                    >
                                        <strong>{p.fullName}</strong><br />
                                        <small className="text-muted">CIC: {p.CIC}</small>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedPatient && (
                            <div className="alert alert-info mt-3 p-2">
                                <strong>Selected:</strong> {selectedPatient.fullName} (CIC: {selectedPatient.CIC})
                            </div>
                        )}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Department</label>
                        <select
                            className="form-select"
                            value={departmentID}
                            onChange={(e) => setDepartmentID(e.target.value)}
                        >
                            <option value="">-- Select Department --</option>
                            {departments.map((d) => (
                                <option key={d.departmentID} value={d.departmentID}>{d.departmentName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Expected Admission Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={expectedDate}
                            onChange={(e) => setExpectedDate(e.target.value)}
                            onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Priority</label>
                        <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="Normal">Normal</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>

                    <div className="col-md-12 mb-3">
                        <label className="form-label">Advance Fee (VND)</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="e.g. 5000000"
                            value={advanceFee}
                            onChange={(e) => setAdvanceFee(e.target.value)}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Diagnosis</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            value={hospitalizationsDiagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            placeholder="Reason for admission..."
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Summary Condition</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            value={summaryCondition}
                            onChange={(e) => setCondition(e.target.value)}
                            placeholder="Current condition notes..."
                        />
                    </div>
                </div>

                <button
                    className="btn btn-primary w-100 mt-2"
                    disabled={loading}
                    onClick={handleCreate}
                >
                    {loading ? "Creating..." : "Create Admission Order"}
                </button>
            </div>
        </div>
    );
}
