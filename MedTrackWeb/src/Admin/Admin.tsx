// MedTrackWeb/src/Admin/Admin.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/AllDesign.css";
import DoctorTable from "./DoctorTable";
import NurseTable from "./NurseTable";
import PatientTable from "./PatientTable";
import MedicineTable from "./MedicineTable";
import AdminRooms from "./AdminRooms";
import AdminBeds from "./AdminBeds";
import AdminTestTypes from "./AdminTestTypes";
import AdminTestItems from "./AdminTestItems";
import "./AdminFeatures.css";

interface News {
    newID?: number;
    title: string;
    body: string;
    date: string;
    author: string;
    image: string;
    isActive?: number; // 1 = active, 0 = inactive
}

type DoctorFormState = {
    username: string;
    password: string;
    fullName: string;
    dob: string;
    phone: string;
    email: string;
    CCCD: string;
    address: string;
    gender: string; // "0" hoặc "1"
};

type NurseFormState = DoctorFormState & {
    image: string;
};

export default function AdminScreen() {
    const [activeTab, setActiveTab] = useState<
        "doctors" | "nurses" | "patients" | "news" | "medicines"
    >("doctors");

    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    // ======= TOGGLE FORM =======
    const [showDoctorForm, setShowDoctorForm] = useState(false);
    const [showNurseForm, setShowNurseForm] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userID");
        toast.success("Logged out");
        navigate("/login");
    };
    // ===================== DOCTOR FORM ======================
    const [doctorForm, setDoctorForm] = useState<DoctorFormState>({
        username: "",
        password: "",
        fullName: "",
        dob: "",
        phone: "",
        email: "",
        CCCD: "",
        address: "",
        gender: "0",
    });
    const [doctorReloadKey, setDoctorReloadKey] = useState(0);

    const handleDoctorChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setDoctorForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateDoctor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error("Unauthorized - please log in as admin");
            return;
        }
        const { username, password, fullName, email } = doctorForm;
        if (!username || !password || !fullName || !email) {
            toast.error("Username, Password, Full Name, Email are required");
            return;
        }

        try {
            await axios.post(
                "http://localhost:3000/admin/doctors",
                {
                    ...doctorForm,
                    gender: Number(doctorForm.gender),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Doctor account created");

            setDoctorForm({
                username: "",
                password: "",
                fullName: "",
                dob: "",
                phone: "",
                email: "",
                CCCD: "",
                address: "",
                gender: "0",
            });
            setDoctorReloadKey((k) => k + 1);
            setShowDoctorForm(false);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to create doctor");
        }
    };

    // ===================== NURSE FORM ======================
    const [nurseForm, setNurseForm] = useState<NurseFormState>({
        username: "",
        password: "",
        fullName: "",
        dob: "",
        phone: "",
        email: "",
        CCCD: "",
        address: "",
        gender: "0",
        image: "./images/nurse-1.jpg",
    });
    const [nurseReloadKey, setNurseReloadKey] = useState(0);

    const handleNurseChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setNurseForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateNurse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error("Unauthorized - please log in as admin");
            return;
        }

        const { username, password, fullName, email } = nurseForm;
        if (!username || !password || !fullName || !email) {
            toast.error("Username, Password, Full Name, Email are required");
            return;
        }

        try {
            await axios.post(
                "http://localhost:3000/admin/nurses",
                {
                    ...nurseForm,
                    gender: Number(nurseForm.gender),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Nurse account created");

            setNurseForm({
                username: "",
                password: "",
                fullName: "",
                dob: "",
                phone: "",
                email: "",
                CCCD: "",
                address: "",
                gender: "0",
                image: "./images/nurse-1.jpg",
            });
            setNurseReloadKey((k) => k + 1);
            setShowNurseForm(false);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to create nurse");
        }
    };

    // ===================== NEWS STATE ======================
    const [newsList, setNewsList] = useState<News[]>([]);
    const [newsLoaded, setNewsLoaded] = useState(false);
    const [newsForm, setNewsForm] = useState<News>({
        title: "",
        body: "",
        date: new Date().toISOString().slice(0, 10),
        author: "",
        image: "",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const loadNews = async () => {
        if (!token) {
            toast.error("Unauthorized - please log in as admin");
            return;
        }
        try {
            const res = await axios.get<News[]>(
                "http://localhost:3000/admin/news",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setNewsList(res.data);
            setNewsLoaded(true);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load news list");
        }
    };

    useEffect(() => {
        if (activeTab === "news" && !newsLoaded) {
            loadNews();
        }
    }, [activeTab, newsLoaded]);

    const handleNewsFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNewsForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
    };

    const handleUploadImage = async () => {
        if (!imageFile) {
            toast.error("Please choose an image file first");
            return;
        }
        if (!token) {
            toast.error("Unauthorized - please log in as admin");
            return;
        }
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("image", imageFile);

            const res = await axios.post(
                "http://localhost:3000/upload/image",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const filePath = res.data.filePath; // ví dụ: "/uploads/news/123.jpg"

            // ✅ Lưu đúng y chang path backend trả về
            setNewsForm(prev => ({ ...prev, image: filePath }));

            toast.success("Image uploaded successfully");
        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to upload image");
        } finally {
            setUploading(false);
        }
    };
    const getImageSrc = (image: string) => {
        if (!image) return "";

        // 1. Nếu đã là full URL (http / https) thì dùng luôn
        if (image.startsWith("http://") || image.startsWith("https://")) {
            return image;
        }

        // 2. Nếu là ảnh upload từ backend: /uploads/...
        if (image.startsWith("/uploads")) {
            return `http://localhost:3000/${image}`;
        }

        // 3. Nếu là đường dẫn tương đối FE: ./images/...
        return image;
    };


    const handleCreateNews = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error("Unauthorized - please log in as admin");
            return;
        }
        if (!newsForm.title) {
            toast.error("Title is required");
            return;
        }
        try {
            await axios.post("http://localhost:3000/admin/news", newsForm, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("News created successfully");
            setNewsForm({
                title: "",
                body: "",
                date: new Date().toISOString().slice(0, 10),
                author: "",
                image: "",
            });
            loadNews();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to create news");
        }
    };

    const handleToggleNewsStatus = async (news: News) => {
        if (!token) {
            toast.error("Unauthorized - please log in as admin");
            return;
        }
        if (!news.newID) return;

        const newStatus = news.isActive ? 0 : 1;

        try {
            await axios.put(
                `http://localhost:3000/admin/news/${news.newID}`,
                {
                    title: news.title,
                    body: news.body,
                    date: news.date,
                    author: news.author,
                    image: news.image,
                    isActive: newStatus,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNewsList((prev) =>
                prev.map((n) =>
                    n.newID === news.newID ? { ...n, isActive: newStatus } : n
                )
            );
            toast.success(newStatus ? "Activated" : "Deactivated");
        } catch (err: any) {
            console.error(err);
            toast.error(
                err?.response?.data?.message || "Failed to change status"
            );
        }
    };

    const [medicineForm, setMedicineForm] = useState({
        medicineName: "",
        genericName: "",
        dosageForm: "",
        strength: "",
        description: ""
    });

    const [medicineReloadKey, setMedicineReloadKey] = useState(0);

    const handleMedicineChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {

        const { name, value } = e.target;

        setMedicineForm(prev => ({
            ...prev,
            [name]: value
        }));

    };
    const handleCreateMedicine = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!medicineForm.medicineName) {
            toast.error("Medicine name required");
            return;
        }

        try {

            await axios.post(
                "http://localhost:3000/admin/medicines",
                medicineForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Medicine added");

            setMedicineForm({
                medicineName: "",
                genericName: "",
                dosageForm: "",
                strength: "",
                description: ""
            });

            setMedicineReloadKey(k => k + 1);

        } catch {
            toast.error("Create failed");
        }

    };
    return (

        <div className="mainBg pt-5 mt-5 min-vh-100">
            <ToastContainer position="top-right" />
            <div className="container-fluid padding">
                <div className="row">
                    <div className="col-12 mb-4">
                        <div className="border whiteBg dropShadow padding d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="blueText mb-1">Admin Dashboard</h2>
                                <p className="dlcgray mb-0">
                                    Manage accounts and hospital news
                                </p>
                            </div>

                            {/* 👇 NHÓM BÊN PHẢI: NÚT LOGOUT + ICON */}
                            <div className="d-flex align-items-center gap-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                                <i
                                    className="fa fa-hospital-o blueText"
                                    style={{ fontSize: "2.5rem" }}
                                    aria-hidden="true"
                                ></i>
                            </div>
                        </div>
                    </div>


                    <div className="col-12">
                        <div className="admin-feature-card mb-4">
                            {/* Premium Tabs */}
                            <div className="premium-tabs">
                                    <button
                                        className={`premium-tab-btn ${activeTab === "doctors" ? "active" : ""}`}
                                        onClick={() => setActiveTab("doctors")}
                                    >
                                        Doctors
                                    </button>
                                    <button
                                        className={`premium-tab-btn ${activeTab === "nurses" ? "active" : ""}`}
                                        onClick={() => setActiveTab("nurses")}
                                    >
                                        Nurses
                                    </button>
                                    <button
                                        className={`premium-tab-btn ${activeTab === "patients" ? "active" : ""}`}
                                        onClick={() => setActiveTab("patients")}
                                    >
                                        Patients
                                    </button>
                                    <button
                                        className={`premium-tab-btn ${activeTab === "news" ? "active" : ""}`}
                                        onClick={() => setActiveTab("news")}
                                    >
                                        News
                                    </button>
                                    <button
                                        className={`premium-tab-btn ${activeTab === "medicines" ? "active" : ""}`}
                                        onClick={() => setActiveTab("medicines")}
                                    >
                                        Medicines
                                    </button>
                                    <button
                                        className={`premium-tab-btn ${activeTab === "rooms" ? "active" : ""}`}
                                        onClick={() => setActiveTab("rooms")}
                                    >
                                        Rooms
                                    </button>
                                    <button
                                        className={`premium-tab-btn ${activeTab === "beds" ? "active" : ""}`}
                                        onClick={() => setActiveTab("beds")}
                                    >
                                        Beds
                                    </button>
                                    <button
                                        className={`premium-tab-btn ${activeTab === "testtypes" ? "active" : ""}`}
                                        onClick={() => setActiveTab("testtypes")}
                                    >
                                        Test Types
                                    </button>
                                    <button
                                        className={`premium-tab-btn ${activeTab === "testitems" ? "active" : ""}`}
                                        onClick={() => setActiveTab("testitems")}
                                    >
                                        Test Items
                                    </button>
                            </div>

                            {/* ========= Doctors Tab ========= */}
                            {activeTab === "doctors" && (
                                <div className="mt-3">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="admin-header-title">Doctor Account Management</h4>
                                        <button
                                            type="button"
                                            className="btn-premium-add"
                                            onClick={() =>
                                                setShowDoctorForm((prev) => !prev)
                                            }
                                        >
                                            {showDoctorForm ? <span><i className="fa fa-times"></i> Close</span> : <span><i className="fa fa-plus"></i> Create Doctor</span>}
                                        </button>
                                    </div>

                                    {showDoctorForm && (
                                        <form
                                            className="row g-3 mb-4 admin-feature-card"
                                            onSubmit={handleCreateDoctor}
                                        >
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">Username</label>
                                                <input
                                                    name="username"
                                                    className="form-control premium-select"
                                                    value={doctorForm.username}
                                                    onChange={handleDoctorChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">Password</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className="form-control premium-select"
                                                    value={doctorForm.password}
                                                    onChange={handleDoctorChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">Full Name</label>
                                                <input
                                                    name="fullName"
                                                    className="form-control premium-select"
                                                    value={doctorForm.fullName}
                                                    onChange={handleDoctorChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control premium-select"
                                                    value={doctorForm.email}
                                                    onChange={handleDoctorChange}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">Phone</label>
                                                <input
                                                    name="phone"
                                                    className="form-control premium-select"
                                                    value={doctorForm.phone}
                                                    onChange={handleDoctorChange}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">DOB</label>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    className="form-control premium-select"
                                                    value={doctorForm.dob}
                                                    onChange={handleDoctorChange}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">CCCD</label>
                                                <input
                                                    name="CCCD"
                                                    className="form-control premium-select"
                                                    value={doctorForm.CCCD}
                                                    onChange={handleDoctorChange}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">Gender</label>
                                                <select
                                                    name="gender"
                                                    className="form-select premium-select"
                                                    value={doctorForm.gender}
                                                    onChange={handleDoctorChange}
                                                >
                                                    <option value="0">Female</option>
                                                    <option value="1">Male</option>
                                                </select>
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">Address</label>
                                                <input
                                                    name="address"
                                                    className="form-control premium-select"
                                                    value={doctorForm.address}
                                                    onChange={handleDoctorChange}
                                                />
                                            </div>
                                            <div className="col-12 mt-4 text-end">
                                                <button type="submit" className="btn-premium-add d-inline-block">
                                                    Save Doctor
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    <hr />
                                    <DoctorTable key={doctorReloadKey} />
                                </div>
                            )}

                            {/* ========= Nurses Tab ========= */}
                            {activeTab === "nurses" && (
                                <div className="mt-3">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="admin-header-title">Nurse Account Management</h4>
                                        <button
                                            type="button"
                                            className="btn-premium-add"
                                            onClick={() =>
                                                setShowNurseForm((prev) => !prev)
                                            }
                                        >
                                            {showNurseForm ? <span><i className="fa fa-times"></i> Close</span> : <span><i className="fa fa-plus"></i> Create Nurse</span>}
                                        </button>
                                    </div>

                                    {showNurseForm && (
                                        <form
                                            className="row g-3 mb-4 admin-feature-card"
                                            onSubmit={handleCreateNurse}
                                        >
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">Username</label>
                                                <input
                                                    name="username"
                                                    className="form-control premium-select"
                                                    value={nurseForm.username}
                                                    onChange={handleNurseChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">Password</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className="form-control premium-select"
                                                    value={nurseForm.password}
                                                    onChange={handleNurseChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">Full Name</label>
                                                <input
                                                    name="fullName"
                                                    className="form-control premium-select"
                                                    value={nurseForm.fullName}
                                                    onChange={handleNurseChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control premium-select"
                                                    value={nurseForm.email}
                                                    onChange={handleNurseChange}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">Phone</label>
                                                <input
                                                    name="phone"
                                                    className="form-control premium-select"
                                                    value={nurseForm.phone}
                                                    onChange={handleNurseChange}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">DOB</label>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    className="form-control premium-select"
                                                    value={nurseForm.dob}
                                                    onChange={handleNurseChange}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">CCCD</label>
                                                <input
                                                    name="CCCD"
                                                    className="form-control premium-select"
                                                    value={nurseForm.CCCD}
                                                    onChange={handleNurseChange}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">Gender</label>
                                                <select
                                                    name="gender"
                                                    className="form-select premium-select"
                                                    value={nurseForm.gender}
                                                    onChange={handleNurseChange}
                                                >
                                                    <option value="0">Female</option>
                                                    <option value="1">Male</option>
                                                </select>
                                            </div>
                                            <div className="col-9">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">Address</label>
                                                <input
                                                    name="address"
                                                    className="form-control premium-select"
                                                    value={nurseForm.address}
                                                    onChange={handleNurseChange}
                                                />
                                            </div>
                                            <div className="col-3">
                                                <label className="form-label fw-semibold text-secondary small text-uppercase">Image URL</label>
                                                <input
                                                    name="image"
                                                    className="form-control premium-select"
                                                    value={nurseForm.image}
                                                    onChange={handleNurseChange}
                                                    placeholder="./images/nurse-1.jpg"
                                                />
                                            </div>
                                            <div className="col-12 mt-4 text-end">
                                                <button type="submit" className="btn-premium-add d-inline-block">
                                                    Save Nurse
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    <hr />
                                    <NurseTable key={nurseReloadKey} />
                                </div>
                            )}

                            {/* ========= Patients Tab ========= */}
                            {activeTab === "patients" && (
                                <div className="mt-3">
                                    <h4 className="admin-header-title mb-3">Patient List</h4>
                                    <PatientTable />
                                </div>
                            )}

                            {/* ========= News Tab ========= */}
                            {activeTab === "news" && (
                                <div className="mt-3">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="admin-header-title mb-0">News Management</h4>
                                    </div>

                                    <form className="row g-3 mb-4 admin-feature-card" onSubmit={handleCreateNews}>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold text-secondary small text-uppercase">Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                className="form-control premium-select"
                                                value={newsForm.title}
                                                onChange={handleNewsFormChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label fw-semibold text-secondary small text-uppercase">Date</label>
                                            <input
                                                type="date"
                                                name="date"
                                                className="form-control premium-select"
                                                value={newsForm.date}
                                                onChange={handleNewsFormChange}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label fw-semibold text-secondary small text-uppercase">Author</label>
                                            <input
                                                type="text"
                                                name="author"
                                                className="form-control premium-select"
                                                value={newsForm.author}
                                                onChange={handleNewsFormChange}
                                                placeholder="Admin name"
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-semibold text-secondary small text-uppercase">
                                                Image URL (or upload below)
                                            </label>
                                            <input
                                                type="text"
                                                name="image"
                                                className="form-control premium-select mb-2"
                                                value={newsForm.image}
                                                onChange={handleNewsFormChange}
                                                placeholder="./images/banner1.webp hoặc http://..."
                                            />

                                            <div className="d-flex gap-2 align-items-center">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="form-control premium-select"
                                                    onChange={handleImageFileChange}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary"
                                                    onClick={handleUploadImage}
                                                    disabled={uploading}
                                                >
                                                    {uploading ? "Uploading..." : "Upload"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-semibold text-secondary small text-uppercase">Body</label>
                                            <textarea
                                                name="body"
                                                className="form-control premium-select"
                                                rows={3}
                                                value={newsForm.body}
                                                onChange={handleNewsFormChange}
                                                placeholder="News content..."
                                            />
                                        </div>
                                        <div className="col-12 mt-4 text-end">
                                            <button type="submit" className="btn-premium-add d-inline-block">
                                                Publish News
                                            </button>
                                        </div>
                                    </form>
                                    <div className="table-responsive">
                                        <table className="premium-table">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Title</th>
                                                    <th>Date</th>
                                                    <th>Author</th>
                                                    <th>Image</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {newsList.map((n) => (
                                                    <tr key={n.newID}>
                                                        <td>{n.newID}</td>
                                                        <td>{n.title}</td>
                                                        <td>{n.date}</td>
                                                        <td>{n.author}</td>
                                                        <td>
                                                            {n.image && (
                                                                <img
                                                                    src={getImageSrc(n.image)}
                                                                    alt={n.title}
                                                                    style={{
                                                                        width: "80px",
                                                                        height: "40px",
                                                                        objectFit: "cover",
                                                                    }}
                                                                />
                                                            )}
                                                        </td>

                                                        <td>
                                                            {n.isActive ? (
                                                                <span className="premium-badge premium-badge-green">
                                                                    Active
                                                                </span>
                                                            ) : (
                                                                <span className="premium-badge premium-badge-gray">
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button
                                                                className={
                                                                    n.isActive ? "btn-action-delete" : "btn-action-edit"
                                                                }
                                                                style={n.isActive ? {} : { background: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0" }}
                                                                onClick={() => handleToggleNewsStatus(n)}
                                                            >
                                                                {n.isActive ? "Inactive" : "Active"}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {newsList.length === 0 && (
                                                    <tr>
                                                        <td colSpan={7} className="text-center text-muted">
                                                            No news yet. Create one above.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            {activeTab === "medicines" && (

                                <div className="mt-3">

                                    <h4 className="admin-header-title mb-3">
                                        Medicine Management
                                    </h4>

                                    <form className="row g-3 mb-4" onSubmit={handleCreateMedicine}>

                                        <div className="col-md-3">
                                            <label className="form-label">Medicine Name</label>
                                            <input
                                                name="medicineName"
                                                className="form-control"
                                                value={medicineForm.medicineName}
                                                onChange={handleMedicineChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-3">
                                            <label className="form-label">Generic Name</label>
                                            <input
                                                name="genericName"
                                                className="form-control"
                                                value={medicineForm.genericName}
                                                onChange={handleMedicineChange}
                                            />
                                        </div>

                                        <div className="col-md-2">
                                            <label className="form-label">Form</label>
                                            <input
                                                name="dosageForm"
                                                className="form-control"
                                                placeholder="Tablet"
                                                value={medicineForm.dosageForm}
                                                onChange={handleMedicineChange}
                                            />
                                        </div>

                                        <div className="col-md-2">
                                            <label className="form-label">Strength</label>
                                            <input
                                                name="strength"
                                                className="form-control"
                                                placeholder="500mg"
                                                value={medicineForm.strength}
                                                onChange={handleMedicineChange}
                                            />
                                        </div>

                                        <div className="col-md-12">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                name="description"
                                                className="form-control"
                                                rows={2}
                                                value={medicineForm.description}
                                                onChange={handleMedicineChange}
                                            />
                                        </div>

                                        <div className="col-12">
                                            <button className="btn btn-success">
                                                Add Medicine
                                            </button>
                                        </div>

                                    </form>

                                    <hr />

                                    <MedicineTable key={medicineReloadKey} />

                                </div>

                            )}

                            {/* ========= Rooms Tab ========= */}
                            {activeTab === "rooms" && (
                                <div className="mt-3">
                                    <AdminRooms />
                                </div>
                            )}

                            {/* ========= Beds Tab ========= */}
                            {activeTab === "beds" && (
                                <div className="mt-3">
                                    <AdminBeds />
                                </div>
                            )}

                            {/* ========= Test Types Tab ========= */}
                            {activeTab === "testtypes" && (
                                <div className="mt-3">
                                    <AdminTestTypes />
                                </div>
                            )}

                            {/* ========= Test Items Tab ========= */}
                            {activeTab === "testitems" && (
                                <div className="mt-3">
                                    <AdminTestItems />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
