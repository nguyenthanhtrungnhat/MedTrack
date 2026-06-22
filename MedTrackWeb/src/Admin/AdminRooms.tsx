import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Form } from "react-bootstrap";
import "./AdminFeatures.css";

interface Room {
    roomID: number;
    departmentID: number;
    departmentName?: string;
    location: string;
    capacity: number;
}

interface Department {
    departmentID: number;
    departmentName: string;
}

export default function AdminRooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [form, setForm] = useState({ departmentID: "", location: "", capacity: 6 });
    const [filterDept, setFilterDept] = useState("");
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        loadRooms();
        loadDepartments();
    }, []);

    const loadRooms = async () => {
        try {
            const res = await axios.get("http://localhost:3000/rooms", { headers: { Authorization: `Bearer ${token}` } });
            setRooms(res.data);
        } catch (err) {
            toast.error("Failed to load rooms");
        }
    };

    const loadDepartments = async () => {
        try {
            const res = await axios.get("http://localhost:3000/departments", { headers: { Authorization: `Bearer ${token}` } });
            setDepartments(res.data);
        } catch (err) {
            toast.error("Failed to load departments");
        }
    };

    const openModal = (room?: Room) => {
        if (room) {
            setEditingRoom(room);
            setForm({ departmentID: room.departmentID.toString(), location: room.location, capacity: room.capacity });
        } else {
            setEditingRoom(null);
            setForm({ departmentID: "", location: "", capacity: 6 });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.departmentID || !form.location || !form.capacity) {
            return toast.warning("Please fill all fields");
        }
        try {
            if (editingRoom) {
                await axios.put(`http://localhost:3000/rooms/${editingRoom.roomID}`, form, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Room updated");
            } else {
                await axios.post("http://localhost:3000/rooms", form, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Room created");
            }
            setShowModal(false);
            loadRooms();
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Operation failed");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this room?")) return;
        try {
            await axios.delete(`http://localhost:3000/rooms/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Room deleted");
            loadRooms();
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to delete room");
        }
    };

    // Helper to get dept name
    const getDeptName = (id: number) => {
        return departments.find(d => d.departmentID === id)?.departmentName || id;
    };

    // Helper to get consistent badge color based on departmentID
    const getDeptBadgeColor = (id: number) => {
        const colors = ["primary", "success", "danger", "warning text-dark", "info text-dark", "dark", "secondary"];
        return colors[id % colors.length];
    };

    const displayedRooms = filterDept 
        ? rooms.filter(r => r.departmentID.toString() === filterDept) 
        : rooms;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="admin-header-title">Manage Rooms</h4>
                <div className="d-flex gap-3 align-items-center">
                    <select 
                        className="premium-select"
                        value={filterDept} 
                        onChange={e => setFilterDept(e.target.value)}
                        style={{ minWidth: '200px' }}
                    >
                        <option value="">All Departments</option>
                        {departments.map(d => (
                            <option key={d.departmentID} value={d.departmentID}>{d.departmentName}</option>
                        ))}
                    </select>
                    <button className="btn-premium-add" onClick={() => openModal()}>
                        <i className="fa fa-plus"></i> Add Room
                    </button>
                </div>
            </div>
            
            <div className="table-responsive">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Room ID</th>
                            <th>Department</th>
                            <th>Location</th>
                            <th>Capacity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedRooms.map(r => (
                            <tr key={r.roomID}>
                                <td>#{r.roomID}</td>
                                <td>
                                    <span className={`premium-badge premium-badge-${getDeptBadgeColor(r.departmentID)}`}>
                                        {r.departmentName || getDeptName(r.departmentID)}
                                    </span>
                                </td>
                                <td className="fw-bold text-dark">{r.location}</td>
                                <td>{r.capacity} beds</td>
                                <td>
                                    <button className="btn-action-edit" onClick={() => openModal(r)}>Edit</button>
                                    <button className="btn-action-delete" onClick={() => handleDelete(r.roomID)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="admin-header-title fs-5">{editingRoom ? "Edit Room" : "Create Room"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-secondary small text-uppercase">Department</Form.Label>
                            <Form.Select className="premium-select w-100" value={form.departmentID} onChange={e => setForm({ ...form, departmentID: e.target.value })}>
                                <option value="">Select Department...</option>
                            {departments.map(d => (
                                <option key={d.departmentID} value={d.departmentID}>{d.departmentName}</option>
                            ))}
                        </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-secondary small text-uppercase">Location</Form.Label>
                            <Form.Control className="premium-select w-100" type="text" placeholder="e.g. Room 101" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-secondary small text-uppercase">Capacity</Form.Label>
                            <Form.Control className="premium-select w-100" type="number" min="1" value={form.capacity} onChange={e => setForm({ ...form, capacity: parseInt(e.target.value) })} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <button className="btn-action-delete px-4 py-2" onClick={() => setShowModal(false)}>Cancel</button>
                    <button className="btn-premium-add px-4 py-2" onClick={handleSave}>Save</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
