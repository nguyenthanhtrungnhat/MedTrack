import { useEffect, useState } from "react";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";

interface Doctor {
    doctorID: number;
    fullName: string;
}

interface Appointment {
    appointmentID: number;
    dateTime: string;
    location: string;
    attendanceStatus: number;
    patientName: string;
}

export default function NurseAppointmentTracker() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [doctorID, setDoctorID] = useState<number | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    // ======================================================
    // LOAD DOCTORS
    // ======================================================
    useEffect(() => {
        API
            .get("/doctors")
            .then(res => setDoctors(res.data))
            .catch(() => toast.error("Failed to load doctors"));
    }, []);

    // ======================================================
    // LOAD APPOINTMENTS WHEN DOCTOR CHANGES
    // ======================================================
    useEffect(() => {
        if (!doctorID) return;

        loadAppointments();
    }, [doctorID]);

    const loadAppointments = async () => {
        try {
            const res = await API.get(
                `/appointments/all-appointment/doctor/${doctorID}`
            );
            setAppointments(res.data);
        } catch {
            toast.error("Failed to load appointments");
        }
    };

    // ======================================================
    // STATUS TEXT
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

    // ======================================================
    // UPDATE STATUS (CORE ACTION)
    // ======================================================
    const updateStatus = async (id: number, status: number) => {
    try {
        await API.put(
            `/appointments/check-in/${id}`,
            { status }
        );

        if (status === 1) {
            toast.success("Marked as Done");
        } else if (status === 2) {
            toast.success("Marked as Missed");
        } else {
            toast.info("Status updated");
        }

        loadAppointments();
    } catch {
        toast.error("Update failed");
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
    return (
        <div className="mb-4 dropShadow">
            <div className="card shadow">
                <div className="card-header blueBg text-white ">
                    <h5>Nurse Appointment Tracker</h5>
                </div>

                <div className="card-body">

                    {/* ======================================================
                        DOCTOR SELECT
                    ====================================================== */}
                    <div className="mb-3">
                        <label>Select Doctor</label>
                        <select
                            className="form-control"
                            onChange={(e) =>
                                setDoctorID(Number(e.target.value))
                            }
                        >
                            <option value="">-- Choose Doctor --</option>
                            {doctors.map((d) => (
                                <option key={d.doctorID} value={d.doctorID}>
                                    Dr. {d.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ======================================================
                        TABLE
                    ====================================================== */}
                    <table className="table table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Patient</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {appointments.map((a) => (
                                <tr key={a.appointmentID}>
                                    <td>{a.appointmentID}</td>
                                    <td>
                                        {new Date(a.dateTime).toLocaleDateString()}
                                    </td>
                                    <td>{a.patientName}</td>
                                    <td>{a.location}</td>
                                    <td>{getStatus(a.attendanceStatus)}</td>

                                    {/* ======================================================
                                        ACTION LOGIC
                                    ====================================================== */}
                                    <td>
                                        {a.attendanceStatus === 0 ? (
                                            <>
                                                <button
                                                    className="btn btn-success btn-sm me-2"
                                                    onClick={() =>
                                                        updateStatus(a.appointmentID, 1)
                                                    }
                                                >
                                                    Done
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        updateStatus(a.appointmentID, 2)
                                                    }
                                                >
                                                    Miss
                                                </button>
                                            </>
                                        ) : (
                                            <span className={`badge ${getBadgeClass(a.attendanceStatus)}`}>
                                                {getStatus(a.attendanceStatus)}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}