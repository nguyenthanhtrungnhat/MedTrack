import { useEffect, useState } from "react";
import API from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUserIDFromToken from "../components/getUserIDFromToken";

export default function MakeAppointment() {
    const [departments, setDepartments] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);

    const [departmentID, setDepartmentID] = useState<number | null>(null);
    const [doctorID, setDoctorID] = useState<number | null>(null);

    const [dateTime, setDateTime] = useState("");
    const [location, setLocation] = useState("");

    const userID = getUserIDFromToken();
    // ======================================================
    // LOAD INITIAL DATA
    // ======================================================
    useEffect(() => {
        if (!userID) return;

        loadDepartments();
        loadDoctors();
        loadAppointments();

        const interval = setInterval(() => {
            loadAppointments();
        }, 5000);

        return () => clearInterval(interval);
    }, [userID]);

    // ======================================================
    // API
    // ======================================================
    const loadDepartments = async () => {
        try {
            const res = await API.get("/departments");
            setDepartments(res.data);
        } catch {
            toast.error("Failed to load departments");
        }
    };

    const loadDoctors = async () => {
        try {
            const res = await API.get("/doctors");
            setDoctors(res.data);
        } catch {
            toast.error("Failed to load doctors");
        }
    };

    const loadAppointments = async () => {
        try {
            const res = await API.get(
                `/appointments/${userID}`
            );
            setAppointments(res.data);
        } catch {
            toast.error("Failed to load appointments");
        }
    };

    // ======================================================
    // FILTER DOCTORS BY DEPARTMENT
    // ======================================================
    const filteredDoctors = departmentID
        ? doctors.filter(d => d.departmentID === departmentID)
        : [];

    // ======================================================
    // SELECT DOCTOR
    // ======================================================
    const handleDoctorChange = (id: string) => {
        const numId = Number(id);
        setDoctorID(numId);

        const doctor = doctors.find(d => d.doctorID === numId);
        setLocation(doctor?.office ?? "");
    };

    // ======================================================
    // CHANGE DEPARTMENT
    // ======================================================
    const handleDepartmentChange = (id: string) => {
        const numId = Number(id);
        setDepartmentID(numId);

        setDoctorID(null); // reset doctor when department changes
        setLocation("");
    };

    // ======================================================
    // CREATE APPOINTMENT
    // ======================================================
    const handleCreate = async () => {
        if (!departmentID || !doctorID || !dateTime)
            return toast.warning("Please select department, doctor and date!");

        const duplicate = appointments.some(
            a => a.doctorID === doctorID && a.dateTime === dateTime
        );

        if (duplicate) {
            return toast.error("Already booked this doctor on that date!");
        }

        const loading = toast.loading("Booking appointment...");

        try {
            await API.post(
                "/appointments",
                { doctorID, userID, dateTime, location }
            );

            toast.dismiss(loading);
            toast.success("Appointment booked successfully 🎉");

            setDepartmentID(null);
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
    // STATUS
    // ======================================================
    const getStatus = (status: number) => {
        switch (status) {
            case 0: return "Incoming";
            case 1: return "Done";
            case 2: return "Missed";
            default: return "Unknown";
        }
    };

    const getBadgeClass = (status: number) => {
        switch (status) {
            case 0: return "bg-warning text-dark";
            case 1: return "bg-success";
            case 2: return "bg-danger";
            default: return "bg-secondary";
        }
    };

    const visibleAppointments = appointments;

    // ======================================================
    // UI
    // ======================================================
    return (
        <div>
            <ToastContainer/>
            {/* ================= FORM ================= */}
            <div className="card shadow mb-4">
                <div className="card-header blueBg text-white">
                    <h5>Make Appointment</h5>
                </div>

                <div className="card p-3">

                    {/* DEPARTMENT */}
                    <label><b>Department</b></label>
                    <select
                        className="form-control mb-3"
                        value={departmentID ?? ""}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                    >
                        <option value="">-- Select Department --</option>
                        {departments.map(dep => (
                            <option key={dep.departmentID} value={dep.departmentID}>
                                {dep.departmentName}
                            </option>
                        ))}
                    </select>

                    {/* DOCTOR */}
                    <label><b>Doctor</b></label>
                    <select
                        className="form-control mb-3"
                        value={doctorID ?? ""}
                        onChange={(e) => handleDoctorChange(e.target.value)}
                        disabled={!departmentID}
                    >
                        <option value="">-- Select Doctor --</option>
                        {filteredDoctors.map(d => (
                            <option key={d.doctorID} value={d.doctorID}>
                                Dr. {d.fullName}
                            </option>
                        ))}
                    </select>

                    {/* DATE */}
                    <label><b>Date</b></label>
                    <input
                        type="date"
                        className="form-control mb-3"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                    />

                    {/* LOCATION */}
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
                <div className="card-header blueBg text-white">
                    <h5>Appointments</h5>
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