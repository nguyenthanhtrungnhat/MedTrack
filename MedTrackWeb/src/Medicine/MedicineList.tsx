import React, { useEffect, useState } from "react";
import axios from "axios";

interface Medicine {
  medicineID: number;
  medicineName: string;
  genericName: string | null;
  dosageForm: string | null;
  strength: string | null;
  description: string | null;
  isActive: number;
}

export default function MedicinesList() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get<Medicine[]>(
        "http://localhost:3000/medicines"
      );
      setMedicines(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="card shadow-sm mb-3">
            <div className="card-header blueBg text-white">
                <h5 className="mb-0">Medicine List</h5>
            </div>
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Medicine Name</th>
            <th>Generic Name</th>
            <th>Dosage Form</th>
            <th>Strength</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center">
                Loading...
              </td>
            </tr>
          ) : medicines.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center">
                No medicines found
              </td>
            </tr>
          ) : (
            medicines.map((med) => (
              <tr key={med.medicineID}>
                <td>{med.medicineID}</td>
                <td>{med.medicineName}</td>
                <td>{med.genericName || "-"}</td>
                <td>{med.dosageForm || "-"}</td>
                <td>{med.strength || "-"}</td>
                <td>{med.description || "-"}</td>
                <td>
                  {med.isActive ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-danger">Inactive</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}