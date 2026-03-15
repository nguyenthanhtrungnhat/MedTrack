import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface Patient {
  patientID: number
  fullName: string
}

interface Medicine {
  dosageForm: string
  medicineID: number
  medicineName: string
}

interface PrescriptionItem {
  medicineID: number
  medicineName: string
  dosage: string
  frequency: number
  durationDays: number
  quantity: number
  instructions: string
  dosageForm: string
}

export default function PrescriptionForm() {

  const [patients, setPatients] = useState<Patient[]>([])
  const [medicines, setMedicines] = useState<Medicine[]>([])

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const [patientSearch, setPatientSearch] = useState("")
  const [medicineSearch, setMedicineSearch] = useState("")

  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([])

  const [items, setItems] = useState<PrescriptionItem[]>([]

  )
  const [diagnosis, setDiagnosis] = useState("")
  const [notes, setNotes] = useState("")

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState(false)

  const doctorID = Number(sessionStorage.getItem("doctorID"))

  useEffect(() => {

    const fetchData = async () => {

      try {

        const [pRes, mRes] = await Promise.all([
          axios.get("https://projectb-medtrack.onrender.com/patients"),
          axios.get("https://projectb-medtrack.onrender.com/medicines")
        ])

        setPatients(pRes.data)
        setMedicines(mRes.data)

      } catch (err) {

        console.error(err)
        setError(true)
        toast.error("Failed to load data")

      } finally {

        setLoadingData(false)

      }

    }

    fetchData()

  }, [])

  useEffect(() => {

    const filtered = patients
      .filter(p =>
        p.fullName.toLowerCase().includes(patientSearch.toLowerCase())
      )
      .slice(0, 10)

    setFilteredPatients(filtered)

  }, [patientSearch, patients])

  useEffect(() => {

    const filtered = medicines
      .filter(m =>
        m.medicineName
          .toLowerCase()
          .startsWith(medicineSearch.toLowerCase())
      )
      .slice(0, 10)

    setFilteredMedicines(filtered)

  }, [medicineSearch, medicines])

  const addMedicine = (medicine: Medicine) => {

    if (items.some(i => i.medicineID === medicine.medicineID)) {
      toast.warning("Medicine already added")
      return
    }

    setItems([
      ...items,
      {
        medicineID: medicine.medicineID,
        medicineName: medicine.medicineName,
        dosage: "",
        frequency: 1,
        durationDays: 1,
        quantity: 1,
        instructions: "",
        dosageForm: medicine.dosageForm
      }
    ])

    setMedicineSearch("")
    toast.success(`${medicine.medicineName} added`)

  }

  const updateItem = (index: number, field: string, value: any) => {

    const updated = [...items]

    updated[index] = {
      ...updated[index],
      [field]: value
    }

    updated[index].quantity =
      updated[index].frequency * updated[index].durationDays

    setItems(updated)

  }

  const removeItem = (index: number) => {

    const name = items[index].medicineName

    setItems(items.filter((_, i) => i !== index))

    toast.info(`${name} removed`)

  }

  const submitPrescription = async () => {

    if (!selectedPatient) {
      toast.warning("Please select a patient")
      return
    }

    if (items.length === 0) {
      toast.warning("Please add medicine")
      return
    }

    const data = {
      patientID: selectedPatient.patientID,
      doctorID,
      diagnosis,
      notes,
      medicines: items
    }

    try {

      setLoading(true)

      await axios.post(
        "https://projectb-medtrack.onrender.com/make-prescriptions",
        data
      )

      toast.success("Prescription created successfully")

      setItems([])
      setDiagnosis("")
      setNotes("")
      setSelectedPatient(null)

    } catch (err) {

      console.error(err)
      toast.error("Something went wrong")

    } finally {

      setLoading(false)

    }

  }

  if (loadingData) {

    return (
      <div className="container mt-5">
        <div className="card p-4">
          <div className="placeholder-glow">
            <span className="placeholder col-6 mb-3"></span>
            <span className="placeholder col-12 mb-2"></span>
            <span className="placeholder col-12 mb-2"></span>
            <span className="placeholder col-12"></span>
          </div>
        </div>
      </div>
    )

  }

  if (error) {

    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Something went wrong loading data
        </div>
      </div>
    )

  }

  return (


    <div className="card shadow mb-3">

      <div className="card-header blueBg text-white">
        <h5 className="mb-0">Create Prescription</h5>
      </div>

      <div className="card-body">

        {/* Patient Search */}

        <div className="mb-4">

          <label className="form-label">Search Patient</label>

          <input
            className="form-control"
            placeholder="Search patient..."
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
          />

          {patientSearch && (

            <ul className="list-group mt-1"
              style={{ maxHeight: 200, overflowY: "auto" }}>

              {filteredPatients.length === 0 && (
                <li className="list-group-item text-muted">
                  No patient found
                </li>
              )}

              {filteredPatients.map(p => (

                <li
                  key={p.patientID}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedPatient(p)
                    setPatientSearch("")
                    toast.success(`Selected ${p.fullName}`)
                  }}
                >
                  {p.fullName} (ID: {p.patientID})
                </li>

              ))}

            </ul>

          )}

          {selectedPatient && (
            <div className="alert alert-info mt-2">
              Selected: {selectedPatient.fullName}
            </div>
          )}

        </div>

        {/* Diagnosis */}

        <div className="mb-3">
          <label className="form-label">Diagnosis</label>
          <input
            className="form-control"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
        </div>

        {/* Notes */}

        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea
            className="form-control"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Medicine Search */}

        <div className="mb-3">

          <label className="form-label">Search Medicine</label>

          <input
            className="form-control"
            placeholder="Search medicine..."
            value={medicineSearch}
            onChange={(e) => setMedicineSearch(e.target.value)}
          />

          {medicineSearch && (

            <ul className="list-group mt-1"
              style={{ maxHeight: 250, overflowY: "auto" }}>

              {filteredMedicines.length === 0 && (
                <li className="list-group-item text-muted">
                  No medicine found
                </li>
              )}

              {filteredMedicines.map(m => (

                <li
                  key={m.medicineID}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={() => addMedicine(m)}
                >
                  {m.medicineName}
                </li>

              ))}

            </ul>

          )}

        </div>

        {/* Medicine Table */}

        <table className="table table-bordered">

          <thead className="table-dark">

            <tr>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Times / Day</th>
              <th>Days</th>
              <th>Quantity</th>
              <th>Instructions</th>
              <th></th>
            </tr>

          </thead>

          <tbody>

            {items.map((item, index) => (

              <tr key={index}>

                <td>{item.medicineName}</td>

                <td>
                  <input
                    className="form-control"
                    value={item.dosage}
                    onChange={(e) =>
                      updateItem(index, "dosage", e.target.value)
                    }
                    placeholder={`${item.dosageForm || "unit"} number `}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={item.frequency}
                    onChange={(e) =>
                      updateItem(index, "frequency", Number(e.target.value))
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={item.durationDays}
                    onChange={(e) =>
                      updateItem(index, "durationDays", Number(e.target.value))
                    }
                  />
                </td>

                <td>
                  <input
                    className="form-control"
                    value={item.quantity}
                    readOnly
                  />
                </td>

                <td>
                  <input
                    className="form-control"
                    value={item.instructions}
                    onChange={(e) =>
                      updateItem(index, "instructions", e.target.value)
                    }
                  />
                </td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <div className="text-end">

          <button
            className="btn btn-success"
            disabled={loading}
            onClick={submitPrescription}
          >
            {loading ? "Saving..." : "Create Prescription"}
          </button>

        </div>

      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

    </div>

  )

}