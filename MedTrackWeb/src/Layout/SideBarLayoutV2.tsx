import { Link, Outlet, useLocation } from "react-router-dom";
import SidebarLogin from "../SidebarLogin";
import Header from "./Header";
import Footer from "./Footer";
import Health from "../Health";
import { useEffect } from "react";

export default function SideBarLayoutV2() {
    const storedInfo = sessionStorage.getItem("info");
    const info = storedInfo ? JSON.parse(storedInfo) : null;
    const roleID = sessionStorage.getItem("roleID");
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
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
                                <SidebarLogin phone={info?.phone || ""} fullName={info?.fullName || ""} />
                            </div>
                            <div className="leftBody border whiteBg dropShadow marginBottom">
                                <h6 className="whiteText blueBg featureHead">Feature</h6>
                                <div className="padding">
                                    {roleID == "1" && (
                                        <ul className='list-unstyled'>
                                            <li>
                                                <Link to="/doctor/allappointment" className="text-decoration-none">
                                                    <i className="fa fa-caret-right" aria-hidden="true"></i> Appointments
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/doctor/allshiftrequest" className="text-decoration-none">
                                                    <i className="fa fa-caret-right" aria-hidden="true"></i> Shift Request
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/doctor/testresultlist" className="text-decoration-none">
                                                    <i className="fa fa-caret-right" aria-hidden="true"></i> Test Result
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/doctor/prescription-form" className="text-decoration-none">
                                                    <i className="fa fa-caret-right" aria-hidden="true"></i> Make prescription
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/doctor/prescriptions" className="text-decoration-none">
                                                    <i className="fa fa-caret-right" aria-hidden="true"></i> Prescription List
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                    {roleID == "2" && (
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


    )
}