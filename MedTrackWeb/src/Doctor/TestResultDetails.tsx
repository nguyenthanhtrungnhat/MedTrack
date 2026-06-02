import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

type TestResultDetail = {
    testResultID: number;
    userID: number;
    username: string;

    title: string;
    datetime: string;
    testResultCode: string;
    status: string;
    type: string;

    bloodGlucose?: number;
    HbA1c?: number;
    totalCholesterol?: number;
    hdlCholesterol?: number;
    ldlCholesterol?: number;
};

export default function TestResultDetails() {
    const { id } = useParams();

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
        <div className="card shadow-sm mb-4 dropshadow">
            <div className="card-header blueBg text-white">
                <h5 className="mb-0">Test Result Detail</h5>
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
                        {data.type}
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

                <h5>Laboratory Results</h5>

                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th>Blood Glucose</th>
                            <td>{data.bloodGlucose ?? "-"}</td>
                        </tr>

                        <tr>
                            <th>HbA1c</th>
                            <td>{data.HbA1c ?? "-"}</td>
                        </tr>

                        <tr>
                            <th>Total Cholesterol</th>
                            <td>
                                {data.totalCholesterol ?? "-"}
                            </td>
                        </tr>

                        <tr>
                            <th>HDL Cholesterol</th>
                            <td>
                                {data.hdlCholesterol ?? "-"}
                            </td>
                        </tr>

                        <tr>
                            <th>LDL Cholesterol</th>
                            <td>
                                {data.ldlCholesterol ?? "-"}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <Link
                    to="testresult/"
                    className="btn btn-secondary"
                >
                    Back
                </Link>
            </div>
        </div>
    );
}