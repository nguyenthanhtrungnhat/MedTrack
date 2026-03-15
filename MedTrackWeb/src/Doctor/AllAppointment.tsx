import { useEffect, useState } from "react";
import axios from "axios";
import { AppointmentProps } from "../interface";

export default function AllAppointment() {
    const doctorID = Number(sessionStorage.getItem("doctorID"));
    const [appointments, setAppointments] = useState<AppointmentProps[]>([]);

    useEffect(() => {
        if (!doctorID) return;

        async function loadAppointments() {
            try {
                // STEP 1 → Update overdue first
                await axios.put("https://projectb-medtrack.onrender.com/appointments/check-overdue");

                // STEP 2 → Fetch appointments again after update
                const res = await axios.get(`https://projectb-medtrack.onrender.com/api/all-appointment/doctor/${doctorID}`);
                setAppointments(res.data);
            } catch (err) {
                console.error("Failed to update or load appointments:", err);
            }
        }

        loadAppointments();
    }, [doctorID]);

    return (
        <div className="card shadow-sm">
            <div className="card-header blueBg text-white">
                <h5 className="mb-0">Appointment List</h5>
            </div>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>#</th><th>Date</th><th>Location</th><th>Status</th><th>Patient</th>
                    </tr>
                </thead>

                <tbody>
                    {appointments.length > 0 ? (
                        appointments.map(a => (
                            <tr key={a.appointmentID}>
                                <td className={a.appointmentStatus ? "bg-danger" : "bg-success"}>
                                    {a.appointmentID}
                                </td>

                                <td className={a.appointmentStatus ? "bg-danger" : "bg-success"}>
                                    {new Date(a.dateTime).toLocaleDateString()}
                                </td>

                                <td className={a.appointmentStatus ? "bg-danger" : "bg-success"}>
                                    {a.location || "-"}
                                </td>

                                <td className={a.appointmentStatus ? "bg-danger" : "bg-success"}>
                                    {a.appointmentStatus === 1 ? "Overdue" : "Coming"}
                                </td>

                                <td className={a.appointmentStatus ? "bg-danger" : "bg-success"}>
                                    {a.patientName}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={5} className="text-center text-muted">No appointments</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
