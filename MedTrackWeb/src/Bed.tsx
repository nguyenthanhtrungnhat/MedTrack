import { useNavigate } from "react-router-dom";
export default function Bed(props: any) {
    const { bedNumber, status, patientID, fullName, image, CIC, HI } = props;
    const navigate = useNavigate();
    const roleID = sessionStorage.getItem("roleID");


    const handleClick = () => {
        if (status === "In Use" && patientID) {
            if (roleID === "1") {
                navigate(`/doctor/bed-details/${patientID}`);
            } else {
                navigate(`/home/bed-details/${patientID}`);
            }
        }
    };



    return (
        <div className="col-lg-4 marginBottom">
            <div className={`card room h-100 ${status === 'Empty' ? 'border-success' : status === 'Cleaning' ? 'border-warning' : ''}`} style={{ cursor: status === 'In Use' ? 'pointer' : 'default' }} onClick={handleClick}>
                <div className="card-body text-center d-flex flex-column justify-content-center">
                    <h5 className="card-title text-primary mb-3">Bed {bedNumber}</h5>

                    {status === "In Use" ? (
                        <>
                            <img
                                src={image || "https://via.placeholder.com/120"}
                                alt={fullName}
                                className="rounded-circle mb-3 mx-auto"
                                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                            />
                            <h5 className="card-title">{fullName}</h5>
                            <p className="card-text mb-1"><strong>CIC:</strong> {CIC}</p>
                            <p className="card-text"><strong>HI:</strong> {HI}</p>
                            <h6 className="blueText text-center mt-auto">View Details</h6>
                        </>
                    ) : status === "Cleaning" ? (
                        <div className="text-warning">
                            <i className="fa fa-paint-brush fa-3x mb-3"></i>
                            <h4>Cleaning</h4>
                        </div>
                    ) : (
                        <div className="text-success">
                            <i className="fa fa-bed fa-3x mb-3"></i>
                            <h4>Empty</h4>

                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}