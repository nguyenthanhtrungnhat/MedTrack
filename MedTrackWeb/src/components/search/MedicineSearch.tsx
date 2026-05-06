import { useEffect, useState } from "react"
import axios from "axios"

interface Medicine {
  medicineID: number
  medicineName: string
}

interface Props {
  addMedicine: (medicine: Medicine) => void
}

export default function MedicineSearch({ addMedicine }: Props) {

  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([])
  const [search, setSearch] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // load medicines
  useEffect(() => {

    const fetchMedicines = async () => {

      try {

        setLoading(true)
        setError(false)

        const res = await axios.get("http://localhost:3000/medicines")

        setMedicines(res.data)

      } catch (err) {

        console.error(err)
        setError(true)

      } finally {

        setLoading(false)

      }

    }

    fetchMedicines()

  }, [])

  // search filter
  useEffect(() => {

    if (!search) {
      setFilteredMedicines([])
      return
    }

    const filtered = medicines.filter(m =>
      m.medicineName
        .toLowerCase()
        .startsWith(search.toLowerCase())
    )

    setFilteredMedicines(filtered)

  }, [search, medicines])

  return (

    <div className="mb-3">

      <label className="form-label">Search Medicine</label>

      <input
        className="form-control"
        placeholder="Type medicine name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (

        <ul
          className="list-group mt-1"
          style={{
            maxHeight: "250px",
            overflowY: "auto"
          }}
        >

          {/* Loading skeleton */}

          {loading && [...Array(5)].map((_, i) => (

            <li
              key={i}
              className="list-group-item placeholder-glow"
            >
              <span className="placeholder col-8"></span>
            </li>

          ))}

          {/* Error */}

          {!loading && error && (

            <li className="list-group-item text-danger">
              Something went wrong
            </li>

          )}

          {/* No results */}

          {!loading && !error && filteredMedicines.length === 0 && (

            <li className="list-group-item text-muted">
              No medicine found
            </li>

          )}

          {/* Medicine results */}

          {!loading && !error &&
            filteredMedicines
              .slice(0, 10)
              .map(m => (

                <li
                  key={m.medicineID}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={() => {

                    addMedicine(m)
                    setSearch("")

                  }}
                >
                  {m.medicineName}
                </li>

              ))
          }

        </ul>

      )}

    </div>

  )

}