import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TestResultDetail } from "../interface";

export default function TestResultDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] =
        useState<TestResultDetail | null>(null);

    const [loading, setLoading] = useState(true);

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        axios
            .get(
                `http://localhost:3000/testresult/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
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
    }, [id]);

    if (loading)
        return <div className="text-center">Loading...</div>;

    if (!data)
        return (
            <div className="alert alert-danger">
                Test Result Not Found
            </div>
        );

    return (
        <div className="mb-3">
            <div className="card shadow-sm dropShadow mb-3 border-0">
                <div className="card-header blueBg text-white d-flex justify-content-between">
                    <h5 className="mb-0">Test Result Detail</h5>
                    <div>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate("/doctor/testresultlist")}
                        >
                            Back
                        </button>
                    </div>
                </div>

                <div className="p-3 border-bottom bg-light">

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <strong>Patient:</strong>
                            <br />
                            {data.username}
                        </div>

                        <div className="col-md-6">
                            <strong>Code:</strong>
                            <br />
                            {data.testResultCode}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <strong>Title:</strong>
                            <br />
                            {data.title}
                        </div>

                        <div className="col-md-6">
                            <strong>Type:</strong>
                            <br />
                            {data.typeName}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <strong>Status:</strong>
                            <br />
                            {data.status}
                        </div>

                        <div className="col-md-6">
                            <strong>Date:</strong>
                            <br />
                            {new Date(
                                data.datetime
                            ).toLocaleString()}
                        </div>
                    </div>

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
                                <th>Reference</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.items.map(item => (
                                <tr key={item.itemID}>
                                    <td>{item.parameterName}</td>

                                    <td>{item.resultValue}</td>

                                    <td>{item.unit}</td>

                                    <td>{item.referenceRange}</td>

                                    <td>
                                        <span
                                            className={`badge ${item.abnormalFlag === "High"
                                                ? "bg-danger"
                                                : item.abnormalFlag === "Low"
                                                    ? "bg-warning"
                                                    : "bg-success"
                                                }`}
                                        >
                                            {item.abnormalFlag}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}