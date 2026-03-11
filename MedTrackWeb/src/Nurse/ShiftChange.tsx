import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "../css/AllDesign.css";
import SidebarLogin from "../SidebarLogin";

export default function ShiftChange() {

    const storedInfo = sessionStorage.getItem("info");
    const info = storedInfo ? JSON.parse(storedInfo) : null;
    const nurseID = sessionStorage.getItem("nurseID");

    const [schedules, setSchedules] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [selectedScheduleID, setSelectedScheduleID] = useState("");
    const [expectedDate, setExpectedDate] = useState("");
    const [reason, setReason] = useState("");


    // ================= LOAD SCHEDULE + REQUESTS =================
    useEffect(() => {
        if (!nurseID) return;

        axios.get(`http://localhost:3000/api/schedules/${nurseID}`)
            .then(res => setSchedules(res.data))
            .catch(err => console.error(err));

        fetchRequests();
    }, [nurseID]);


    const fetchRequests = () => {
        axios.get(`http://localhost:3000/status/${nurseID}`)
            .then(res => setRequests(res.data))
            .catch(() => toast.error("Failed to load requests"));
    };


    // ================= SUBMIT SHIFT CHANGE =================
    const submitRequest = () => {
        if (!selectedScheduleID || !expectedDate || !reason)
            return toast.warn("⚠ Please fill all fields!");

        axios.post("http://localhost:3000/request", {
            scheduleID: Number(selectedScheduleID),
            newDate: expectedDate,
            reason: reason
        })
            .then(() => {
                toast.success("✔ Request submitted!");
                setReason("");
                setExpectedDate("");
                setSelectedScheduleID("");
                fetchRequests();
            })
            .catch(() => toast.error("❌ Submit failed"));
    };


    return (
        <div className=" radius10 shadow-sm mb-3">
            <div className="p-3 radius10b0 blueBg text-white">
                <h5 className="mb-0">Your schedule</h5>
            </div>
            <div className="p-4 whiteBg shadow-sm mb-3">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Start at</th>
                            <th>Working Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map(s => (
                            <tr key={s.scheduleID}>
                                <td>{s.scheduleID}</td>
                                <td>{s.date}</td>
                                <td>{s.start_at}</td>
                                <td>{s.working_hours}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-3 radius10b0 blueBg text-white">
                <h5 className="mb-0">Your Request</h5>
            </div>
            <div className="p-4 whiteBg mb-3">
                <table className="table table-bordered table-striped mt-3">
                    <thead>
                        <tr>
                            <th>Old Date</th>
                            <th>New Date</th>
                            <th>Start</th>
                            <th>Hours</th>
                            <th>Reason</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 && (
                            <tr><td colSpan={6} className="text-center text-muted">No requests found</td></tr>
                        )}
                        {requests.map(r => (
                            <tr key={r.requestID}>
                                <td>{r.oldDate}</td>
                                <td>{r.newDate}</td>
                                <td>{r.start_at}</td>
                                <td>{r.working_hours}</td>
                                <td>{r.reason}</td>
                                <td>
                                    {r.status === 0 && <span className="text-warning fw-bold">Pending</span>}
                                    {r.status === 1 && <span className="text-success fw-bold">Approved</span>}
                                    {r.status === 2 && <span className="text-danger fw-bold">Rejected</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* ================= REQUEST FORM ================= */}
            <div className="radius10 shadow-sm mb-3">
                <div className="p-3 radius10b0 blueBg text-white">
                    <h5 className="mb-0">Shift request</h5>
                </div>
                <div className="p-4 whiteBg shadow-sm mb-3">
                    <form>
                        <label>Select Schedule</label>
                        <select
                            className="form-select"
                            value={selectedScheduleID}
                            onChange={(e) => setSelectedScheduleID(e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            {schedules.map(s => (
                                <option key={s.scheduleID} value={s.scheduleID}>
                                    #{s.scheduleID} • {s.date} • {s.start_at}
                                </option>
                            ))}
                        </select>

                        <label className="mt-3">Expected New Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={expectedDate}
                            onChange={(e) => setExpectedDate(e.target.value)}
                        />

                        <label className="mt-3">Reason</label>
                        <textarea
                            className="form-control"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Name - Reason"
                        ></textarea>

                        <button
                            type="button"
                            className="btn btn-success w-100 mt-3"
                            onClick={submitRequest}
                        >
                            Submit Request
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
}
