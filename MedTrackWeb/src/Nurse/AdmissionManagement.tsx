import { useEffect, useState } from "react";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";

export default function AdmissionManagement() {
    const token = sessionStorage.getItem("token");
    const [admissions, setAdmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [selectedAdmission, setSelectedAdmission] = useState<any>(null);

    useEffect(() => {
        loadPendingAdmissions();
    }, []);

    const loadPendingAdmissions = async () => {
        try {
            setLoading(true);
            const res = await API.get("/admission/pending");
            setAdmissions(res.data);
        } catch (error) {
            toast.error("Failed to load admission orders");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentClick = (adm: any) => {
        setSelectedAdmission(adm);
        setShowModal(true);
    };

    const confirmPayment = async () => {
        if (!selectedAdmission) return;
        try {
            const toastId = toast.loading("Processing payment...");
            await API.put(`/admission/${selectedAdmission.admissionID}/advance-payment`, {});
            toast.dismiss(toastId);
            toast.success("Payment successful! Admission is now Paid.");
            setShowModal(false);
            loadPendingAdmissions();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to process payment");
        }
    };

    return (
        <div>
            <ToastContainer/>
            <div className="mb-4 dropShadow">
                <div className="card shadow">
                    <div className="card-header blueBg text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Pending Admission Orders (Payment Required)</h5>
                        <button className="btn btn-light btn-sm" onClick={loadPendingAdmissions}>
                            <i className="fa fa-refresh"></i> Refresh
                        </button>
                    </div>

                    <div className="card-body">
                        {loading ? (
                            <div className="text-center p-4">Loading...</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Patient</th>
                                            <th>Doctor</th>
                                            <th>Department</th>
                                            <th>Diagnosis</th>
                                            <th>Expected Date</th>
                                            <th>Advance Fee (VND)</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {admissions.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="text-center text-muted">No pending admission orders.</td>
                                            </tr>
                                        ) : (
                                            admissions.map(adm => (
                                                <tr key={adm.admissionID}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            {adm.image && <img src={adm.image} alt="Patient" style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }} />}
                                                            <div>
                                                                <strong>{adm.fullName}</strong><br />
                                                                <small className="text-muted">{adm.phone}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>Dr. {adm.doctorName}</td>
                                                    <td>{adm.departmentName}</td>
                                                    <td>{adm.hospitalizationsDiagnosis}</td>
                                                    <td>{adm.admissionDate ? adm.admissionDate.split("T")[0] : ""}</td>
                                                    <td>
                                                        <strong className="text-danger">
                                                            {Number(adm.advanceFee).toLocaleString('vi-VN')} đ
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handlePaymentClick(adm)}
                                                        >
                                                            <i className="fa fa-money"></i> Collect Payment
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Custom Confirmation Modal */}
            {showModal && selectedAdmission && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Confirm Payment</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to collect the advance fee for <strong>{selectedAdmission.fullName}</strong>?</p>
                                <p>Amount: <strong className="text-danger">{Number(selectedAdmission.advanceFee).toLocaleString('vi-VN')} đ</strong></p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-success" onClick={confirmPayment}>Confirm Payment</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
