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

    const userID = getUserIDFromToken();

    useEffect(() => {
        if (!userID) return;

        axios.put("http://localhost:3000/appointments/check-overdue")
            .then(() => loadAppointments())
            .catch(err => console.error(err));

        loadDoctors();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            axios.put("http://localhost:3000/appointments/check-overdue")
                .then(() => loadAppointments())
                .catch(err => console.error(err));
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    const loadDoctors = () => {
        axios.get("http://localhost:3000/doctors").then(res => setDoctors(res.data));
    };

    const loadAppointments = () => {
        axios.get(`http://localhost:3000/appointments/${userID}`).then(res => setAppointments(res.data));
    };

    const handleDoctorChange = (id: string) => {
        setDoctorID(Number(id));
        const doctor = doctors.find(d => d.doctorID == id);
        setLocation(doctor?.office ?? "");
    };

    const handleCreate = async () => {

        if (!doctorID || !dateTime) return toast.warning("Please select doctor and date!");

        //Prevent duplicate booking (Client Side)
        const duplicate = appointments.some(a =>
            a.doctorID === doctorID && a.dateTime === dateTime
        );
        if (duplicate) {
            return toast.error("You already booked this doctor on that date!");
        }

        try {
            await axios.post("http://localhost:3000/appointments", { doctorID, userID, dateTime, location });
            toast.success("Appointment booked successfully!");

            setDoctorID(null);
            setDateTime("");
            setLocation("");
            loadAppointments();
        } catch (err: any) {
            if (err.response?.status === 400) toast.error(err.response.data.message);
            else toast.error("Booking failed, try again!");
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <ToastContainer position="top-right" autoClose={2000} />

            <h2>Make Appointment</h2>

            <div className="card p-3 mb-4">
                <label><b>Doctor</b></label>
                <select className="form-control mb-3"
                    value={doctorID ?? ""}
                    onChange={(e) => handleDoctorChange(e.target.value)}>
                    <option value="">-- Select Doctor --</option>
                    {doctors.map(d => (
                        <option key={d.doctorID} value={d.doctorID}>
                            Dr. {d.fullName} — {d.department}
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

                <label><b>Location (Auto)</b></label>
                <input type="text" className="form-control mb-3" value={location} disabled />

                <button className="btn btn-success" onClick={handleCreate}>
                    Book Appointment
                </button>
            </div>

            <h4>Your Appointments</h4>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>#</th><th>Doctor</th><th>Date</th><th>Location</th><th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(a => (
                        <tr key={a.appointmentID} >
                            <td className={a.appointmentStatus ? 'bg-danger' : 'bg-success'}>{a.appointmentID}</td>
                            <td className={a.appointmentStatus ? 'bg-danger' : 'bg-success'}>{a.doctorName}</td>
                            <td className={a.appointmentStatus ? 'bg-danger' : 'bg-success'}>{a.dateTime}</td>
                            <td className={a.appointmentStatus ? 'bg-danger' : 'bg-success'}>{a.location}</td>
                            <td className={a.appointmentStatus ? 'bg-danger' : 'bg-success'}>
                                {a.appointmentStatus ? "Overdue" : "Coming"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
