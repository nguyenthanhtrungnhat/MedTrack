import { useEffect, useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";

type SheetType = {
    sheetID: number;
    admissionNumber: string;
    patientCode: string;
    diagnosis: string;
    createdAt: string;

    patientName?: string;
    HI?: string;
};

export default function TreatmentDashboard() {
    const [sheets, setSheets] = useState<SheetType[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await API.get("/treatmenttimeline/all");
                setSheets(res.data || []);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    return (
        <>
            {/* HEADER */}
            <div className="card shadow-sm dropShadow  mb-3 border-0">
                <div className="card-header blueBg text-white">
                    <h5 className="mb-0">Treatment Dashboard</h5>
                </div>
                <div className="card-body ">
                    <p className="mb-0 text-muted">
                        Monitor all patient treatment timelines
                    </p>
                </div>
            </div>

            {/* LOADING SKELETON */}
            {loading && (
                <div className="row g-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div className="col-md-4 " key={i}>
                            <div className="card placeholder-glow p-3 shadow-sm ">
                                <span className="placeholder col-6 mb-2"></span>
                                <span className="placeholder col-8 mb-2"></span>
                                <span className="placeholder col-10"></span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* EMPTY */}
            {!loading && sheets.length === 0 && (
                <div className="alert alert-warning text-center">
                    <h5 className="mb-1">No treatment records</h5>
                    <small>Start by scanning or creating a treatment sheet</small>
                </div>
            )}

            {/* GRID */}
            <div className="row g-3">
                {sheets.map((s) => (
                    <div className="col-md-4 dropShadow" key={s.sheetID}>
                        <div
                            className="card shadow-sm border-0 h-100"
                            role="button"
                            onClick={() => navigate(`/doctor/treatment/${s.sheetID}`)}
                            style={{
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLDivElement).style.transform =
                                    "translateY(-5px)";
                                (e.currentTarget as HTMLDivElement).style.boxShadow =
                                    "0 10px 20px rgba(0,0,0,0.15)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLDivElement).style.transform =
                                    "translateY(0)";
                                (e.currentTarget as HTMLDivElement).style.boxShadow =
                                    "0 2px 6px rgba(0,0,0,0.1)";
                            }}
                        >
                            <div className="card-body">

                                {/* TOP */}
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="badge bg-secondary">
                                        #{s.sheetID}
                                    </span>
                                    <small className="text-muted">
                                        {new Date(s.createdAt).toLocaleDateString()}
                                    </small>
                                </div>

                                {/* PATIENT */}
                                <div className="d-flex align-items-center gap-2">
                                    <h5 className="fw-bold text-primary mb-0">
                                        {s.patientName}
                                    </h5>

                                    {s.HI && (
                                        <span className="badge bg-secondary">
                                            {s.HI}
                                        </span>
                                    )}
                                </div>

                                {/* ADMISSION */}
                                <p className="mb-1">
                                    <span className="text-muted">Admission:</span>{" "}
                                    <b>{s.admissionNumber}</b>
                                </p>

                                {/* DIAGNOSIS */}
                                <p className="text-truncate" title={s.diagnosis}>
                                    {s.diagnosis}
                                </p>

                                {/* FOOTER */}
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span className="badge bg-success">Active</span>
                                    <span className="text-primary fw-bold">→</span>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}