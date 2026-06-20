import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { TestResultDetail } from "../interface";

export default function TestResultDetails() {
    const roleID = sessionStorage.getItem("roleID");
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] =
        useState<TestResultDetail | null>(null);

    const [loading, setLoading] = useState(true);

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        API
            .get(
                `/testresult/${id}`
            )
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, token]);

    if (loading) {
        return (
            <div className="text-center">
                Loading...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="alert alert-danger">
                Test Result Not Found
            </div>
        );
    }

    return (
        <div className="mb-3">
            <div className="card shadow-sm dropShadow mb-3 border-0">
                <div className="card-header blueBg text-white d-flex justify-content-between">
                    <h5 className="mb-0">
                        Test Result Detail
                    </h5>

                    <div>
                        {roleID === "1" && (
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                    navigate("/doctor/testresultlist")
                                }
                            >
                                Back
                            </button>
                        )}

                        {roleID === "2" && (
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                    navigate("/home/testresultlist")
                                }
                            >
                                Back
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-3 border-bottom bg-light">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <strong>Patient:</strong>
                            <br />
                            {data.patientName}
                        </div>

                        <div className="col-md-6">
                            <strong>CIC:</strong>
                            <br />
                            {data.patientCIC}
                        </div>
                        <div className="col-md-6">
                            <strong>Doctor:</strong>
                            <br />
                            {data.doctorName}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <strong>Code:</strong>
                            <br />
                            {data.testResultCode}
                        </div>

                        <div className="col-md-6">
                            <strong>Type:</strong>
                            <br />
                            {data.typeName}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <strong>Title:</strong>
                            <br />
                            {data.title}
                        </div>

                        <div className="col-md-6">
                            <strong>Date:</strong>
                            <br />
                            {new Date(
                                data.datetime
                            ).toLocaleString()}
                        </div>
                    </div>

                    {data.remarks && (
                        <div className="row mb-3">
                            <div className="col-12">
                                <strong>Remarks:</strong>
                                <br />
                                {data.remarks}
                            </div>
                        </div>
                    )}

                    <hr />
                </div>

                <div className="p-3">
                    <h5 className="mt-4">
                        Test Measurements
                    </h5>

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                <th>Result</th>
                                <th>Unit</th>
                                <th>Reference Range</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.items.length > 0 ? (
                                data.items.map((item) => (
                                    <tr key={item.itemID}>
                                        <td>
                                            {item.parameterName}
                                        </td>

                                        <td>
                                            {item.resultValue}
                                        </td>

                                        <td>
                                            {item.unit || "-"}
                                        </td>

                                        <td>
                                            {item.referenceRange || "-"}
                                        </td>

                                        <td>
                                            <span
                                                className={`badge ${item.abnormalFlag === "High"
                                                    ? "bg-danger"
                                                    : item.abnormalFlag === "Low"
                                                        ? "bg-warning text-dark"
                                                        : item.abnormalFlag === "Critical"
                                                            ? "bg-dark"
                                                            : "bg-success"
                                                    }`}
                                            >
                                                {item.abnormalFlag}
                                            </span>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center"
                                    >
                                        No measurements found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}