import './AllDesign.css';
import Bed from './Bed';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { PatientProps } from './interface';
import SidebarLogin from './SidebarLogin';
export default function BedsInRoom() {
    const storedInfo = sessionStorage.getItem("info");
    const info = storedInfo ? JSON.parse(storedInfo) : null;
    const { roomID } = useParams();
    const [patients, setPatients] = useState<PatientProps[]>([]);
    const url = `http://localhost:3000/rooms/${roomID}/patients`;
    useEffect(() => {
        axios.get(url)
            .then(response => {
                setPatients(response.data);
                console.log("Patient Data:", response.data);
            })
            .catch(error => console.error("Error fetching patients:", error));
    }, [roomID]);
    const roleID = sessionStorage.getItem("roleID");
    return (
        <div >
            <div className="container-fluid mt-5 pt-5 vh-100">
                <div className="row">
                    <div className="col-lg-9 order-2 order-lg-1">
                        <div className="hasRoomList border padding whiteBg dropShadow marginBottom">
                            {patients.length == 0 ?
                                (
                                    <>
                                        <h2 className='greenText text-center marginBottom'>Empty bed</h2>
                                        <div>
                                            <div className="row">
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h2 className='blueText text-center marginBottom'>Bed list</h2>
                                        <div>
                                            <div className="row">
                                                {patients.map(patient => <Bed key={patient.patientID} {...patient} />)}
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                    <div className="col-lg-3 order-1 order-lg-2">
                        <div className="leftBody border whiteBg marginBottom dropShadow">
                            <div className="row">
                                <div className="col-12 login ">
                                    <SidebarLogin
                                        phone={info?.phone || ""}
                                        fullName={info?.fullName || ""}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="leftBody  border whiteBg dropShadow marginBottom">
                            <div className="row">
                                <div className="col-12">
                                    <h6 className='whiteText blueBg featureHead'>Feature</h6>
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
                                                <li>
                                                    <Link to="/home/testresultlist" className="text-decoration-none">
                                                        <i className="fa fa-caret-right" aria-hidden="true"></i> Test Result
                                                    </Link>
                                                </li>
                                            </ul>
                                        )}
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
