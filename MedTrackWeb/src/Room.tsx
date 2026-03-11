import { useNavigate } from "react-router-dom";
import { RoomProps } from "./interface";
import "./css/Room.css";

export default function Room({ department, roomID }: RoomProps) {
    const navigate = useNavigate();
    const roleID = sessionStorage.getItem("roleID");
    const handleClick = () => {
        { roleID == '1' ? (navigate(`/doctor/beds-in-room/${roomID}`)) : (navigate(`/home/beds-in-room/${roomID}`)) }
    };
    return (
        <>
            <div className="col-lg-4 col-sm-12 marginBottom">
                <button className="roomBtn" onClick={handleClick}>
                    <div className="card room">
                        <div className="card-body">
                            <h5 className="card-title">Room {roomID}</h5>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                            <h6 className='blueText text-center'>{department} Department</h6>
                        </div>
                    </div>
                </button>
            </div>
        </>
    )
}   