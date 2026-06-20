import { useEffect, useState, useMemo } from "react";
import API from "../api";
import { TestResultProps } from "../interface";
import getUserIDFromToken from "../components/getUserIDFromToken";
import { useNavigate } from "react-router-dom";

export default function TestResult() {
  const doctorID = sessionStorage.getItem("doctorID");
  const token = sessionStorage.getItem("token");

  const [data, setData] = useState<TestResultProps[]>([]);
  const [loadingTest, setLoadingTest] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const userID = getUserIDFromToken();

  const [sortConfig, setSortConfig] = useState<{
    key: "datetime" | "patientName";
    direction: "asc" | "desc";
  }>({
    key: "datetime",
    direction: "desc",
  });
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    setLoadingTest(true);

    API.get<TestResultProps[]>(
      "/testresult",
      {
        params: showAll
          ? {}
          : { doctorID }
      }
    )
      .then((response) => {
        setData(response.data);
      })
      .catch(() => {
        setError("Failed to fetch test results");
      })
      .finally(() => {
        setLoadingTest(false);
      });
  }, [doctorID, token, showAll]);

  if (!userID) {
    return (
      <p>
        Please log in to view your doctor
        profile.
      </p>
    );
  }

  const processedData = useMemo(() => {
    let filtered = [...data];

    if (searchTerm.trim() !== "") {
      const keyword =
        searchTerm.toLowerCase();

      filtered = filtered.filter(
        (item: any) =>
          item.patientName
            ?.toLowerCase()
            .includes(keyword) ||
          item.patientCIC
            ?.toLowerCase()
            .includes(keyword) ||
          item.testResultCode
            ?.toLowerCase()
            .includes(keyword)
      );
    }

    filtered.sort((a: any, b: any) => {
      let valueA: string | number;
      let valueB: string | number;

      if (sortConfig.key === "datetime") {
        valueA = new Date(
          a.datetime
        ).getTime();

        valueB = new Date(
          b.datetime
        ).getTime();
      } else {
        valueA =
          a.patientName?.toLowerCase() ??
          "";

        valueB =
          b.patientName?.toLowerCase() ??
          "";
      }

      if (valueA < valueB) {
        return sortConfig.direction ===
          "asc"
          ? -1
          : 1;
      }

      if (valueA > valueB) {
        return sortConfig.direction ===
          "asc"
          ? 1
          : -1;
      }

      return 0;
    });

    return filtered;
  }, [
    data,
    searchTerm,
    sortConfig,
  ]);

  const handleSort = (
    key: "datetime" | "patientName"
  ) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key &&
          prev.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <div className="card dropShadow mb-4">
      <div className="card-header blueBg text-white">
        <h5 className="mb-0">
          Test Result List
        </h5>
      </div>

      <div className="p-3 border-bottom bg-light">
        <div className="row">
          <div className="d-flex justify-content-between align-items-center">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by patient name, CIC or test code..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

            {doctorID && (
              <button
                className={`btn ${showAll
                    ? "btn-outline-warning"
                    : "btn-outline-success"
                  }`}
                onClick={() =>
                  setShowAll(!showAll)
                }
              >
                {showAll
                  ? "Show Only My Results"
                  : "Show All Results"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">

          <thead className="table-dark">
            <tr>

              <th
                style={{
                  cursor:
                    "pointer",
                }}
                onClick={() =>
                  handleSort(
                    "patientName"
                  )
                }
              >
                Patient{" "}
                {sortConfig.key ===
                  "patientName" &&
                  (sortConfig.direction ===
                    "asc"
                    ? "↑"
                    : "↓")}
              </th>

              <th>Doctor</th>

              <th>
                Test Type
              </th>

              <th>Title</th>

              <th
                style={{
                  cursor:
                    "pointer",
                }}
                onClick={() =>
                  handleSort(
                    "datetime"
                  )
                }
              >
                Date & Time{" "}
                {sortConfig.key ===
                  "datetime" &&
                  (sortConfig.direction ===
                    "asc"
                    ? "↑"
                    : "↓")}
              </th>

              <th>
                Test Code
              </th>

              <th>
                Action
              </th>

            </tr>
          </thead>

          <tbody>
            {loadingTest ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4"
                >
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center text-danger py-4"
                >
                  {error}
                </td>
              </tr>
            ) : processedData.length ===
              0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4"
                >
                  No data available
                </td>
              </tr>
            ) : (
              processedData.map(
                (item: any) => (
                  <tr
                    key={
                      item.testResultID
                    }
                  >
                    <td>
                      {
                        item.patientName
                      }

                      <br />

                      <small className="text-muted">
                        CIC:{" "}
                        {
                          item.patientCIC
                        }
                      </small>
                    </td>

                    <td>
                      {
                        item.doctorName
                      }
                    </td>

                    <td>
                      {
                        item.typeName
                      }
                    </td>

                    <td>
                      {
                        item.title
                      }
                    </td>

                    <td>
                      {new Date(
                        item.datetime
                      ).toLocaleString()}
                    </td>

                    <td>
                      {
                        item.testResultCode
                      }
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() =>
                          navigate(
                            `${item.testResultID}`
                          )
                        }
                      >
                        View
                        Details
                      </button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}