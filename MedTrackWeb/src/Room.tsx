import { useNavigate } from "react-router-dom";
import { RoomProps } from "./interface";
import "./css/Room.css";

export default function Room({
    departmentName,
    roomID,
    location
}: RoomProps) {
    const navigate = useNavigate();
    const roleID = sessionStorage.getItem("roleID");

    const handleClick = () => {
        if (roleID === "1") {
            navigate(`/doctor/beds-in-room/${roomID}`);
        } else {
            navigate(`/home/beds-in-room/${roomID}`);
        }
    };

    return (
        <div className="col-lg-4 col-sm-12 marginBottom">
            <button className="roomBtn" onClick={handleClick}>
                <div className="card room">
                    <div className="card-body">
                        <h5 className="card-title">
                            Room {location}
                        </h5>

                        <p className="card-text">
                            Patient management and monitoring
                        </p>

                        <h6 className="blueText text-center">
                            Department: {departmentName} 
                        </h6>
                    </div>
                </div>
            </button>
        </div>
    );
}