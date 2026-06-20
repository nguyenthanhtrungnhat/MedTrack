import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import API from "../api";
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

        API
            .get(`/users/basic/${userID}`)
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
        toast.success("Logged out successfully!");
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
                                            <li>
                                                <Link to="/doctor/treatmenttimeline" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> TreatMent TimeLine
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/doctor/treatment" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> TreatMent DashBoard
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/doctor/assign-schedule" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Assign Schedule
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/doctor/doctor-order" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Create Test Order
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/doctor/admission-order" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Manage Admissions
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
                                                <Link to="/home/clinical-exam" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Clinical Exam
                                                </Link>
                                            </li>

                                            <li>
                                                <Link to="/home/testresultlist" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Test Result
                                                </Link>
                                            </li>

                                            <li>
                                                <Link to="/home/schedule" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Schedule
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/home/appointment-track" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Track Appointment
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/home/submit-test-result" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Submit Test Result
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/home/admission-management" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Admission Orders
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/home/discharge-management" className="text-decoration-none">
                                                    <i className="fa fa-caret-right"></i> Discharge Orders
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