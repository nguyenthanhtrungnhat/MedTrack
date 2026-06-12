import { useEffect, useState } from "react";
import axios from "axios";
import { AppointmentProps } from "../interface";

export default function AllAppointment() {
    const doctorID = Number(sessionStorage.getItem("doctorID"));
    const [appointments, setAppointments] = useState<AppointmentProps[]>([]);
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        if (!doctorID) return;

        async function loadAppointments() {
            try {
                // ✅ NEW API (was check-overdue)
                await axios.put(
                    "http://localhost:3000/appointments/check-missed",
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const res = await axios.get(
                    `http://localhost:3000/appointments/all-appointment/doctor/${doctorID}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setAppointments(res.data);
            } catch (err) {
                console.error("Failed to load appointments:", err);
            }
        }

        loadAppointments();
    }, [doctorID]);

    // ======================================================
    // STATUS LOGIC (BASED ON NEW DATABASE DESIGN)
    // ======================================================
    const getAppointmentStatus = (dateTime: string, status: number) => {
        const today = new Date();
        const apptDate = new Date(dateTime);

        today.setHours(0, 0, 0, 0);
        apptDate.setHours(0, 0, 0, 0);

        // 1. DB-based statuses first (IMPORTANT)
        if (status === 1) return "Completed";
        if (status === 2) return "Missed";

        // 2. Date-based statuses
        if (apptDate.getTime() === today.getTime()) {
            return "Today";
        }

        if (apptDate > today) {
            return "Upcoming";
        }

        return "Missed";
    };

    const getRowClass = (label: string) => {
        switch (label) {
            case "Missed":
                return "bg-danger text-white";
            case "Completed":
                return "bg-success text-white";
            case "Today":
                return "bg-warning";
            case "Upcoming":
                return "bg-info text-white";
            default:
                return "";
        }
    };

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-header blueBg text-white">
                <h5 className="mb-0">Appointment List</h5>
            </div>

            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Patient</th>
                    </tr>
                </thead>

                <tbody>
                    {appointments.length > 0 ? (
                        appointments.map((a) => {
                            const statusLabel = getAppointmentStatus(
                                a.dateTime,
                                a.attendanceStatus
                            );

                            const rowClass = getRowClass(statusLabel);

                            return (
                                <tr key={a.appointmentID}>
                                    <td className={rowClass}>
                                        {a.appointmentID}
                                    </td>

                                    <td className={rowClass}>
                                        {new Date(a.dateTime).toLocaleDateString()}
                                    </td>

                                    <td className={rowClass}>
                                        {a.location || "-"}
                                    </td>

                                    <td className={rowClass}>
                                        {statusLabel}
                                    </td>

                                    <td className={rowClass}>
                                        {a.patientName}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center text-muted">
                                No appointments
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}