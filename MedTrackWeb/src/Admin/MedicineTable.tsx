import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import "../css/MedicineTable.css";

interface Medicine {
    medicineID: number;
    medicineName: string;
    genericName: string;
    dosageForm: string;
    strength: string;
    description: string;
    isActive: number;
}

export default function MedicineTable() {

    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const token = sessionStorage.getItem("token");

    const loadMedicines = async () => {

        try {

            const res = await axios.get(
                "https://projectb-medtrack.onrender.com/admin/medicines",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMedicines(res.data);

        } catch {
            toast.error("Failed to load medicines");
        }
    };

    useEffect(() => {
        loadMedicines();
    }, []);

    const toggleStatus = async (medicine: Medicine) => {

        const newStatus = medicine.isActive ? 0 : 1;

        try {

            await axios.put(
                `https://projectb-medtrack.onrender.com/admin/medicines/${medicine.medicineID}`,
                { isActive: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMedicines(prev =>
                prev.map(m =>
                    m.medicineID === medicine.medicineID
                        ? { ...m, isActive: newStatus }
                        : m
                )
            );

            toast.success("Status updated");

        } catch {
            toast.error("Update failed");
        }

    };

    return (

        <div className="medicineTable">

            <table className="table table-sm table-bordered table-striped">

                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Generic</th>
                        <th>Form</th>
                        <th>Strength</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {medicines.map(m => (

                        <tr key={m.medicineID}>

                            <td>{m.medicineID}</td>
                            <td>{m.medicineName}</td>
                            <td>{m.genericName}</td>
                            <td>{m.dosageForm}</td>
                            <td>{m.strength}</td>

                            <td>
                                {m.isActive
                                    ? <span className="badge bg-success">Active</span>
                                    : <span className="badge bg-secondary">Inactive</span>
                                }
                            </td>

                            <td>
                                <button
                                    className={`btn btn-sm ${m.isActive
                                        ? "btn-outline-secondary"
                                        : "btn-outline-success"
                                        }`}
                                    onClick={() => toggleStatus(m)}
                                >
                                    {m.isActive ? "Disable" : "Enable"}
                                </button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}