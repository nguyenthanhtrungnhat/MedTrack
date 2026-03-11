import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import '../../css/PrescriptionPrint.css'
interface PrescriptionItem {
    medicineID: number
    medicineName: string
    genericName?: string
    dosageForm?: string
    strength?: string
    dosage?: string
    frequency?: string
    durationDays?: number
    quantity?: number
    instructions?: string
}

interface Prescription {
    prescriptionID: number
    patientName?: string
    doctorName?: string
    diagnosis?: string
    notes?: string
    createdAt?: string
}

export default function PrescriptionDetail() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [prescription, setPrescription] = useState<Prescription | null>(null)
    const [items, setItems] = useState<PrescriptionItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        if (!id) return
        fetchDetail()

    }, [id])

    const fetchDetail = async () => {

        try {

            const res = await axios.get(
                `http://localhost:3000/api/prescriptions/${id}`
            )

            const data = res.data

            if (!Array.isArray(data) || data.length === 0) {

                toast.error("Prescription not found")
                navigate("/doctor/prescriptions")
                return

            }

            const first = data[0]

            setPrescription({
                prescriptionID: first.prescriptionID,
                patientName: first.patientName,
                doctorName: first.doctorName,
                diagnosis: first.diagnosis,
                notes: first.notes,
                createdAt: first.createdAt
            })

            const medicines = data
                .filter((r: any) => r.medicineID)
                .map((r: any) => ({
                    medicineID: r.medicineID,
                    medicineName: r.medicineName,
                    genericName: r.genericName,
                    dosageForm: r.dosageForm,
                    strength: r.strength,
                    dosage: r.dosage,
                    frequency: r.frequency,
                    durationDays: r.durationDays,
                    quantity: r.quantity,
                    instructions: r.instructions
                }))

            setItems(medicines)

        } catch (err) {

            console.error(err)
            toast.error("Failed to load prescription")
            navigate("/doctor/prescriptions")

        } finally {

            setLoading(false)

        }

    }

    if (loading) {

        return (
            <div className="alert alert-info">
                Loading prescription...
            </div>
        )

    }

    if (!prescription) {

        return (
            <div className="alert alert-warning">
                Prescription not found
            </div>
        )

    }

    return (

        <div className="card shadow-sm mb-3">

            <div className="card-header blueBg text-white d-flex justify-content-between">

                <h5 className="mb-0">Prescription Detail</h5>

                <div>

                    <button
                        className="btn btn-light btn-sm me-2"
                        onClick={() => window.print()}
                    >
                        Print
                    </button>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate("/doctor/prescriptions")}
                    >
                        Back
                    </button>

                </div>

            </div>

            <div className="card-body">

                {/* PRINTABLE PRESCRIPTION */}

                <div className="prescription-print p-2">

                    <div className="print-header mb-3">

                        <h3>Medical Prescription</h3>

                        <div>
                            <strong>Patient:</strong> {prescription.patientName || "N/A"}
                        </div>

                        <div>
                            <strong>Doctor:</strong> {prescription.doctorName || "N/A"}
                        </div>

                        <div>
                            <strong>Date:</strong>{" "}
                            {prescription.createdAt
                                ? new Date(prescription.createdAt).toLocaleDateString()
                                : "N/A"}
                        </div>

                    </div>
                    <br />

                    {/* Diagnosis */}

                    <table className="table table-bordered mb-4">

                        <thead className="table-secondary">
                            <tr>
                                <th>Diagnosis</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>
                                    {prescription.diagnosis || "N/A"}
                                </td>
                            </tr>
                        </tbody>

                    </table>



                    {/* Medicines */}

                    <table className="table table-bordered prescription-table mb-4">

                        <thead className="table-secondary">

                            <tr>
                                <th colSpan={7}>Medicines</th>
                            </tr>

                            <tr>
                                <th>#</th>
                                <th>Medicine</th>
                                <th>Strength</th>
                                <th>Dosage</th>
                                <th>Frequency</th>
                                <th>Duration</th>
                                <th>Qty</th>
                            </tr>

                        </thead>

                        <tbody>

                            {items.map((m, index) => (

                                <tr key={index}>

                                    <td>{index + 1}</td>

                                    <td>
                                        <strong>{m.medicineName}</strong>

                                        {m.genericName && (
                                            <div className="text-muted small">
                                                {m.genericName}
                                            </div>
                                        )}
                                    </td>

                                    <td>{m.strength || "-"}</td>

                                    <td>
                                        {m.dosage || "-"} {m.dosageForm || ""}
                                    </td>

                                    <td>
                                        {m.frequency
                                            ? `${m.frequency} times/day`
                                            : "-"}
                                    </td>

                                    <td>
                                        {m.durationDays
                                            ? `${m.durationDays} days`
                                            : "-"}
                                    </td>

                                    <td>{m.quantity || "-"}</td>

                                </tr>

                            ))}

                        </tbody>

                    </table>



                    {/* Doctor Notes */}

                    {prescription.notes && (

                        <table className="table table-bordered">

                            <thead className="table-secondary">
                                <tr>
                                    <th>Doctor Notes</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>
                                        {prescription.notes}
                                    </td>
                                </tr>
                            </tbody>

                        </table>

                    )}
                    <div className="signature-section mt-3">

                        <div className="signature-box">

                            <h5>Doctor Signature</h5>

                            <div className="signature-line"></div>

                            <div className="signature-name">
                                {prescription.doctorName || ""}
                            </div>

                        </div>

                    </div>
                </div>

            </div>

        </div>

    )

}
