import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import getUserIDFromToken from "../components/getUserIDFromToken";
import Health from "../Health";

export default function SideBarLayoutV2() {

    const [info, setInfo] = useState<any>(null);
    const roleID = sessionStorage.getItem("roleID");
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const userID = getUserIDFromToken();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // Fetch basic user info
    useEffect(() => {
        if (!userID) return;

        axios
            .get(`http://localhost:3000/api/users/basic/${userID}`)
            .then((res) => {
                if (res && res.data) {
                    setInfo(res.data);
                    console.log("Info Sidebar:", res.data)
                }
            })
            .catch((err) => {
                console.error("Error fetching user info:", err);
            });

    }, [userID]);

    const handleLogout = () => {
        sessionStorage.clear();
        toast.success("Logged out successfully!", { position: "top-right" });
        navigate("/");
    };

    return (
        <>
            <Header />
            <div className='mainBg h-100'>
                <div className="container-fluid mt-5 pt-5">
                    <div className="row">

                        <div className="col-lg-9 order-2 order-lg-1">
                            <Outlet />
                        </div>

                        <div className="col-lg-3 order-1 order-lg-2">

                            <div className="leftBody border whiteBg marginBottom dropShadow">
                                <ToastContainer />
                                <h6 className='whiteText blueBg loginHead'>Account</h6>

                                <div className="padding">
                                    <p className='blueText'>{info?.phone}</p>
                                    <p className='blueText'>{info?.fullName}</p>

                                    <div className="d-flex justify-content-center marginBottom">
                                        <button
                                            type="button"
                                            className="btn btn-danger w-100"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>

                                {/* <SidebarLogin phone={info?.phone || ""} fullName={info?.fullName || ""} /> */}
                            </div>

                            <div className="leftBody border whiteBg dropShadow marginBottom">
                                <h6 className="whiteText blueBg featureHead">Feature</h6>

                                <div className="padding">

                                    {roleID == "1" && (
                                        <ul className='list-unstyled'>
                                            <li>
                                                <Link to="/doctor/allappointment" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Appointments
                                                </Link>
                                            </li>

                                            <li>
                                                <Link to="/doctor/allshiftrequest" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Shift Request
                                                </Link>
                                            </li>

                                            <li>
                                                <Link to="/doctor/testresultlist" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Test Result
                                                </Link>
                                            </li>

                                            <li>
                                                <Link to="/doctor/prescription-form" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Make prescription
                                                </Link>
                                            </li>

                                            <li>
                                                <Link to="/doctor/prescriptions" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Prescription List
                                                </Link>
                                            </li>
                                        </ul>
                                    )}

                                    {roleID == "2" && (
                                        <ul className='list-unstyled'>

                                            <li>
                                                <Link to="/home/shift-change" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Shift change registration
                                                </Link>
                                            </li>

                                            <li>
                                                <Link to="/home/daily-checking" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Daily checking health
                                                </Link>
                                            </li>

                                            <li>
                                                <Link to="/home/schedule" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Schedule
                                                </Link>
                                            </li>

                                        </ul>
                                    )}

                                </div>
                            </div>

                        </div>
                        <div className="col-lg-12 order-3 order-lg-3"> <Health /></div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}