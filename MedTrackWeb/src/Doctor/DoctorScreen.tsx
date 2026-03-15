import { Link } from "react-router-dom";
import { NurseProps, RoomProps } from "../interface";
import { useEffect, useState } from "react";
import Room from "../Room";
import axios from "axios";
import DoctorInformation from "../DoctorInformation";
import getUserIDFromToken from "../components/getUserIDFromToken";

export default function DoctorScreen() {
        const [user, setUser] = useState<NurseProps | null>(null);
    sessionStorage.setItem("info", JSON.stringify(user));
    const [rooms, setRooms] = useState<RoomProps[]>([]);
    const [doctorID, setDoctorID] = useState<number | null>(null);
    sessionStorage.setItem("doctorID", JSON.stringify(doctorID));
    const userID = getUserIDFromToken();
    const url = `https://projectb-medtrack.onrender.com/doctors/by-user/${userID}`;
    const roomsUrl = 'https://projectb-medtrack.onrender.com/rooms';
    // const nurseID = sessionStorage.getItem("nurseID") || ""; // get nurseID
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!doctorID) {
            return;
        }

        const fetchCount = async () => {
            try {
                const res = await axios.get(`https://projectb-medtrack.onrender.com/api/appointment/doctor/${doctorID}`);
                setCount(Array.isArray(res.data) ? res.data.length : 0);
            } catch (err) {
                console.error("Error fetching appointment count:", err);
                setCount(0);
            }
        };


        fetchCount();
    }, [doctorID]);
    useEffect(() => {
        if (!userID) return;

        axios.get(url)
            .then(response => {
                setDoctorID(response.data.doctorID);
                console.log("Doctor ID:", response.data.doctorID);
            })
            .catch(error => console.error("Error fetching doctorID:", error));
    }, [userID]);

    useEffect(() => {
        if (!doctorID) return;
        setLoading(true)
        axios.get(`https://projectb-medtrack.onrender.com/doctors/${doctorID}`)
            .then(response => {
                setUser(response.data);
                console.log("Doctor Data:", response.data);
            })
            .catch(error => console.error("Error fetching doctor:", error));

        axios.get(roomsUrl)
            .then(response => {
                setRooms(response.data);
                console.log("Room Data:", response.data);
            })
            .catch(error => console.error("Error fetching rooms:", error))
            .finally(() => setLoading(false)); // stop loading
    }, [doctorID]);

    const [pendingShiftRequestCount, setPendingShiftRequestCount] = useState<number>(0);

    useEffect(() => {
        axios.get("https://projectb-medtrack.onrender.com/schedule-request/pending/count")
            .then(res => setPendingShiftRequestCount(res.data.count))
            .catch(err => console.error("Error fetching pending shift request count:", err));
    }, []);

    if (!userID) {
        return <p>Please log in to view your nurse profile.</p>;
    }

    return (
        <div className="row">
            {loading ? (
                <DoctorInformation
                    nurseID={String(user?.nurseID)}
                    image={user?.image || ""}
                    fullName={user?.fullName || ""}
                    gender={
                        user?.gender == "1"
                            ? "Male"
                            : user?.gender == "2"
                                ? "Female"
                                : ""
                    }
                    dob={user?.dob?.split("T")[0] || ""}
                    phone={user?.phone || ""}
                    CIC={Number(user?.CIC)}
                    address={user?.address || ""}
                    email={user?.email || ""}
                    loading={loading}
                />
            ) : (
                <DoctorInformation
                    nurseID={String(user?.nurseID)}
                    image={user?.image || ""}
                    fullName={user?.fullName || ""}
                    gender={
                        user?.gender == "1"
                            ? "Male"
                            : user?.gender == "2"
                                ? "Female"
                                : ""
                    }
                    dob={user?.dob?.split("T")[0] || ""}
                    phone={user?.phone || ""}
                    CIC={Number(user?.CIC)}
                    address={user?.address || ""}
                    email={user?.email || ""}
                    loading={loading}
                />
            )}
            <div className="col-lg-6 col-sm-12 ">
                <div className="hasSchedule padding border whiteBg marginBottom dropShadow">
                    <div className="row">
                        <div className="col-12 medicineSchedule padding50">
                            <h5 className='blueText medSche'>Medicine schedule</h5>
                            <div className="d-flex bd-highlight mb-3">
                                <p className='p-2 bd-highlight size50'>0</p>
                                <i className="ml-auto p-2 bd-highlight fa fa-bell-o blueText size50" aria-hidden="true"></i>
                            </div>
                            <a href="">More detail</a>
                        </div>
                    </div>
                </div>
                <div className="hasSchedule padding border whiteBg dropShadow">
                    <div className="row medicineScheduleDetail">
                        <div className="col-lg-6 col-sm-6 d-flex justify-content-center mb-2">
                            <div className="border border-success square170-250 padding20 d-flex flex-column justify-content-between">
                                <h5 className="medSche greenText mb-3">Today appointment</h5>
                                <div className="d-flex align-items-center mb-3">
                                    <p className="size25 greenText mb-0 me-auto">{count}</p>
                                    <i
                                        className="fa fa-calendar size25 greenText"
                                        aria-hidden="true"
                                        style={{ marginLeft: "auto" }}
                                    ></i>
                                </div>
                                <Link to="/doctor/allappointment" className="greenText text-decoration-none">
                                    More detail
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 d-flex justify-content-center ">
                            <div className="border border-info square170-250 padding20 d-flex flex-column justify-content-between">
                                <h5 className="medSche blueText mb-3">Nurse's requirements</h5>
                                <div className="d-flex align-items-center mb-3">
                                    <p className="size25 blueText mb-0 me-auto">{pendingShiftRequestCount}</p>
                                    <i
                                        className="fa fa-calendar size25 blueText"
                                        aria-hidden="true"
                                        style={{ marginLeft: "auto" }}
                                    ></i>
                                </div>

                                <Link to="/doctor/allshiftrequest" className="greenText text-decoration-none">
                                    More detail
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 padding">
                <div className="hasRoomList border padding whiteBg dropShadow">
                    <h2 className='blueText text-center marginBottom'>Room list</h2>
                    <div>

                        <div className="row">
                            {rooms.map((room) => (
                                <Room key={room.roomID} {...room} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
