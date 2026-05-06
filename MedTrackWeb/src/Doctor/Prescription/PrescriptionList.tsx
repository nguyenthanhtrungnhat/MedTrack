import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

interface Prescription {
  prescriptionID: number
  patientName?: string
  doctorName?: string
  diagnosis?: string
  createdAt?: string
}

export default function PrescriptionList() {

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {

    try {

      const res = await axios.get(
        "http://localhost:3000/api/prescriptions"
      )

      if (Array.isArray(res.data)) {
        setPrescriptions(res.data)
      } else {
        setPrescriptions([])
      }

    } catch (err) {

      console.error(err)
      toast.error("Failed to load prescriptions")

    } finally {

      setLoading(false)

    }

  }

  // Safe search
  const filtered = prescriptions.filter((p) => {

    const keyword = search.toLowerCase()

    return (
      (p.patientName || "").toLowerCase().includes(keyword) ||
      (p.doctorName || "").toLowerCase().includes(keyword) ||
      (p.diagnosis || "").toLowerCase().includes(keyword)
    )

  })

  if (loading) {

    return (
      <div className="container mt-5">
        <div className="alert alert-info">
          Loading prescriptions...
        </div>
      </div>
    )

  }

  return (

    <div className="card shadow">

      <div className="card-header blueBg text-white">
        <h5 className="mb-0">Prescription List</h5>
      </div>

      <div className="card-body">

        <input
          className="form-control mb-3"
          placeholder="Search patient / doctor / diagnosis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filtered.length === 0 ? (

          <div className="alert alert-secondary">
            No prescriptions found
          </div>

        ) : (

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Diagnosis</th>
                <th>Date</th>
                <th></th>
              </tr>

            </thead>

            <tbody>

              {filtered.map((p) => (

                <tr key={p.prescriptionID}>

                  <td>{p.prescriptionID}</td>

                  <td>{p.patientName || "N/A"}</td>

                  <td>{p.doctorName || "N/A"}</td>

                  <td>{p.diagnosis || "N/A"}</td>

                  <td>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>

                    <Link
                      to={`/doctor/prescriptions/${p.prescriptionID}`}
                      className="btn btn-primary btn-sm"
                    >
                      View
                    </Link>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>

  )

}
