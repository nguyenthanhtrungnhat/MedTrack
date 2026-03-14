import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { NurseProps, TestResultProps } from "../interface";
import getUserIDFromToken from "../components/getUserIDFromToken";

export default function TestResult() {
  const [data, setData] = useState<TestResultProps[]>([]);
  const [loadingTest, setLoadingTest] = useState(true);
  const [loadingNurse, setLoadingNurse] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserID, setSelectedUserID] =
    useState<number | "all">("all");

  const [sortConfig, setSortConfig] = useState<{
    key: "datetime" | "username";
    direction: "asc" | "desc";
  }>({
    key: "datetime",
    direction: "desc",
  });

  const [user, setUser] = useState<NurseProps | null>(null);
  const [nurseID, setNurseID] = useState<number | null>(null);

  const userID = getUserIDFromToken();
  const url = `http://localhost:3000/nurses/by-user/${userID}`;

  // 🔹 Get nurseID
  useEffect(() => {
    if (!userID) return;

    axios
      .get(url)
      .then((response) => {
        setNurseID(response.data.nurseID);
        console.log("Nurse ID:", response.data.nurseID);
      })
      .catch((error) =>
        console.error("Error fetching nurseID:", error)
      );
  }, [userID]);

  // 🔹 Get nurse info
  useEffect(() => {
    if (nurseID == null) return;

    setLoadingNurse(true);

    axios
      .get(`http://localhost:3000/nurses/${nurseID}`)
      .then((response) => {
        setUser(response.data);
        console.log("Nurse Data:", response.data);
      })
      .catch((error) =>
        console.error("Error fetching nurse:", error)
      )
      .finally(() => {
        setLoadingNurse(false);
      });
  }, [nurseID]);

  // 🔹 Get test results
  useEffect(() => {
    setLoadingTest(true);

    axios
      .get<TestResultProps[]>(
        "http://localhost:3000/testresult"
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
  }, []);

  if (!userID) {
    return <p>Please log in to view your nurse profile.</p>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Failed":
        return "danger";
      default:
        return "secondary";
    }
  };

  // 🔹 Extract unique users
  const uniqueUsers = useMemo(() => {
    const map = new Map<number, string>();
    data.forEach((item) => {
      map.set(item.userID, item.username);
    });

    return Array.from(map, ([userID, username]) => ({
      userID,
      username,
    }));
  }, [data]);

  // 🔹 Filter + Sort
  const processedData = useMemo(() => {
    let filtered = [...data];

    if (selectedUserID !== "all") {
      filtered = filtered.filter(
        (item) => item.userID === selectedUserID
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.username
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let valueA: number | string;
      let valueB: number | string;

      if (sortConfig.key === "datetime") {
        valueA = new Date(a.datetime).getTime();
        valueB = new Date(b.datetime).getTime();
      } else {
        valueA = a.username.toLowerCase();
        valueB = b.username.toLowerCase();
      }

      if (valueA < valueB)
        return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB)
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, selectedUserID, searchTerm, sortConfig]);

  const handleSort = (key: "datetime" | "username") => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header blueBg text-white">
        <h5 className="mb-0">Test Result List</h5>
      </div>

      {/* Search + Dropdown */}
      <div className="p-3 border-bottom bg-light">
        <div className="row g-2">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedUserID}
              onChange={(e) =>
                setSelectedUserID(
                  e.target.value === "all"
                    ? "all"
                    : Number(e.target.value)
                )
              }
            >
              <option value="all">All Users</option>
              {uniqueUsers.map((user) => (
                <option
                  key={user.userID}
                  value={user.userID}
                >
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("username")}
              >
                User{" "}
                {sortConfig.key === "username" &&
                  (sortConfig.direction === "asc"
                    ? "↑"
                    : "↓")}
              </th>
              <th>Title</th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("datetime")}
              >
                Date & Time{" "}
                {sortConfig.key === "datetime" &&
                  (sortConfig.direction === "asc"
                    ? "↑"
                    : "↓")}
              </th>
              <th>Test Code</th>
              <th>Status</th>
              <th>Type</th>
            </tr>
          </thead>

          <tbody>
            {loadingTest ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center text-danger py-4">
                  {error}
                </td>
              </tr>
            ) : processedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No data available
                </td>
              </tr>
            ) : (
              processedData.map((item) => (
                <tr key={item.testResultID}>
                  <td>{item.username}</td>
                  <td>{item.title}</td>
                  <td>
                    {new Date(
                      item.datetime
                    ).toLocaleString()}
                  </td>
                  <td>{item.testResultCode}</td>
                  <td>
                    <span
                      className={`badge bg-${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.type}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}