import { useEffect, useState } from "react";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";

export default function DischargeManagement() {
    const [pendingDischarges, setPendingDischarges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        loadPendingDischarges();
    }, []);

    const loadPendingDischarges = async () => {
        try {
            setLoading(true);
            const res = await API.get("/admission/pending-discharge");
            setPendingDischarges(res.data);
        } catch (error) {
            toast.error("Failed to load discharge list");
        } finally {
            setLoading(false);
        }
    };

    const handleProcessPayment = async (admissionID: number) => {
        if (!window.confirm("Confirm payment received and discharge patient?")) return;

        try {
            setProcessingId(admissionID);
            await API.put(`/admission/${admissionID}/discharge-payment`, {});
            toast.success("Discharge processed successfully!");
            loadPendingDischarges(); // Reload list
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to process discharge");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="mb-4 dropShadow">
            <ToastContainer/>
            <div className="card shadow">
                <div className="card-header blueBg text-white ">
                    <h5>Pending Discharges (Payment & Bed Clearance)</h5>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2">Loading pending discharges...</p>
                        </div>
                    ) : pendingDischarges.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <h5>No patients currently waiting for discharge.</h5>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Admission Code</th>
                                        <th>Patient Name</th>
                                        <th>Room - Bed</th>
                                        <th>Discharge Diagnosis</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingDischarges.map((adm) => (
                                        <tr key={adm.admissionID}>
                                            <td><strong>{adm.admissionRecordCode}</strong></td>
                                            <td>
                                                {adm.fullName}
                                                <br />
                                                <small className="text-muted">Phone: {adm.phone}</small>
                                            </td>
                                            <td>{adm.roomName} - Bed {adm.bedNumber}</td>
                                            <td>
                                                <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                                                    {adm.dischargeDiagnosis}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-success btn-sm w-100"
                                                    onClick={() => handleProcessPayment(adm.admissionID)}
                                                    disabled={processingId === adm.admissionID}
                                                >
                                                    {processingId === adm.admissionID ? "Processing..." : "Confirm Payment & Discharge"}
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
        </div>
    );
}
