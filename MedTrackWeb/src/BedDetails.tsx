import axios from 'axios';
import './css/AllDesign.css';
import PatientInformation from './PatientInformation';
import { useEffect, useState } from 'react';
import { PatientProps } from './interface';
import { Link, useParams } from 'react-router-dom';
import SidebarLogin from './SidebarLogin';
import Health from './Health';

export default function BedDetails() {
    const [user, setUser] = useState<PatientProps | null>(null);
    const { patientID } = useParams();
    const storedInfo = sessionStorage.getItem("info");
    const info = storedInfo ? JSON.parse(storedInfo) : null;
    const patientByIdUrl = `http://localhost:3000/patients/${patientID}`;
    const [loading, setLoading] = useState(true);
    const roleID = sessionStorage.getItem("roleID");
    useEffect(() => {
        if (!patientID) return;
        setLoading(true); // start loading
        axios.get(patientByIdUrl)
            .then(response => setUser(response.data))
            .catch(error => console.error('Error fetching user:', error))
            .finally(() => setLoading(false)); // stop loading
    }, [patientByIdUrl]);
    return (

        <div className="row align-items-stretch">
            {/* Left column */}
            <div className="col-lg-6 col-sm-12 d-flex">
                <div className="w-100 d-flex flex-column border whiteBg marginBottom dropShadow p-3">

                    {loading ? (
                        <PatientInformation
                            patientID={user?.patientID}
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
                            HI={user?.HI || ""}
                            admissionDate={user?.admissionDate?.split("T")[0] || ""}
                            relativeName={user?.relativeName || ""}
                            relativeNumber={Number(user?.relativeNumber) || ""}
                            loading={loading}
                        />

                    ) : (
                        <PatientInformation
                            patientID={user?.patientID}
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
                            HI={user?.HI || ""}
                            admissionDate={user?.admissionDate?.split("T")[0] || ""}
                            relativeName={user?.relativeName || ""}
                            relativeNumber={Number(user?.relativeNumber) || ""}
                            loading={loading}
                        />
                    )}
                </div>
            </div>

            {/* Right column */}
            <div className="col-lg-6 col-sm-12 d-flex">
                <div className="w-100 d-flex flex-column border whiteBg marginBottom dropShadow p-3">
                    <h5 className="blueText">Diagnose</h5>

                    <p className="blueText">Hospitalization diagnosis:</p>
                    {user?.hospitalizationsDiagnosis ? (
                        <p>{user.hospitalizationsDiagnosis}</p>
                    ) : (
                        <p className="placeholder-glow">
                            <span className="placeholder col-8"></span>
                        </p>
                    )}

                    <p className="blueText">Summary of disease process:</p>
                    {user?.summaryCondition ? (
                        <p>{user.summaryCondition}</p>
                    ) : (
                        <p className="placeholder-glow">
                            <span className="placeholder col-10"></span>
                        </p>
                    )}

                    <p className="blueText">Discharge diagnosis:</p>
                    {user?.dischargeDiagnosis ? (
                        <p>{user.dischargeDiagnosis}</p>
                    ) : (
                        <p className="placeholder-glow">
                            <span className="placeholder col-6"></span>
                        </p>
                    )}
                </div>
            </div>



            {/* <Health /> */}
        </div>
    );
}
