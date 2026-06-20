import { useEffect, useState } from "react";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";

export default function CreateTestResult() {
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const [title, setTitle] = useState("");
    const [remarks, setRemarks] = useState("");

    const [items, setItems] = useState<any[]>([]);
    const [errors, setErrors] = useState<Record<number, string>>({});

    // =========================
    // LOAD ORDERS
    // =========================
    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const res = await API.get(
                "/doctororder/pending"
            );
            setOrders(res.data);
        } catch {
            toast.error("Failed to load orders");
        }
    };

    // =========================
    // LOAD TEST ITEMS
    // =========================
    const loadTestItems = async (testTypeID: number) => {
        try {
            const res = await API.get(
                `/testtype/${testTypeID}/items`
            );

            const mapped = res.data.map((p: any) => ({
                testTypeItemID: p.testTypeItemID,
                parameterName: p.parameterName,
                unit: p.unit || "",
                referenceRange: p.referenceRange || "",
                resultValue: "",
                abnormalFlag: "Normal",
            }));

            setItems(mapped);
            setErrors({});
        } catch {
            setItems([]);
            toast.error("Failed to load parameters");
        }
    };

    // =========================
    // AUTO RANGE CHECK
    // =========================
    const calcStatus = (value: number, range: string) => {
        if (!range) return "Normal";

        const match = range.match(
            /(\d+(\.\d+)?)\s*-\s*(\d+(\.\d+)?)/
        );

        if (!match) return "Normal";

        const min = Number(match[1]);
        const max = Number(match[3]);

        if (value < min) return "Low";
        if (value > max) return "High";
        return "Normal";
    };

    // =========================
    // UPDATE ITEM (REAL-TIME VALIDATION)
    // =========================
    const updateItem = (index: number, field: string, value: any) => {
        const copy = [...items];
        const item = { ...copy[index], [field]: value };

        if (field === "resultValue") {
            // EMPTY VALUE
            if (value === "") {
                setErrors((prev) => ({
                    ...prev,
                    [index]: "Value is required",
                }));

                item.resultValue = "";
                copy[index] = item;
                setItems(copy);
                return;
            }

            // ONLY NUMBER CHECK
            if (isNaN(Number(value))) {
                setErrors((prev) => ({
                    ...prev,
                    [index]: "Only numbers are allowed",
                }));
                return;
            }

            // CLEAR ERROR
            setErrors((prev) => {
                const newErr = { ...prev };
                delete newErr[index];
                return newErr;
            });

            const num = Number(value);
            item.resultValue = value;

            // AUTO ABNORMAL FLAG
            item.abnormalFlag = calcStatus(
                num,
                item.referenceRange
            );
        }

        copy[index] = item;
        setItems(copy);
    };

    const isValidValue = (value: any) =>
        value !== null &&
        value !== undefined &&
        String(value).trim() !== "";

    // =========================
    // VALIDATION BEFORE SUBMIT
    // =========================
    const validate = () => {
        if (!selectedOrder) {
            toast.warning("Please select a doctor order");
            return false;
        }

        if (!title.trim()) {
            toast.warning("Title is required");
            return false;
        }

        if (!items.length) {
            toast.warning("No test parameters loaded");
            return false;
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (!isValidValue(item.resultValue)) {
                toast.warning(
                    `Missing value for ${item.parameterName}`
                );
                return false;
            }

            if (errors[i]) {
                toast.warning(
                    `Fix errors before saving`
                );
                return false;
            }
        }

        return true;
    };

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            const loading = toast.loading("Saving result...");

            await API.post(
                "/testresult",
                {
                    orderID: selectedOrder.orderID,
                    title,
                    remarks,
                    items,
                }
            );

            toast.dismiss(loading);
            toast.success("Test result created successfully");

            const completedID = selectedOrder.orderID;

            setSelectedOrder(null);
            setTitle("");
            setRemarks("");
            setItems([]);
            setErrors({});

            setOrders((prev) =>
                prev.filter((x) => x.orderID !== completedID)
            );
        } catch (err: any) {
            toast.error(
                err.response?.data?.message ||
                "Failed to save"
            );
        }
    };

    // =========================
    // UI
    // =========================
    return (
        <div className="mb-4 dropShadow">
            <ToastContainer />
            <div className="card shadow">
                <div className="card-header blueBg text-white ">
                    <h5>Submit Test Result</h5>
                </div>

                <div className="card-body">
                    {/* ORDER SELECT */}
                    <div className="mb-3">
                        <label>Doctor Order</label>
                        <select
                            className="form-select"
                            value={selectedOrder?.orderID || ""}
                            onChange={(e) => {
                                const order = orders.find(
                                    (x) =>
                                        Number(x.orderID) ===
                                        Number(e.target.value)
                                );

                                setSelectedOrder(order || null);
                                setItems([]);
                                setTitle("");

                                if (!order) return;

                                setTitle(order.typeName || "");
                                loadTestItems(order.testTypeID);
                            }}
                        >
                            <option value="">
                                Select Order
                            </option>

                            {orders.map((order) => (
                                <option
                                    key={order.orderID}
                                    value={order.orderID}
                                >
                                    #{order.orderID} -{" "}
                                    {order.patientName} -{" "}
                                    {order.admissionRecordCode} -{" "}
                                    {order.typeName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* INFO */}
                    {selectedOrder && (
                        <div className="alert alert-info">
                            <b>Patient:</b>{" "}
                            {selectedOrder.patientName}
                            <br />
                            <b>Test:</b>{" "}
                            {selectedOrder.typeName}
                            <br />
                            <b>Diagnosis:</b>{" "}
                            {selectedOrder.diagnosisNote}
                        </div>
                    )}

                    {/* TITLE */}
                    <div className="mb-3">
                        <label>Title</label>
                        <input
                            className="form-control"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                        />
                    </div>

                    {/* REMARKS */}
                    <div className="mb-3">
                        <label>Remarks</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            value={remarks}
                            onChange={(e) =>
                                setRemarks(e.target.value)
                            }
                        />
                    </div>

                    <hr />

                    {/* ITEMS */}
                    <h6>Test Parameters</h6>

                    {items.length === 0 && (
                        <div className="alert alert-warning">
                            No parameters loaded
                        </div>
                    )}

                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="border rounded p-3 mb-3"
                        >
                            <div className="row">
                                <div className="col-md-3">
                                    <input
                                        className="form-control"
                                        value={item.parameterName}
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-2">
                                    <input
                                        className={`form-control ${errors[index]
                                                ? "border-danger"
                                                : ""
                                            }`}
                                        placeholder="Value"
                                        value={item.resultValue}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "resultValue",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors[index] && (
                                        <small className="text-danger">
                                            {errors[index]}
                                        </small>
                                    )}
                                </div>

                                <div className="col-md-2">
                                    <input
                                        className="form-control"
                                        value={item.unit}
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-2">
                                    <input
                                        className="form-control"
                                        value={
                                            item.referenceRange
                                        }
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-3">
                                    <span
                                        className={`badge ${item.abnormalFlag ===
                                                "High"
                                                ? "bg-danger"
                                                : item.abnormalFlag ===
                                                    "Low"
                                                    ? "bg-warning text-dark"
                                                    : "bg-success"
                                            }`}
                                    >
                                        {item.abnormalFlag}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* SUBMIT */}
                    <button
                        className="btn btn-success"
                        onClick={handleSubmit}
                    >
                        Save Test Result
                    </button>
                </div>
            </div>
        </div>
    );
}