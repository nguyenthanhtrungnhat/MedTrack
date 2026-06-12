import { useNavigate } from "react-router-dom";
import { PatientProps } from "./interface";

export default function Bed({
    fullName,
    patientID,
    image,
    CIC,
    HI
}: PatientProps) {

    const navigate = useNavigate();
    const roleID = sessionStorage.getItem("roleID");

    const handleClick = () => {
        if (roleID === "1") {
            navigate(`/doctor/bed-details/${patientID}`);
        } else {
            navigate(`/home/bed-details/${patientID}`);
        }
    };

    return (
        <div className="col-lg-4 marginBottom">
            <button className="roomBtn" onClick={handleClick}>
                <div className="card room">
                    <div className="card-body text-center">

                        <img
                            src={image || "https://via.placeholder.com/120"}
                            alt={fullName}
                            className="rounded-circle mb-3"
                            style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover"
                            }}
                        />

                        <h5 className="card-title">
                            {fullName}
                        </h5>

                        <p className="card-text mb-1">
                            <strong>CIC:</strong> {CIC}
                        </p>

                        <p className="card-text">
                            <strong>HI:</strong> {HI}
                        </p>

                        <h6 className="blueText text-center">
                            View Patient Details
                        </h6>

                    </div>
                </div>
            </button>
        </div>
    );
}