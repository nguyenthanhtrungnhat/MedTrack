import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { PatientProps } from "../../interface";

export default function PatientSearch() {
  const [patients, setPatients] = useState<PatientProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<PatientProps[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  var url = '';
  const roleID = sessionStorage.getItem("roleID");
  { roleID == '1' ? (url = "/doctor/bed-details/") : (url = "/home/bed-details/") }
  // Fetch patient data
  useEffect(() => {
    fetch("https://projectb-medtrack.onrender.com/patients")
      .then((res) => res.json())
      .then((data) => {
        // Filter out invalid patients (no ID or fullName)
        const validPatients = data.filter(
          (p: any) => p && p.patientID && p.fullName
        );
        setPatients(validPatients);
      })
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  // Filter patients by name or ID
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients([]);
      setShowDropdown(false);
      return;
    }

    const filtered = patients.filter((p) => {
      const name = p.fullName ? p.fullName.toLowerCase() : "";
      const id = p.patientID ? p.patientID.toString() : "";
      return (
        name.includes(searchTerm.toLowerCase()) ||
        id.includes(searchTerm)
      );
    });

    setFilteredPatients(filtered);
    setShowDropdown(filtered.length > 0);
  }, [searchTerm, patients]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="position-relative" style={{ flexShrink: 0 }}>
      <input
        type="search"
        className="form-control me-2"
        placeholder="Search patient..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => filteredPatients.length > 0 && setShowDropdown(true)}
        autoComplete="off"
      />

      {showDropdown && (
        <ul
          className="list-group position-absolute start-0 mt-1 shadow-sm"
          style={{
            width: "100%",
            zIndex: 2000,
            maxHeight: "220px",
            overflowY: "auto",
            borderRadius: "0.5rem",
            backgroundColor: "white",
          }}
        >
          {filteredPatients.map((p) => (
            <Link
              key={p.patientID}
              to={`${url}${p.patientID}`}
              className="list-group-item list-group-item-action d-flex align-items-center text-decoration-none"
              onClick={() => {
                setShowDropdown(false);
                setSearchTerm(""); // optional: clear after navigation
              }}
            >
              <img
                src={p.image || "https://via.placeholder.com/32?text=N/A"}
                alt={p.fullName || "N/A"}
                className="rounded-circle me-2"
                style={{ width: "32px", height: "32px", objectFit: "cover" }}
              />
              <div>
                <div className="fw-semibold text-dark">{p.fullName || "N/A"}</div>
                <small className="text-muted">ID: {p.patientID || "N/A"}</small>
              </div>
            </Link>
          ))}

          {filteredPatients.length === 0 && (
            <li className="list-group-item text-center text-muted py-2">
              No matching patients found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
