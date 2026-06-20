import { useEffect, useMemo, useState } from "react";
import API from "../../api";
import { toast, ToastContainer } from "react-toastify";

export default function ManualTreatmentPage() {
  const token = sessionStorage.getItem("token");

  // ❗ FIX: doctorID KHÔNG cần gửi, chỉ đọc (debug nếu cần)
  const doctorID = sessionStorage.getItem("doctorID");

  const [patients, setPatients] = useState<any[]>([]);
  const [searchCIC, setSearchCIC] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const [diagnosis, setDiagnosis] = useState("");
  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");
  const [instruction, setInstruction] = useState("");

  const [loading, setLoading] = useState(false);

  /* ================= LOAD PATIENTS ================= */
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const res = await API.get(
          "/patients/forSearch"
        );

        setPatients(res.data || []);
      } catch {
        toast.error("Failed to load patients");
      }
    };

    loadPatients();
  }, []);

  /* ================= SEARCH ================= */
  const filteredPatients = useMemo(() => {
    if (!searchCIC.trim()) return [];

    const keyword = searchCIC.toLowerCase();

    return patients.filter((p) => {
      return (
        (p.HI || "").toLowerCase().includes(keyword) ||
        (p.relativeName || "").toLowerCase().includes(keyword) ||
        (p.fullName || "").toLowerCase().includes(keyword)
      );
    });
  }, [patients, searchCIC]);

  /* ================= SELECT PATIENT ================= */
  const handleSelectPatient = (p: any) => {
    setSelectedPatient(p);
    setSearchCIC(p.HI);
  };

  /* ================= SUBMIT (FIXED ONLY) ================= */
  const handleSubmit = async () => {
    if (!selectedPatient) {
      return toast.warning("Please select patient");
    }

    if (!diagnosis.trim()) {
      return toast.warning("Diagnosis required");
    }

    const doctorID = sessionStorage.getItem("doctorID");

    if (!doctorID) {
      return toast.error("Missing doctorID in session");
    }

    try {
      setLoading(true);

      await API.post(
        "/treatmenttimeline/manual",
        {
          cic: selectedPatient.HI,
          diagnosis,
          doctorID, // ⭐ ADD HERE
          log: {
            subjective,
            objective,
            assessment,
            plan,
            instruction,
          },
        }
      );

      toast.success("Saved successfully");

      setSelectedPatient(null);
      setSearchCIC("");
      setDiagnosis("");
      setSubjective("");
      setObjective("");
      setAssessment("");
      setPlan("");
      setInstruction("");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow mb-4">
      <ToastContainer />

      <div className="card-header blueBg text-white">
        <h5 className="mb-0">Manual Treatment Entry</h5>
      </div>

      <div className="card-body">
        {/* ================= PATIENT SEARCH ================= */}
        <div className="mb-3 position-relative">
          <label className="form-label">Patient CIC / Name</label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter CIC or name..."
            value={searchCIC}
            onChange={(e) => {
              setSearchCIC(e.target.value);
              setSelectedPatient(null);
            }}
          />

          {/* DROPDOWN */}
          {!selectedPatient &&
            searchCIC.trim() &&
            filteredPatients.length > 0 && (
              <div
                className="border rounded mt-1 shadow-sm bg-white position-absolute w-100"
                style={{
                  maxHeight: "240px",
                  overflowY: "auto",
                  zIndex: 9999,
                }}
              >
                {filteredPatients.slice(0, 8).map((p) => (
                  <div
                    key={p.patientID}
                    className="p-2 border-bottom"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                    onClick={() => handleSelectPatient(p)}
                  >
                    <div style={{ fontWeight: 500 }}>
                      {p.relativeName || p.fullName}
                    </div>
                    <small className="text-muted">CIC: {p.HI}</small>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* ================= SELECTED PATIENT ================= */}
        {selectedPatient && (
          <div className="alert alert-info">
            <b>Selected:</b>{" "}
            {selectedPatient.relativeName || selectedPatient.fullName}
            <br />
            <b>CIC:</b> {selectedPatient.HI}
          </div>
        )}

        {/* ================= DIAGNOSIS ================= */}
        <div className="mb-3">
          <textarea
            className="form-control"
            rows={3}
            placeholder="Diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
        </div>

        {/* ================= SOAP ================= */}
        <textarea
          className="form-control mb-2"
          placeholder="Subjective"
          value={subjective}
          onChange={(e) => setSubjective(e.target.value)}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Objective"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Assessment"
          value={assessment}
          onChange={(e) => setAssessment(e.target.value)}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Plan"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        />

        <textarea
          className="form-control mb-3"
          placeholder="Instruction"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />

        {/* ================= BUTTON ================= */}
        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
}