import { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormType = {
  admissionNumber: string;
  patientCode: string;
  diagnosis: string;
};

type LogType = {
  logTime: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  instruction: string;
};

export default function TreatmentOCR() {
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);

  // 🔥 LOCK REQUEST (anti StrictMode + anti double click)
  const scanningRef = useRef(false);

  const [form, setForm] = useState<FormType>({
    admissionNumber: "",
    patientCode: "",
    diagnosis: "",
  });

  const [logs, setLogs] = useState<LogType[]>([]);

  const api = useMemo(() => {
    return axios.create({
      baseURL: "http://localhost:3000/api",
    });
  }, []);

  /* ================= CLEAN FILE PREVIEW ================= */
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  /* ================= PARSE LOGS ================= */
  const normalizeLogs = (logs: LogType[]): LogType[] => {
    return logs.map((log) => {
      let s = "";
      let o = "";
      let a = "";
      let p = "";

      const text = (log.subjective || "").toLowerCase();
      const parts = text.split(/[.,]/);

      for (let part of parts) {
        part = part.trim();
        if (!part) continue;

        if (
          part.includes("patient") ||
          part.includes("pain") ||
          part.includes("feels")
        ) {
          s += part + ". ";
        } else if (
          part.includes("bp") ||
          part.includes("blood pressure") ||
          part.includes("heart rate") ||
          part.includes("temperature")
        ) {
          o += part + ". ";
        } else if (
          part.includes("continue") ||
          part.includes("medication") ||
          part.includes("give") ||
          part.includes("administer")
        ) {
          p += part + ". ";
        } else if (
          part.includes("stable") ||
          part.includes("improved") ||
          part.includes("worse")
        ) {
          a += part + ". ";
        } else {
          s += part + ". ";
        }
      }

      return {
        ...log,
        subjective: s.trim(),
        objective: o.trim(),
        assessment: a.trim(),
        plan: p.trim(),
        instruction: log.instruction || "",
      };
    });
  };

  /* ================= SCAN OCR (FULL FIX) ================= */
  const scan = async () => {
    // 🔥 HARD BLOCK DOUBLE CALL
    if (!file || scanningRef.current) return;

    scanningRef.current = true;
    setScanning(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/ocr", formData, {
        timeout: 30000,
      });

      setForm(res.data.form || {});
      setLogs(normalizeLogs(res.data.logs || []));

      // 🔥 NO DUPLICATE TOAST
      toast.success("Scan success", {
        toastId: "scan-success",
      });
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data?.error || "Scan failed",
        {
          toastId: "scan-error",
        }
      );
    } finally {
      scanningRef.current = false;
      setScanning(false);
    }
  };

  /* ================= UPDATE LOG ================= */
  const updateLog = (
    index: number,
    field: keyof LogType,
    value: string
  ) => {
    const newLogs = [...logs];
    newLogs[index] = {
      ...newLogs[index],
      [field]: value,
    };
    setLogs(newLogs);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const doctorID =
      Number(sessionStorage.getItem("doctorID")) || null;

    if (!form.patientCode) {
      toast.warning("Missing HI");
      return;
    }

    try {
      await api.post("/treatment", {
        admissionNumber: form.admissionNumber,
        patientCode: form.patientCode,
        diagnosis: form.diagnosis,
        doctorID,
        logs,
      });

      toast.success("Saved successfully", {
        toastId: "save-success",
      });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Save failed", {
        toastId: "save-error",
      });
    }
  };

  return (
    <div className="mb-3">
      <ToastContainer />
      <div className="card shadow-sm dropShadow  mb-3 border-0">
        <div className="card-header blueBg text-white ">
          <h5 className="mb-0">Treatment Scan</h5>
        </div>
        <div className="p-3 bg-light">
          {/* upload */}
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {/* preview */}
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="img-fluid mt-2 border"
            />
          )}

          {/* scan */}
          <button
            className="btn btn-primary mt-2"
            onClick={scan}
            disabled={scanning}
          >
            {scanning ? "Scanning..." : "Scan OCR"}
          </button>

          <hr />

          {/* FORM */}
          <input
            className="form-control mt-2"
            placeholder="Patient Code (HI)"
            value={form.patientCode}
            onChange={(e) =>
              setForm({ ...form, patientCode: e.target.value })
            }
          />

          <input
            className="form-control mt-2"
            placeholder="Admission Number"
            value={form.admissionNumber}
            onChange={(e) =>
              setForm({ ...form, admissionNumber: e.target.value })
            }
          />

          <textarea
            className="form-control mt-2"
            placeholder="Diagnosis"
            value={form.diagnosis}
            onChange={(e) =>
              setForm({ ...form, diagnosis: e.target.value })
            }
          />

          {/* LOG TABLE */}
          {logs.length > 0 && (
            <>
              <h5 className="mt-3">Treatment Logs</h5>

              <table className="table table-bordered mt-2">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Subjective</th>
                    <th>Objective</th>
                    <th>Assessment</th>
                    <th>Plan</th>
                    <th>Instruction</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((l, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          className="form-control"
                          value={l.logTime}
                          onChange={(e) =>
                            updateLog(i, "logTime", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="form-control"
                          value={l.subjective}
                          onChange={(e) =>
                            updateLog(i, "subjective", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="form-control"
                          value={l.objective}
                          onChange={(e) =>
                            updateLog(i, "objective", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="form-control"
                          value={l.assessment}
                          onChange={(e) =>
                            updateLog(i, "assessment", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="form-control"
                          value={l.plan}
                          onChange={(e) =>
                            updateLog(i, "plan", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="form-control"
                          value={l.instruction}
                          onChange={(e) =>
                            updateLog(i, "instruction", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* SAVE */}
          <button className="btn btn-success mt-3" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}