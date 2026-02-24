import axios from 'axios';
import Room from '../Room';
import './../AllDesign.css';
import NurseInformation from '../NurseInformation';
import { useEffect, useState } from 'react';
import { NurseProps, RoomProps } from '../interface';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import SidebarLogin from '../SidebarLogin';

const getUserIDFromToken = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded: any = jwtDecode(token);
        return decoded.userID; // Extract userID from token
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};

export default function NurseScreen() {
    const [user, setUser] = useState<NurseProps | null>(null);
    sessionStorage.setItem("info", JSON.stringify(user));
    const [rooms, setRooms] = useState<RoomProps[]>([]);
    const [nurseID, setNurseID] = useState<number | null>(null);
    sessionStorage.setItem("nurseID", JSON.stringify(nurseID));
    const userID = getUserIDFromToken();
    const url = `http://localhost:3000/nurses/by-user/${userID}`;
    const roomsUrl = 'http://localhost:3000/rooms';
    // const nurseID = sessionStorage.getItem("nurseID") || ""; // get nurseID
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!nurseID) {
            return;
        }

        const fetchCount = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/schedules/${nurseID}`);
                const data = res.data;
                if (Array.isArray(data)) {
                    setCount(data.length);
                } else {
                    setCount(0);
                }
            } catch (err: any) {
                setCount(0);
            }
        };

        fetchCount();
    }, [nurseID]);
    useEffect(() => {
        if (!userID) return;

        axios.get(url)
            .then(response => {
                setNurseID(response.data.nurseID);
                console.log("Nurse ID:", response.data.nurseID);
            })
            .catch(error => console.error("Error fetching nurseID:", error));
    }, [userID]);

    useEffect(() => {
        if (!nurseID) return;
        setLoading(true)
        axios.get(`http://localhost:3000/nurses/${nurseID}`)
            .then(response => {
                setUser(response.data);
                console.log("Nurse Data:", response.data);
            })
            .catch(error => console.error("Error fetching nurse:", error));

        axios.get(roomsUrl)
            .then(response => {
                setRooms(response.data);
                console.log("Room Data:", response.data);
            })
            .catch(error => console.error("Error fetching rooms:", error))
            .finally(() => setLoading(false)); // stop loading
    }, [nurseID]);

    if (!userID) {
        return <p>Please log in to view your nurse profile.</p>;
    }

    return (
        <div className='mainBg h-100'>
            <div className="container-fluid mt-5 pt-5">
                <div className="row">
                    <div className="col-lg-9 order-2 order-lg-1">

                        <div className="row">
                            {loading ? (
                                <NurseInformation
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
                                <NurseInformation
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
                                                <h5 className="medSche greenText mb-3">Assigned Task</h5>
                                                <div className="d-flex align-items-center mb-3">
                                                    <p className="size25 greenText mb-0 me-auto">{count}</p>
                                                    <i
                                                        className="fa fa-calendar size25 greenText"
                                                        aria-hidden="true"
                                                        style={{ marginLeft: "auto" }}
                                                    ></i>
                                                </div>
                                                <Link to="/home/schedule" className="greenText text-decoration-none">
                                                    More detail
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-sm-6 d-flex justify-content-center ">
                                            <div className="border border-info square170-250 padding20 d-flex flex-column justify-content-between">
                                                <h5 className="medSche blueText mb-3">Patient's requirements</h5>
                                                <div className="d-flex align-items-center mb-3">
                                                    <p className="size25 blueText mb-0 me-auto">0</p>
                                                    <i
                                                        className="fa fa-calendar size25 blueText"
                                                        aria-hidden="true"
                                                        style={{ marginLeft: "auto" }}
                                                    ></i>
                                                </div>
                                                <a href="#" className="blueText text-decoration-none">
                                                    More detail
                                                </a>
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
                    </div>
                    <div className="col-lg-3 order-1 order-lg-2">
                        <div className="leftBody border whiteBg marginBottom dropShadow">
                            <div className="row">
                                <div className="col-12 login">

                                    <SidebarLogin
                                        phone={user?.phone} fullName={user?.fullName}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="leftBody border whiteBg dropShadow marginBottom">
                            <div className="row">
                                <div className="col-12">
                                    <h6 className='whiteText blueBg featureHead'>Feature</h6>
                                    <div className="padding">
                                        <ul className='list-unstyled'>
                                            <li>
                                                <Link to="/home/shift-change" className="text-decoration-none">
                                                    <i className="fa fa-caret-right" aria-hidden="true"></i> Shift change registration
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/home/daily-checking" className="text-decoration-none">
                                                    <i className="fa fa-caret-right" aria-hidden="true"></i> Daily checking health
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/home/schedule" className="text-decoration-none">
                                                    <i className="fa fa-caret-right" aria-hidden="true"></i> Schedule
                                                </Link>
                                            </li>
                                           
                                            {/* <li>
                                                <Link to="/home/dashboard" className="text-decoration-none">
                                                    <i className="fa fa-caret-right" aria-hidden="true"></i> DashBoard
                                                </Link>
                                            </li> */}
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
