// MedTrackWeb/src/Admin/AccountTable.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export interface AccountTableProps {
    roleID: 1 | 2 | 3;    // 1 Doctor, 2 Nurse, 3 Patient
    roleName: string;
}

interface Account {
    userID: number;
    username: string;
    fullName: string;
    email: string;
    phone: string | null;
    dob: string | null;
    isActive: 0 | 1;
    roleID: number;
    nameRole: string;
}

export default function AccountTable({ roleID, roleName }: AccountTableProps) {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);
    const token = sessionStorage.getItem("token");

    const loadAccounts = async () => {
        try {
            setLoading(true);
            const res = await axios.get<Account[]>(
                `https://projectb-medtrack.onrender.com/admin/accounts/${roleID}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAccounts(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load accounts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAccounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleID]);

    const updateStatus = async (userID: number, isActive: 0 | 1) => {
        try {
            await axios.put(
                `https://projectb-medtrack.onrender.com/admin/accounts/${userID}/status`,
                { isActive },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAccounts(prev =>
                prev.map(acc =>
                    acc.userID === userID ? { ...acc, isActive } : acc
                )
            );
            toast.success("Status updated");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        }
    };

    return (
        <div>
            <h4 className="blueText mb-3">{roleName} Accounts</h4>

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>UserID</th>
                            <th>Username</th>
                            <th>Full name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>DOB</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={8} className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        )}
                        {!loading && accounts.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center text-muted">
                                    No accounts
                                </td>
                            </tr>
                        )}
                        {accounts.map(acc => (
                            <tr key={acc.userID}>
                                <td>{acc.userID}</td>
                                <td>{acc.username}</td>
                                <td>{acc.fullName}</td>
                                <td>{acc.email}</td>
                                <td>{acc.phone}</td>
                                <td>{acc.dob?.toString().split("T")[0]}</td>
                                <td>
                                    {acc.isActive ? (
                                        <span className="badge bg-success">Active</span>
                                    ) : (
                                        <span className="badge bg-secondary">Unactive</span>
                                    )}
                                </td>
                                <td>
                                    <button
                                        className={
                                            "btn btn-sm me-2 " +
                                            (acc.isActive ? "btn-success" : "btn-outline-success")
                                        }
                                        onClick={() => updateStatus(acc.userID, 1)}
                                    >
                                        Active
                                    </button>
                                    <button
                                        className={
                                            "btn btn-sm " +
                                            (!acc.isActive ? "btn-danger" : "btn-outline-danger")
                                        }
                                        onClick={() => updateStatus(acc.userID, 0)}
                                    >
                                        Unactive
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
