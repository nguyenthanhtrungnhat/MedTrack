import { useEffect, useState } from "react";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";

export default function ManageAdmissions() {
    const [exams, setExams] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);

    const [selectedExam, setSelectedExam] = useState<any>(null);

    const [departmentID, setDepartmentID] = useState("");
    const [advanceFee, setAdvanceFee] = useState("");
    const [priority, setPriority] = useState("Normal");
    const [expectedDate, setExpectedDate] = useState("");
    const [hospitalizationsDiagnosis, setDiagnosis] = useState("");
    const [summaryCondition, setCondition] = useState("");

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadExams();
        loadDepartments();
    }, []);

    const loadExams = async () => {
        try {
            const res = await API.get("/clinical-exams/pending"
            );
            setExams(res.data);
        } catch {
            toast.error("Failed to load pending clinical exams");
        }
    };

    const loadDepartments = async () => {
        try {
            const res = await API.get("/departments");
            setDepartments(res.data);
        } catch {
            toast.error("Failed to load departments");
        }
    };

    const handleSelectExam = (exam: any) => {
        setSelectedExam(exam);
        setDiagnosis(exam.diagnosis || "");
        setCondition(exam.generalCondition || "");
        setShowModal(true);
    };

    const handleCreate = async () => {
        if (!selectedExam) return;
        if (!departmentID) return toast.warning("Please select department");
        if (!advanceFee || Number(advanceFee) <= 0) return toast.warning("Please enter valid advance fee");
        if (!expectedDate) return toast.warning("Please select expected date");
        if (!hospitalizationsDiagnosis.trim()) return toast.warning("Please enter diagnosis");

        try {
            setLoading(true);
            const loadingToast = toast.loading("Creating Admission Order...");

            await API.post(
                "/admission",
                {
                    patientID: selectedExam.patientID,
                    departmentID,
                    advanceFee: Number(advanceFee),
                    priority,
                    expectedDate,
                    hospitalizationsDiagnosis,
                    summaryCondition,
                    examID: selectedExam.examID
                }
            );

            toast.dismiss(loadingToast);
            toast.success("Admission Order created successfully");

            setShowModal(false);
            setDepartmentID("");
            setAdvanceFee("");
            setExpectedDate("");
            setDiagnosis("");
            setCondition("");
            setSelectedExam(null);

            // Refresh list
            loadExams();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to create order");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="card shadow-sm dropShadow  mb-3 border-0">
                <ToastContainer />
                <div className="card-header blueBg text-white">
                    <h5 className="mb-0">Manage Admissions</h5>
                </div>

                <div className="card shadow-sm h-100 p-4">
                    <h5 className="mb-3 text-primary">Pending Clinical Exams</h5>
                    {exams.length === 0 ? (
                        <p className="text-muted">No pending exams waiting for admission.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Patient</th>
                                        <th>CIC</th>
                                        <th>Init Diagnosis</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exams.map(exam => (
                                        <tr key={exam.examID}>
                                            <td>{new Date(exam.examDate).toLocaleString()}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img src={exam.image} alt={exam.fullName} className="rounded-circle me-2" width="40" height="40" />
                                                    <span>{exam.fullName}</span>
                                                </div>
                                            </td>
                                            <td>{exam.CIC}</td>
                                            <td>{exam.diagnosis}</td>
                                            <td>
                                                <button className="btn btn-primary btn-sm" onClick={() => handleSelectExam(exam)}>
                                                    View Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>


            </div>
            {/* Modal for creating admission */}
            {showModal && selectedExam && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Create Admission Order for {selectedExam.fullName}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body row">
                                <div className="col-md-6">
                                    <h6 className="text-info border-bottom pb-2">Clinical Exam Details</h6>
                                    <p><strong>Height:</strong> {selectedExam.height} cm</p>
                                    <p><strong>Weight:</strong> {selectedExam.weight} kg</p>
                                    <p><strong>Blood Pressure:</strong> {selectedExam.bloodPressure}</p>
                                    <p><strong>Heart Rate:</strong> {selectedExam.heartRate} bpm</p>
                                    <p><strong>Temperature:</strong> {selectedExam.temperature} °C</p>
                                    <p><strong>Symptoms:</strong> {selectedExam.symptoms}</p>
                                </div>
                                <div className="col-md-6 border-start">
                                    <h6 className="text-info border-bottom pb-2">Admission Info</h6>

                                    <div className="mb-2">
                                        <label className="form-label fw-bold">Department</label>
                                        <select
                                            className="form-select"
                                            value={departmentID}
                                            onChange={(e) => setDepartmentID(e.target.value)}
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map((dept) => (
                                                <option key={dept.departmentID} value={dept.departmentID}>
                                                    {dept.departmentName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label fw-bold">Advance Fee (VND)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={advanceFee}
                                            onChange={(e) => setAdvanceFee(e.target.value)}
                                            placeholder="e.g. 5000000"
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label fw-bold">Priority</label>
                                        <select
                                            className="form-select"
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value)}
                                        >
                                            <option value="Normal">Normal</option>
                                            <option value="Urgent">Urgent</option>
                                        </select>
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label fw-bold">Expected Admission Date</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={expectedDate}
                                            onChange={(e) => setExpectedDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label fw-bold">Hospitalization Diagnosis</label>
                                        <textarea
                                            className="form-control"
                                            rows={2}
                                            value={hospitalizationsDiagnosis}
                                            onChange={(e) => setDiagnosis(e.target.value)}
                                        ></textarea>
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label fw-bold">Summary Condition</label>
                                        <textarea
                                            className="form-control"
                                            rows={2}
                                            value={summaryCondition}
                                            onChange={(e) => setCondition(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
                                    {loading ? "Creating..." : "Create Order"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
