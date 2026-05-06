import './css/AllDesign.css';
import Bed from './Bed';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { PatientProps } from './interface';
export default function BedsInRoom() {
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

    return (

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

    );
}
