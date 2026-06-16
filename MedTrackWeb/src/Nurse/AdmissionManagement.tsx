import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function AdmissionManagement() {
    const token = sessionStorage.getItem("token");
    const [admissions, setAdmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPendingAdmissions();
    }, []);

    const loadPendingAdmissions = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:3000/admission/pending", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdmissions(res.data);
        } catch (error) {
            toast.error("Failed to load admission orders");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (admissionID: number) => {
        if (!window.confirm("Confirm receiving advance fee payment from the patient?")) return;
        try {
            const toastId = toast.loading("Processing payment...");
            await axios.put(`http://localhost:3000/admission/${admissionID}/advance-payment`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.dismiss(toastId);
            toast.success("Payment successful! Admission is now Paid.");
            loadPendingAdmissions();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to process payment");
        }
    };

    return (
        <div className="card shadow mb-4">
            <ToastContainer position="top-right" autoClose={2000} />
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
                                                    onClick={() => handlePayment(adm.admissionID)}
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
    );
}
