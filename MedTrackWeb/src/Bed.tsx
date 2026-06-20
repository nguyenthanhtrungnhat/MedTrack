import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import API from "./api";
export default function Bed(props: any) {
    const { bedID, bedNumber, status, patientID, fullName, image, CIC, HI, onAssignSuccess } = props;
    const navigate = useNavigate();
    const roleID = sessionStorage.getItem("roleID");
    const token = sessionStorage.getItem("token");

    const [showModal, setShowModal] = useState(false);
    const [paidAdmissions, setPaidAdmissions] = useState<any[]>([]);
    const [selectedAdmission, setSelectedAdmission] = useState("");

    const handleClick = () => {
        if (status === "In Use" && patientID) {
            if (roleID === "1") {
                navigate(`/doctor/bed-details/${patientID}`);
            } else {
                navigate(`/home/bed-details/${patientID}`);
            }
        }
    };

    const handleAssignClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (status === "Empty" && roleID === "2") {
            // Load paid admissions
            try {
                const res = await API.get("/admission/paid");
                setPaidAdmissions(res.data);
                setShowModal(true);
            } catch (err) {
                toast.error("Failed to load paid admissions");
            }
        }
    };

    const handleAssignSubmit = async () => {
        if (!selectedAdmission) return toast.warning("Please select a patient to assign.");
        const adm = paidAdmissions.find(a => a.admissionID.toString() === selectedAdmission);
        if (!adm) return;

        try {
            await API.put(`/rooms/beds/${bedID}/assign`, {
                patientID: adm.patientID,
                admissionID: adm.admissionID
            });
            toast.success(`Patient ${adm.fullName} assigned to bed ${bedNumber} successfully!`);
            setShowModal(false);
            if (onAssignSuccess) onAssignSuccess();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to assign patient");
        }
    };

    return (
        <div className="col-lg-4 marginBottom">
            <div className={`card room h-100 ${status === 'Empty' ? 'border-success' : status === 'Cleaning' ? 'border-warning' : ''}`} style={{ cursor: status === 'In Use' ? 'pointer' : 'default' }} onClick={handleClick}>
                <div className="card-body text-center d-flex flex-column justify-content-center">
                    <h5 className="card-title text-primary mb-3">Bed {bedNumber}</h5>
                    
                    {status === "In Use" ? (
                        <>
                            <img
                                src={image || "https://via.placeholder.com/120"}
                                alt={fullName}
                                className="rounded-circle mb-3 mx-auto"
                                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                            />
                            <h5 className="card-title">{fullName}</h5>
                            <p className="card-text mb-1"><strong>CIC:</strong> {CIC}</p>
                            <p className="card-text"><strong>HI:</strong> {HI}</p>
                            <h6 className="blueText text-center mt-auto">View Details</h6>
                        </>
                    ) : status === "Cleaning" ? (
                        <div className="text-warning">
                            <i className="fa fa-paint-brush fa-3x mb-3"></i>
                            <h4>Cleaning</h4>
                        </div>
                    ) : (
                        <div className="text-success">
                            <i className="fa fa-bed fa-3x mb-3"></i>
                            <h4>Empty</h4>
                            {roleID === "2" && (
                                <button className="btn btn-outline-success mt-3" onClick={handleAssignClick}>
                                    Assign Patient
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ASSIGN MODAL */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Assign Patient to {bedNumber}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <label>Select Paid Admission Patient</label>
                                <select className="form-select mt-2" value={selectedAdmission} onChange={e => setSelectedAdmission(e.target.value)}>
                                    <option value="">-- Select Patient --</option>
                                    {paidAdmissions.map(adm => (
                                        <option key={adm.admissionID} value={adm.admissionID}>
                                            {adm.fullName} (CIC: {adm.CIC || 'N/A'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                <button type="button" className="btn btn-success" onClick={handleAssignSubmit}>Assign</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}