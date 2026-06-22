import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Modal, Form } from "react-bootstrap";
import "./AdminFeatures.css";

interface TestItem {
    testTypeItemID: number;
    testTypeID: number;
    typeName?: string;
    parameterName: string;
    unit: string;
    referenceRange: string;
}

interface TestType {
    testTypeID: number;
    typeName: string;
}

export default function AdminTestItems() {
    const [testItems, setTestItems] = useState<TestItem[]>([]);
    const [testTypes, setTestTypes] = useState<TestType[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<TestItem | null>(null);
    const [form, setForm] = useState({ testTypeID: "", parameterName: "", unit: "", referenceRange: "" });
    const [filterType, setFilterType] = useState("");
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        loadTestItems();
        loadTestTypes();
    }, []);

    const loadTestItems = async () => {
        try {
            const res = await axios.get("http://localhost:3000/testitems", { headers: { Authorization: `Bearer ${token}` } });
            setTestItems(res.data);
        } catch (err) {
            toast.error("Failed to load test items");
        }
    };

    const loadTestTypes = async () => {
        try {
            const res = await axios.get("http://localhost:3000/testtype", { headers: { Authorization: `Bearer ${token}` } });
            setTestTypes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const openModal = (item?: TestItem) => {
        if (item) {
            setEditingItem(item);
            setForm({ 
                testTypeID: item.testTypeID.toString(), 
                parameterName: item.parameterName, 
                unit: item.unit || "", 
                referenceRange: item.referenceRange || "" 
            });
        } else {
            setEditingItem(null);
            setForm({ testTypeID: "", parameterName: "", unit: "", referenceRange: "" });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.testTypeID || !form.parameterName) {
            return toast.warning("Test Type and Parameter Name are required");
        }
        try {
            if (editingItem) {
                await axios.put(`http://localhost:3000/testitems/${editingItem.testTypeItemID}`, form, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Test Item updated");
            } else {
                await axios.post("http://localhost:3000/testitems", form, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Test Item created");
            }
            setShowModal(false);
            loadTestItems();
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Operation failed");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this test parameter?")) return;
        try {
            await axios.delete(`http://localhost:3000/testitems/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Test item deleted");
            loadTestItems();
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to delete test item");
        }
    };

    const getTypeName = (id: number) => {
        const type = testTypes.find(t => t.testTypeID === id);
        return type ? type.typeName : "Unknown";
    };

    const displayedTestItems = filterType 
        ? testItems.filter(t => t.testTypeID.toString() === filterType)
        : testItems;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="admin-header-title">Manage Test Parameters</h4>
                <div className="d-flex gap-3 align-items-center">
                    <select 
                        className="premium-select"
                        value={filterType} 
                        onChange={e => setFilterType(e.target.value)}
                        style={{ minWidth: '200px' }}
                    >
                        <option value="">All Test Types</option>
                        {testTypes.map(t => (
                            <option key={t.testTypeID} value={t.testTypeID}>{t.typeName}</option>
                        ))}
                    </select>

                    <button className="btn-premium-add" onClick={() => openModal()}>
                        <i className="fa fa-plus"></i> Add Parameter
                    </button>
                </div>
            </div>
            
            <div className="table-responsive">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Test Type</th>
                            <th>Parameter Name</th>
                            <th>Reference Range</th>
                            <th>Unit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedTestItems.map(t => (
                            <tr key={t.testTypeItemID}>
                                <td>#{t.testTypeItemID}</td>
                                <td>
                                    <span className="premium-badge premium-badge-purple">
                                        {t.typeName || getTypeName(t.testTypeID)}
                                    </span>
                                </td>
                                <td className="fw-bold text-dark">{t.parameterName}</td>
                                <td><span className="premium-badge premium-badge-gray fw-normal">{t.referenceRange || "N/A"}</span></td>
                                <td>{t.unit || "N/A"}</td>
                                <td>
                                    <button className="btn-action-edit" onClick={() => openModal(t)}>Edit</button>
                                    <button className="btn-action-delete" onClick={() => handleDelete(t.testTypeItemID)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="admin-header-title fs-5">{editingItem ? "Edit Parameter" : "Create Parameter"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-secondary small text-uppercase">Parent Test Type</Form.Label>
                            <Form.Select className="premium-select w-100" value={form.testTypeID} onChange={e => setForm({ ...form, testTypeID: e.target.value })}>
                                <option value="">Select Test Type...</option>
                                {testTypes.map(t => (
                                    <option key={t.testTypeID} value={t.testTypeID}>{t.typeName}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-secondary small text-uppercase">Parameter Name</Form.Label>
                            <Form.Control className="premium-select w-100" type="text" placeholder="e.g. RBC" value={form.parameterName} onChange={e => setForm({ ...form, parameterName: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-secondary small text-uppercase">Unit</Form.Label>
                            <Form.Control className="premium-select w-100" type="text" placeholder="e.g. million cells/mcL" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold text-secondary small text-uppercase">Reference Range</Form.Label>
                            <Form.Control className="premium-select w-100" type="text" placeholder="e.g. 4.32-5.72" value={form.referenceRange} onChange={e => setForm({ ...form, referenceRange: e.target.value })} />
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
