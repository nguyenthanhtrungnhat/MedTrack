import './css/AllDesign.css';
import Bed from './Bed';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { PatientProps } from './interface';
export default function BedsInRoom() {
    const { roomID } = useParams();
    const [beds, setBeds] = useState<any[]>([]);
    const token = sessionStorage.getItem("token");
    const url = `http://localhost:3000/rooms/${roomID}/beds`;
    
    useEffect(() => {
        loadBeds();
    }, [roomID]);

    const loadBeds = () => {
        axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setBeds(response.data);
                console.log("Beds Data:", response.data);
            })
            .catch(error => console.error("Error fetching patients:", error));
    };

    return (

        <div className="hasRoomList border padding whiteBg dropShadow marginBottom">
            <h2 className='blueText text-center marginBottom'>Bed list</h2>
            <div>
                <div className="row">
                    {beds.map(bed => <Bed key={bed.bedID} {...bed} onAssignSuccess={loadBeds} />)}
                </div>
            </div>
        </div>

    );
}
