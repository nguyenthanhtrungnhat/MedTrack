import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Modal, Form } from "react-bootstrap";
import "./AdminFeatures.css";

interface TestType {
    testTypeID: number;
    typeName: string;
    description: string;
    createdAt?: string;
}

export default function AdminTestTypes() {
    const [testTypes, setTestTypes] = useState<TestType[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingType, setEditingType] = useState<TestType | null>(null);
    const [form, setForm] = useState({ typeName: "", description: "" });
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        loadTestTypes();
    }, []);

    const loadTestTypes = async () => {
        try {
            const res = await axios.get("http://localhost:3000/testtype", { headers: { Authorization: `Bearer ${token}` } });
            setTestTypes(res.data);
        } catch (err) {
            toast.error("Failed to load test types");
        }
    };

    const openModal = (testType?: TestType) => {
        if (testType) {
            setEditingType(testType);
            setForm({ typeName: testType.typeName, description: testType.description || "" });
        } else {
            setEditingType(null);
            setForm({ typeName: "", description: "" });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.typeName) {
            return toast.warning("Type name is required");
        }
        try {
            if (editingType) {
                await axios.put(`http://localhost:3000/testtype/${editingType.testTypeID}`, form, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Test Type updated");
            } else {
                await axios.post("http://localhost:3000/testtype", form, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Test Type created");
            }
            setShowModal(false);
            loadTestTypes();
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Operation failed");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this test type?")) return;
        try {
            await axios.delete(`http://localhost:3000/testtype/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Test type deleted");
            loadTestTypes();
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to delete test type");
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="admin-header-title">Manage Test Types</h4>
                <button className="btn-premium-add" onClick={() => openModal()}>
                    <i className="fa fa-plus"></i> Add Test Type
                </button>
            </div>
            
            <div className="table-responsive">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Test Type Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testTypes.map(t => (
                            <tr key={t.testTypeID}>
                                <td>#{t.testTypeID}</td>
                                <td>
                                    <span className="premium-badge premium-badge-blue">
                                        {t.typeName}
                                    </span>
                                </td>
                                <td>{t.description}</td>
                                <td>
                                    <button className="btn-action-edit" onClick={() => openModal(t)}>Edit</button>
                                    <button className="btn-action-delete" onClick={() => handleDelete(t.testTypeID)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="admin-header-title fs-5">{editingType ? "Edit Test Type" : "Create Test Type"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-secondary small text-uppercase">Type Name</Form.Label>
                            <Form.Control className="premium-select w-100" type="text" placeholder="e.g. Blood Test" value={form.typeName} onChange={e => setForm({ ...form, typeName: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-secondary small text-uppercase">Description</Form.Label>
                            <Form.Control className="premium-select w-100" as="textarea" rows={3} placeholder="Optional details..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
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
