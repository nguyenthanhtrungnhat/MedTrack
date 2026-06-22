import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./AdminFeatures.css";

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
                "http://localhost:3000/admin/medicines",
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
                `http://localhost:3000/admin/medicines/${medicine.medicineID}`,
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

        <div className="table-responsive">

            <table className="premium-table">

                <thead>
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
                                    ? <span className="premium-badge premium-badge-green">Active</span>
                                    : <span className="premium-badge premium-badge-gray">Inactive</span>
                                }
                            </td>

                            <td>
                                <button
                                    className={"btn-action-edit " + (m.isActive ? "" : "opacity-50")}
                                    style={{ background: m.isActive ? "#f0fdf4" : "", color: m.isActive ? "#16a34a" : "", borderColor: m.isActive ? "#bbf7d0" : "" }}
                                    onClick={() => toggleStatus(m)}
                                >
                                    Active
                                </button>
                                <button
                                    className={"btn-action-delete " + (!m.isActive ? "" : "opacity-50")}
                                    onClick={() => toggleStatus(m)}
                                >
                                    Inactive
                                </button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}