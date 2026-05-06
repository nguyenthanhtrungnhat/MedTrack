import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

type LogType = {
  logTime: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  instruction: string;
};

type SheetType = {
  sheetID: number;
  admissionNumber: string;
  patientCode: string;
  diagnosis: string;
  createdAt: string;
  logs: LogType[];
};

export default function TreatmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<SheetType | null>(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: "http://localhost:3000/api",
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/treatment/${id}`);
        setData(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

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
    <div className="container mt-3 mb-3">

      {/* BACK BUTTON */}
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate("/doctor/treatment")}
      >
        ← Back
      </button>

      {/* HEADER CARD */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">

          <h3 className="text-primary mb-1">
            {data.patientCode}
          </h3>

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

      {/* TIMELINE TITLE */}
      <h5 className="mb-3">Treatment Timeline</h5>

      {/* TIMELINE */}
      <div className="d-flex flex-column gap-3">

        {data.logs.map((l, i) => (
          <div
            key={i}
            className="card shadow-sm border-0"
          >
            <div className="card-body">

              {/* TIME BADGE */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-dark">
                  {l.logTime}
                </span>

                <span className="text-muted small">
                  Entry #{i + 1}
                </span>
              </div>

              {/* CONTENT GRID */}
              <div className="row">

                <div className="col-md-6 mb-2">
                  <b>S:</b> {l.subjective || "-"}
                </div>

                <div className="col-md-6 mb-2">
                  <b>O:</b> {l.objective || "-"}
                </div>

                <div className="col-md-6 mb-2">
                  <b>A:</b> {l.assessment || "-"}
                </div>

                <div className="col-md-6 mb-2">
                  <b>P:</b> {l.plan || "-"}
                </div>

                <div className="col-12">
                  <b>I:</b> {l.instruction || "-"}
                </div>

              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}