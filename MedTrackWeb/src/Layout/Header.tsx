import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // fixed import syntax
import logo from "../images/logo.webp";
import { Link } from "react-router-dom";
import PatientSearch from "../components/search/PatientSearch";
import Noti from "../Noti";

const getUserRoleFromToken = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded: any = jwtDecode(token);
        return decoded.roleID; // Extract roleID from token
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};

export default function Header() {
    const [roleID, setRoleID] = useState<number | null>(null);
    const token = sessionStorage.getItem("token");
    useEffect(() => {
        const role = getUserRoleFromToken();
        setRoleID(role);
        sessionStorage.setItem("roleID", role)
    }, []);

    return (
        <header className="header dropShadow fixed-top ">

            <nav className="p-3 navbar navbar-expand-lg custom-navbar navbar-dark">
                <div className="container-fluid">
                    <img src={logo} className="logo" alt="MedTrack Logo" />
                    <Link className="navbar-brand" to={"#"}>
                        <h4 className="whiteText m-0">MedTrack</h4>
                    </Link>
                    <button className="navbar-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon "></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {roleID === 1 ? ( // Doctor
                            <>
                                <ul className="navbar-nav me-auto mb-lg-0">
                                    <li className="nav-item">
                                        <Link className="nav-link active" to={"/doctor"}>
                                            <h5 className="whiteText hasHomeIcon m-0">Home</h5>
                                            <span className="sr-only">(current)</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link whiteText" to={"/doctor/doctor-profile"}>
                                            <h5 className="whiteText hasProfileIcon m-0">Profile</h5>
                                        </Link>
                                    </li>
                                    <Noti />
                                    <li className="nav-item">
                                        <Link className="nav-link whiteText" to={"/doctor/medicine-list"}>
                                            <h5 className="whiteText capsuleIcon m-0">Medicine List</h5>
                                        </Link>
                                    </li>

                                </ul>
                                <form className="d-flex" role="search">
                                    <PatientSearch />

                                </form>
                            </>
                        ) : roleID === 2 ? ( // Nurse
                            <>
                                <ul className="navbar-nav me-auto mb-lg-0">
                                    <li className="nav-item">
                                        <Link className="nav-link active" to={"/"}>
                                            <h5 className="whiteText hasHomeIcon m-0">Home</h5>
                                            <span className="sr-only">(current)</span>
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link className="nav-link whiteText" to={"/home/nurse-profile"}>
                                            <h5 className="whiteText hasProfileIcon m-0">Profile</h5>
                                        </Link>
                                    </li>
                                    <Noti />
                                </ul>

                                <form className="" role="search">
                                    <PatientSearch />
                                </form>
                            </>
                        ) : roleID === 3 ? ( // Patient
                            <ul className="navbar-nav me-auto mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link active" to={"/patient"}>
                                        <h5 className="whiteText hasHomeIcon m-0">Home</h5>
                                        <span className="sr-only">(current)</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link whiteText" to={"/services"}>
                                        <h5 className="whiteText hasFeeIcon m-0">Medical Service fee</h5>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link whiteText" to={"/hservices"}>
                                        <h5 className="whiteText hasServiceIcon m-0">Service</h5>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link whiteText" to={"/patient/patient-profile"}>
                                        <h5 className="whiteText hasProfileIcon m-0">Profile</h5>
                                    </Link>
                                </li>
                                <Noti />
                            </ul>
                        ) : null}
                        {!token && (
                            <ul className="navbar-nav me-auto mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link active" to={"/"}>
                                        <h5 className="whiteText hasHomeIcon m-0">Home</h5>
                                        <span className="sr-only">(current)</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link whiteText" to={"/services"}>
                                        <h5 className="whiteText hasFeeIcon m-0">Hospital fee</h5>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link whiteText" to={"/hservices"}>
                                        <h5 className="whiteText hasServiceIcon m-0">Service</h5>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link whiteText" to={"/login"}>
                                        <h5 className="whiteText hasProfileIcon m-0">Login</h5>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

            </nav>
        </header >
    );
}
