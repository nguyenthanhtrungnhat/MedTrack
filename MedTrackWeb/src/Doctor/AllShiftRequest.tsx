import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ScheduleRequest } from "../interface";

export default function AllShiftRequest() {
    const doctorID = Number(sessionStorage.getItem("doctorID"));

    const [requests, setRequests] = useState<ScheduleRequest[]>([]);

    useEffect(() => {
        if (!doctorID) return;
        fetchRequests();
    }, [doctorID]);

    const fetchRequests = () => {
        axios
            .get<ScheduleRequest[]>(`http://localhost:3000/schedulerequest`)
            .then(res => setRequests(res.data))
            .catch(err => console.error("Failed to load requests:", err));
    };

    // Unified function for approve/reject
    const handleStatusChange = (requestID: number, status: 1 | 2) => {
        axios
            .patch(`http://localhost:3000/schedule-request/${requestID}/status`, { status })
            .then(res => {
                toast.success(res.data.message);
                fetchRequests(); // reload table
            })
            .catch(err => {
                toast.error("Failed to update request");
                console.error(err);
            });
    };

    return (
        <div className="card shadow-sm">
            <div className="card-header blueBg text-white">
                <h5 className="mb-0">Shift Request</h5>
            </div>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Schedule ID</th>
                            <th>Reason</th>
                            <th>New Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center">No requests found</td>
                            </tr>
                        )}
                        {requests.map((r: ScheduleRequest) => (
                            <tr key={r.requestID}>
                                <td>{r.requestID}</td>
                                <td>{r.scheduleID}</td>
                                <td>{r.reason || "-"}</td>
                                <td>{r.newDate || "-"}</td>
                                <td>
                                    {r.status === 0 ? "Pending" : r.status === 1 ? "Approved" : "Rejected"}
                                </td>
                                <td>
                                    {r.status === 0 && (
                                        <>
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() => handleStatusChange(r.requestID, 1)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleStatusChange(r.requestID, 2)}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
