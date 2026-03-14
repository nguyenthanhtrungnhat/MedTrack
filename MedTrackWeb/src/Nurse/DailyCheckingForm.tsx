import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormData } from '../interface';

interface Patient {
  patientID: number;
  fullName: string;
  email: string;
  image: string;
}

const token = sessionStorage.getItem("token");

export default function DailyCheckingForm() {

  const [formData, setFormData] = useState<FormData>({
    patientID: "",
    pulse: "",
    spo2: "",
    temperature: "",
    oxygenTherapy: "",
    bloodPressure: "",
    height: "",
    weight: "",
    sensorium: "",
    respiratoryRate: "",
    urine: "",
    heartRate: "",
    hurtScale: "",
    currentCondition: ""
  });

  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [showResults, setShowResults] = useState(false);

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    axios.get<Patient[]>("http://localhost:3000/patients")
      .then(res => setPatients(res.data))
      .catch(err => toast.error(`Failed to load patients data: ${err}`));
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredPatients([]);
      setShowResults(false);
      setFormData(prev => ({ ...prev, patientID: "" }));
      return;
    }

    const filtered = patients.filter(p =>
      (p.fullName || "").toLowerCase().includes(value.toLowerCase())
    );

    setFilteredPatients(filtered);
    setShowResults(true);
  };

  const handleSelectPatient = (patient: Patient) => {
    setFormData(prev => ({ ...prev, patientID: patient.patientID.toString() }));
    setSearchTerm(patient.fullName);
    setShowResults(false);
  };

  // Validation rules for each field
  const validateField = (name: string, value: string): string => {
    const num = parseFloat(value);
    switch (name) {
      case "pulse": return (isNaN(num) || num < 30 || num > 220) ? "Pulse must be 30–220 bpm." : "";
      case "spo2": return (isNaN(num) || num < 70 || num > 100) ? "SpO₂ must be 70–100%." : "";
      case "temperature": return (isNaN(num) || num < 25 || num > 45) ? "Temperature must be 25–45°C." : "";
      case "oxygenTherapy": return (isNaN(num) || num < 0 || num > 60) ? "Oxygen therapy must be 0–60 L/min." : "";
      case "bloodPressure":
        if (!value) return "";
        const [sys, dia] = value.split("/").map(Number);
        return (isNaN(sys) || isNaN(dia) || sys < 30 || sys > 250 || dia < 20 || dia > 150)
          ? "Blood pressure must be SYS/DIA 30/20–250/150 mmHg." : "";
      case "height": return (isNaN(num) || num < 30 || num > 250) ? "Height must be 30–250 cm." : "";
      case "weight": return (isNaN(num) || num < 1 || num > 500) ? "Weight must be 1–500 kg." : "";
      case "sensorium": return (isNaN(num) || num < 1 || num > 15) ? "Sensorium must be 1–15." : "";
      case "respiratoryRate": return (isNaN(num) || num < 5 || num > 60) ? "Respiratory rate must be 5–60/min." : "";
      case "urine": return (isNaN(num) || num < 0 || num > 5000) ? "Urine output must be 0–5000 ml/h." : "";
      case "heartRate": return (isNaN(num) || num < 30 || num > 220) ? "Heart rate must be 30–220 bpm." : "";
      case "hurtScale": return (isNaN(num) || num < 0 || num > 10) ? "Pain scale must be 0–10." : "";
      default: return "";
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate all fields before submit
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, (formData as any)[key]);
    });
    setErrors(newErrors);

    // Stop submit if any error exists
    if (Object.values(newErrors).some(err => err)) return;

    try {
      await axios.post("http://localhost:3000/post-medical-records", {
        patientID: parseInt(formData.patientID),
        heartRate: parseFloat(String(formData.heartRate)),
        pulse: parseFloat(String(formData.pulse)),
        height: parseFloat(String(formData.height)),
        weight: parseFloat(String(formData.weight)),
        hurtScale: parseFloat(String(formData.hurtScale)),
        temperature: parseFloat(String(formData.temperature)),
        currentCondition: formData.currentCondition,
        SP02: parseFloat(String(formData.spo2)),
        healthStatus: 1,
        respiratoryRate: parseFloat(String(formData.respiratoryRate)),
        bloodPressure: formData.bloodPressure,
        urine: parseFloat(String(formData.urine)),
        oxygenTherapy: parseInt(String(formData.oxygenTherapy)),
        sensorium: parseInt(String(formData.sensorium)),
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success("Dữ liệu đã gửi thành công!");
      setFormData({
        patientID: "",
        pulse: "",
        spo2: "",
        temperature: "",
        oxygenTherapy: "",
        bloodPressure: "",
        height: "",
        weight: "",
        sensorium: "",
        respiratoryRate: "",
        urine: "",
        heartRate: "",
        hurtScale: "",
        currentCondition: ""
      });
      setSearchTerm("");
      setTouched({});
      setErrors({});
    } catch (err) {
      toast.error("Gửi dữ liệu thất bại!")
      console.log(token)
    }
  };

  return (
    <div className=" radius10 shadow-sm mb-3">
      <div className="p-2 radius10b0 blueBg text-white">
        <h5 className="mb-0">Life function tracking sheet <i className="fa fa-file-text" /></h5>
      </div>
      <div className="p-5 pt-3 whiteBg dropShadow">
        <ToastContainer />
        <h6 className="dlcgray">Update patient diagnostic indicators</h6>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3 position-relative">
            <div className="col">
              <label>Choose patient</label>
              <input
                name="patientSearch"
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-control"
                type="text"
                placeholder="Search patients by name..."
              />
              {showResults && filteredPatients.length > 0 && (
                <ul className="list-group position-absolute w-100" style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}>
                  {filteredPatients.map(patient => (
                    <li key={patient.patientID} className="list-group-item list-group-item-action d-flex align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSelectPatient(patient)}>
                      <img src={patient.image} alt={patient.fullName} className="rounded-circle me-2" style={{ width: "40px", height: "40px" }} />
                      <div>
                        <div><strong>{patient.fullName}</strong></div>
                        <small className="text-muted">{patient.email}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <input type="hidden" name="patientID" value={formData.patientID} />

          {/* Example for one row, repeat pattern for all fields */}
          <div className="row">
            <div className="col">
              <label>Pulse</label>
              <input
                name="pulse"
                value={formData.pulse}
                onChange={handleChange}
                className={`form-control ${touched.pulse && errors.pulse ? "is-invalid" : ""}`}
                type="number"
                placeholder="L/ph"
                required
              />
              {touched.pulse && errors.pulse && <div className="invalid-feedback">{errors.pulse}</div>}
            </div>
            <div className="col">
              <label>SpO₂</label>
              <input
                name="spo2"
                value={formData.spo2}
                onChange={handleChange}
                className={`form-control ${touched.spo2 && errors.spo2 ? "is-invalid" : ""}`}
                type="number"
                placeholder="%"
                required
              />
              {touched.spo2 && errors.spo2 && <div className="invalid-feedback">{errors.spo2}</div>}
            </div>
          </div>
          <hr />
          {/* Temperature & Oxygen therapy */}
          <div className="row">
            <div className="col">
              <label>Temperature</label>
              <input
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className={`form-control ${touched.temperature && errors.temperature ? "is-invalid" : ""}`}
                type="number"
                placeholder="℃"
                required
              />
              {touched.temperature && errors.temperature && <div className="invalid-feedback">{errors.temperature}</div>}
            </div>

            <div className="col">
              <label>Oxygen therapy</label>
              <input
                name="oxygenTherapy"
                value={formData.oxygenTherapy}
                onChange={handleChange}
                className={`form-control ${touched.oxygenTherapy && errors.oxygenTherapy ? "is-invalid" : ""}`}
                type="number"
                placeholder="L/min"
                required
              />
              {touched.oxygenTherapy && errors.oxygenTherapy && <div className="invalid-feedback">{errors.oxygenTherapy}</div>}
            </div>
          </div>
          <hr />
          {/* Blood pressure & Height */}
          <div className="row">
            <div className="col">
              <label>Blood pressure</label>
              <input
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleChange}
                className={`form-control ${touched.bloodPressure && errors.bloodPressure ? "is-invalid" : ""}`}
                placeholder="SYS/DIA"
                required
              />
              {touched.bloodPressure && errors.bloodPressure && <div className="invalid-feedback">{errors.bloodPressure}</div>}
            </div>
            <div className="col">
              <label>Height</label>
              <input
                name="height"
                value={formData.height}
                onChange={handleChange}
                className={`form-control ${touched.height && errors.height ? "is-invalid" : ""}`}
                type="number"
                placeholder="cm"
                required
              />
              {touched.height && errors.height && <div className="invalid-feedback">{errors.height}</div>}
            </div>
          </div>
          <hr />
          {/* Weight & Sensorium */}
          <div className="row">
            <div className="col">
              <label>Weight</label>
              <input
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className={`form-control ${touched.weight && errors.weight ? "is-invalid" : ""}`}
                type="number"
                placeholder="Kg"
                required
              />
              {touched.weight && errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
            </div>
            <div className="col">
              <label>Sensorium</label>
              <input
                name="sensorium"
                value={formData.sensorium}
                onChange={handleChange}
                className={`form-control ${touched.sensorium && errors.sensorium ? "is-invalid" : ""}`}
                type="number"
                required
              />
              {touched.sensorium && errors.sensorium && <div className="invalid-feedback">{errors.sensorium}</div>}
            </div>
          </div>
          <hr />
          {/* Respiratory rate & Urine */}
          <div className="row">
            <div className="col">
              <label>Respiratory rate</label>
              <input
                name="respiratoryRate"
                value={formData.respiratoryRate}
                onChange={handleChange}
                className={`form-control ${touched.respiratoryRate && errors.respiratoryRate ? "is-invalid" : ""}`}
                type="number"
                placeholder="Times/min"
                required
              />
              {touched.respiratoryRate && errors.respiratoryRate && <div className="invalid-feedback">{errors.respiratoryRate}</div>}
            </div>
            <div className="col">
              <label>Urine</label>
              <input
                name="urine"
                value={formData.urine}
                onChange={handleChange}
                className={`form-control ${touched.urine && errors.urine ? "is-invalid" : ""}`}
                type="number"
                placeholder="ml/h"
                required
              />
              {touched.urine && errors.urine && <div className="invalid-feedback">{errors.urine}</div>}
            </div>
          </div>
          <hr />
          {/* Heart rate & Pain scale */}
          <div className="row">
            <div className="col">
              <label>Heart rate</label>
              <input
                name="heartRate"
                value={formData.heartRate}
                onChange={handleChange}
                className={`form-control ${touched.heartRate && errors.heartRate ? "is-invalid" : ""}`}
                type="number"
                placeholder="bpm"
                required
              />
              {touched.heartRate && errors.heartRate && <div className="invalid-feedback">{errors.heartRate}</div>}
            </div>
            <div className="col">
              <label>Pain scale</label>
              <input
                name="hurtScale"
                value={formData.hurtScale}
                onChange={handleChange}
                className={`form-control ${touched.hurtScale && errors.hurtScale ? "is-invalid" : ""}`}
                type="number"
                required
              />
              {touched.hurtScale && errors.hurtScale && <div className="invalid-feedback">{errors.hurtScale}</div>}
            </div>
          </div>
          <hr />
          {/* Current condition (textarea) */}
          <div className="row">
            <div className="col">
              <label>Current condition</label>
              <textarea
                required
                name="currentCondition"
                value={formData.currentCondition}
                onChange={handleChange}
                className={`form-control ${touched.currentCondition && errors.currentCondition ? "is-invalid" : ""}`}
              />
              {touched.currentCondition && errors.currentCondition && <div className="invalid-feedback">{errors.currentCondition}</div>}
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-2">Submit and continue</button>
        </form>
      </div>
    </div>
  );
}
