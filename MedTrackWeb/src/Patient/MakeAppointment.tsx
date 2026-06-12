import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUserIDFromToken from "../components/getUserIDFromToken";

export default function MakeAppointment() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);

    const [doctorID, setDoctorID] = useState<number | null>(null);
    const [dateTime, setDateTime] = useState("");
    const [location, setLocation] = useState("");

    const token = sessionStorage.getItem("token");
    const userID = getUserIDFromToken();
    const role = sessionStorage.getItem("role"); // Nurse | Patient

    // ======================================================
    // LOAD DATA
    // ======================================================
    useEffect(() => {
        if (!userID) return;

        loadDoctors();
        loadAppointments();

        const interval = setInterval(() => {
            loadAppointments();
        }, 5000);

        return () => clearInterval(interval);
    }, [userID]);

    // ======================================================
    // API CALLS
    // ======================================================
    const loadDoctors = async () => {
        try {
            const res = await axios.get("http://localhost:3000/doctors", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(res.data);
        } catch {
            toast.error("Failed to load doctors");
        }
    };

    const loadAppointments = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3000/appointments/${userID}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAppointments(res.data);
        } catch {
            toast.error("Failed to load appointments");
        }
    };

    // ======================================================
    // DOCTOR CHANGE
    // ======================================================
    const handleDoctorChange = (id: string) => {
        const numId = Number(id);
        setDoctorID(numId);

        const doctor = doctors.find(d => d.doctorID === numId);
        setLocation(doctor?.office ?? "");
    };

    // ======================================================
    // CREATE APPOINTMENT (WITH TOAST)
    // ======================================================
    const handleCreate = async () => {
        if (!doctorID || !dateTime)
            return toast.warning("Please select doctor and date!");

        const duplicate = appointments.some(
            a => a.doctorID === doctorID && a.dateTime === dateTime
        );

        if (duplicate) {
            return toast.error("Already booked this doctor on that date!");
        }

        const loading = toast.loading("Booking appointment...");

        try {
            await axios.post(
                "http://localhost:3000/appointments",
                { doctorID, userID, dateTime, location },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.dismiss(loading);
            toast.success("Appointment booked successfully");

            setDoctorID(null);
            setDateTime("");
            setLocation("");

            await loadAppointments();
        } catch (err: any) {
            toast.dismiss(loading);
            toast.error(err.response?.data?.message || "Booking failed");
        }
    };

    // ======================================================
    // STATUS LOGIC
    // ======================================================
    const getStatus = (status: number) => {
        switch (status) {
            case 0:
                return "Incoming";
            case 1:
                return "Done";
            case 2:
                return "Missed";
            default:
                return "Unknown";
        }
    };

    const getBadgeClass = (status: number) => {
        switch (status) {
            case 0:
                return "bg-warning text-dark";
            case 1:
                return "bg-success";
            case 2:
                return "bg-danger";
            default:
                return "bg-secondary";
        }
    };

    // ======================================================
    // VIEW RULE (IMPORTANT FIX)
    // ======================================================
    const visibleAppointments =
        role === "Nurse"
            ? appointments
            : appointments; // Patient sees ALL

    // ======================================================
    // RENDER
    // ======================================================
    return (
        <div >
            <div className=" card shadow mb-4">
                <div className="card-header blueBg text-white ">
                    <h5>Make Appointment </h5>
                </div>
          
            {/* ================= FORM ================= */}
            <div className="card p-3 mb-4">

                <label><b>Doctor</b></label>
                <select
                    className="form-control mb-3"
                    value={doctorID ?? ""}
                    onChange={(e) => handleDoctorChange(e.target.value)}
                >
                    <option value="">-- Select Doctor --</option>
                    {doctors.map(d => (
                        <option key={d.doctorID} value={d.doctorID}>
                            Dr. {d.fullName}
                        </option>
                    ))}
                </select>

                <label><b>Date</b></label>
                <input
                    type="date"
                    className="form-control mb-3"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                />

                <label><b>Location</b></label>
                <input
                    type="text"
                    className="form-control mb-3"
                    value={location}
                    disabled
                />

                <button className="btn btn-success" onClick={handleCreate}>
                    Book Appointment
                </button>
            </div>
  </div>
            {/* ================= TABLE ================= */}
            <div className="card shadow mb-4">
                <div className="card-header blueBg text-white ">
                    <h5> Appointment </h5>
                </div>

                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {visibleAppointments.map(a => (
                            <tr key={a.appointmentID}>
                                <td>{a.appointmentID}</td>
                                <td>{a.doctorName}</td>
                                <td>{new Date(a.dateTime).toLocaleDateString()}</td>
                                <td>{a.location}</td>

                                {/* STATUS */}
                                <td>
                                    <span className={`badge ${getBadgeClass(a.attendanceStatus)}`}>
                                        {getStatus(a.attendanceStatus)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}