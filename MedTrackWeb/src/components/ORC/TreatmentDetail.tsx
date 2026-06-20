import { useEffect, useState } from "react";
import API from "../../api";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

type LogType = {
    doctorName: string;
    logTime: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    instruction: string;
};

type SheetType = {
    HI: string;
    patientName: string;
    sheetID: number;
    admissionNumber: string;
    patientCode: string;
    diagnosis: string;
    createdAt: string;
    logs: LogType[];
};

export default function TreatmentDetail() {
    const token = sessionStorage.getItem("token");
    const doctorID = sessionStorage.getItem("doctorID");

    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState<SheetType | null>(null);
    const [loading, setLoading] = useState(true);

    /* ================= MODAL STATE ================= */
    const [showModal, setShowModal] = useState(false);

    const [subjective, setSubjective] = useState("");
    const [objective, setObjective] = useState("");
    const [assessment, setAssessment] = useState("");
    const [plan, setPlan] = useState("");
    const [instruction, setInstruction] = useState("");

     useEffect(() => {
        const fetch = async () => {
            try {
                const res = await API.get(`/treatmenttimeline/${id}`);
                setData(res.data);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [id]);

    /* ================= ADD LOG ================= */
    const handleAddLog = async () => {
        if (!data?.sheetID) return;
        if (!doctorID) return toast.error("Missing doctorID");

        try {
            await API.post(
                `/treatmenttimeline/${data.sheetID}/log`,
                {
                    doctorID,
                    log: {
                        subjective,
                        objective,
                        assessment,
                        plan,
                        instruction,
                    },
                }
            );

            toast.success("Added log");

            // reload
            const res = await API.get(`/treatmenttimeline/${id}`);
            setData(res.data);

            // reset
            setSubjective("");
            setObjective("");
            setAssessment("");
            setPlan("");
            setInstruction("");
            setShowModal(false);

        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Error");
        }
    };

    if (loading) {
        return (
            <div className="container mt-3">
                <div className="card p-3">
                    <div className="placeholder-glow">
                        <span className="placeholder col-6"></span>
                        <span className="placeholder col-8 d-block mt-2"></span>
                        <span className="placeholder col-10 d-block mt-2"></span>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mt-3">
                <div className="alert alert-danger">Not found</div>
            </div>
        );
    }

    return (
        <div className="mb-3">
            <ToastContainer />

            {/* ================= HEADER ================= */}
            <div className="card shadow-sm dropShadow mb-3 border-0">
                <div className="card-header blueBg text-white d-flex justify-content-between">
                    <h5 className="mb-0">Treatment Timeline Detail</h5>

                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-success btn-sm"
                            onClick={() => setShowModal(true)}
                        >
                            + Add
                        </button>

                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate("/doctor/treatment")}
                        >
                            Back
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <h3 className="text-primary mb-0">{data.patientName}</h3>
                        <span className="badge bg-secondary">{data.HI}</span>
                    </div>

                    <p className="mb-1">
                        <b>Admission:</b> {data.admissionNumber}
                    </p>

                    <p className="mb-1">
                        <b>Diagnosis:</b> {data.diagnosis}
                    </p>

                    <small className="text-muted">
                        {new Date(data.createdAt).toLocaleString()}
                    </small>
                </div>
            </div>

            {/* ================= TIMELINE ================= */}
            <h5 className="mb-3">Treatment Timeline</h5>

            <div className="d-flex flex-column gap-3">
                {data.logs.map((l, i) => (
                    <div key={i} className="card shadow-sm dropShadow border-0">
                        <div className="card-body">

                            <div className="d-flex justify-content-between mb-2">
                                <div className="d-flex gap-2">
                                    <span className="badge bg-dark">{l.logTime}</span>
                                    <span className="badge bg-info text-dark">
                                        {l.doctorName || "Unknown doctor"}
                                    </span>
                                </div>
                                <span className="text-muted small">#{i + 1}</span>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-2"><b>S:</b> {l.subjective || "-"}</div>
                                <div className="col-md-6 mb-2"><b>O:</b> {l.objective || "-"}</div>
                                <div className="col-md-6 mb-2"><b>A:</b> {l.assessment || "-"}</div>
                                <div className="col-md-6 mb-2"><b>P:</b> {l.plan || "-"}</div>
                                <div className="col-12"><b>I:</b> {l.instruction || "-"}</div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {/* ================= MODAL ================= */}
            {showModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{
                        background: "rgba(0,0,0,0.5)",
                        zIndex: 9999,
                    }}
                >
                    <div
                        className="bg-white p-3 rounded shadow"
                        style={{
                            width: "600px",
                            margin: "80px auto",
                        }}
                    >
                        <h5>Thêm log mới</h5>

                        <textarea className="form-control mb-2"
                            placeholder="Subjective"
                            value={subjective}
                            onChange={(e) => setSubjective(e.target.value)}
                        />

                        <textarea className="form-control mb-2"
                            placeholder="Objective"
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                        />

                        <textarea className="form-control mb-2"
                            placeholder="Assessment"
                            value={assessment}
                            onChange={(e) => setAssessment(e.target.value)}
                        />

                        <textarea className="form-control mb-2"
                            placeholder="Plan"
                            value={plan}
                            onChange={(e) => setPlan(e.target.value)}
                        />

                        <textarea className="form-control mb-3"
                            placeholder="Instruction"
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                        />

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-success"
                                onClick={handleAddLog}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}