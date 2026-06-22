import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Form } from "react-bootstrap";
import "./AdminFeatures.css";

interface Bed {
    bedID: number;
    roomID: number;
    bedNumber: string;
    status: string;
    location?: string;
    departmentName?: string;
}

interface Room {
    roomID: number;
    location: string;
    departmentName?: string;
}

export default function AdminBeds() {
    const [beds, setBeds] = useState<Bed[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingBed, setEditingBed] = useState<Bed | null>(null);
    const [form, setForm] = useState({ roomID: "", bedNumber: "", status: "Empty" });
    const [filterRoom, setFilterRoom] = useState("");
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        loadBeds();
        loadRooms();
    }, []);

    const loadBeds = async () => {
        try {
            const res = await axios.get("http://localhost:3000/beds", { headers: { Authorization: `Bearer ${token}` } });
            setBeds(res.data);
        } catch (err) {
            toast.error("Failed to load beds");
        }
    };

    const loadRooms = async () => {
        try {
            const res = await axios.get("http://localhost:3000/rooms", { headers: { Authorization: `Bearer ${token}` } });
            setRooms(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const openModal = (bed?: Bed) => {
        if (bed) {
            setEditingBed(bed);
            setForm({ roomID: bed.roomID.toString(), bedNumber: bed.bedNumber, status: bed.status });
        } else {
            setEditingBed(null);
            setForm({ roomID: "", bedNumber: "", status: "Empty" });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.roomID || !form.bedNumber || !form.status) {
            return toast.warning("Please fill all fields");
        }
        try {
            if (editingBed) {
                await axios.put(`http://localhost:3000/beds/${editingBed.bedID}`, form, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Bed updated");
            } else {
                await axios.post("http://localhost:3000/beds", form, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Bed created");
            }
            setShowModal(false);
            loadBeds();
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Operation failed");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this bed?")) return;
        try {
            await axios.delete(`http://localhost:3000/beds/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Bed deleted");
            loadBeds();
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to delete bed");
        }
    };

    const displayedBeds = filterRoom 
        ? beds.filter(b => b.roomID.toString() === filterRoom)
        : beds;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="admin-header-title">Manage Beds</h4>
                <div className="d-flex gap-3 align-items-center">
                    <select 
                        className="premium-select"
                        value={filterRoom} 
                        onChange={e => setFilterRoom(e.target.value)}
                        style={{ minWidth: '200px' }}
                    >
                        <option value="">All Rooms</option>
                        {rooms.map(r => (
                            <option key={r.roomID} value={r.roomID}>{r.location}</option>
                        ))}
                    </select>

                    <button className="btn-premium-add" onClick={() => openModal()}>
                        <i className="fa fa-plus"></i> Add Bed
                    </button>
                </div>
            </div>
            
            <div className="table-responsive">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Room</th>
                            <th>Bed Number</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedBeds.map(b => (
                            <tr key={b.bedID}>
                                <td>#{b.bedID}</td>
                                <td className="fw-bold text-dark">{b.location || "Room " + b.roomID}</td>
                                <td><span className="premium-badge premium-badge-gray text-dark fs-6">{b.bedNumber}</span></td>
                                <td>
                                    <span className={`premium-badge premium-badge-${b.status === 'Empty' ? 'green' : b.status === 'Cleaning' ? 'orange' : 'red'}`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-action-edit" onClick={() => openModal(b)}>Edit</button>
                                    <button className="btn-action-delete" onClick={() => handleDelete(b.bedID)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="admin-header-title fs-5">{editingBed ? "Edit Bed" : "Create Bed"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-secondary small text-uppercase">Room</Form.Label>
                            <Form.Select className="premium-select w-100" value={form.roomID} onChange={e => setForm({ ...form, roomID: e.target.value })}>
                                <option value="">Select Room...</option>
                                {rooms.map(r => (
                                    <option key={r.roomID} value={r.roomID}>{r.location}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-secondary small text-uppercase">Bed Number</Form.Label>
                            <Form.Control className="premium-select w-100" type="text" placeholder="e.g. Bed A" value={form.bedNumber} onChange={e => setForm({ ...form, bedNumber: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-secondary small text-uppercase">Status</Form.Label>
                            <Form.Select className="premium-select w-100" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                <option value="Empty">Empty</option>
                                <option value="Occupied">Occupied</option>
                                <option value="Cleaning">Cleaning</option>
                            </Form.Select>
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
