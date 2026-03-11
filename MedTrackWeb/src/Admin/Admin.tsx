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
        "doctors" | "nurses" | "patients" | "news"
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
            return `http://localhost:3000${image}`;
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
                        <div className="border whiteBg dropShadow padding">
                            {/* Tabs */}
                            <ul className="nav nav-pills mb-3">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "doctors" ? "active" : ""
                                            }`}
                                        onClick={() => setActiveTab("doctors")}
                                    >
                                        Doctors
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "nurses" ? "active" : ""
                                            }`}
                                        onClick={() => setActiveTab("nurses")}
                                    >
                                        Nurses
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "patients" ? "active" : ""
                                            }`}
                                        onClick={() => setActiveTab("patients")}
                                    >
                                        Patients
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "news" ? "active" : ""
                                            }`}
                                        onClick={() => setActiveTab("news")}
                                    >
                                        News Management
                                    </button>
                                </li>
                            </ul>

                            {/* ========= Doctors Tab ========= */}
                            {activeTab === "doctors" && (
                                <div className="mt-3">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4 className="blueText mb-0">Doctor Account Management</h4>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() =>
                                                setShowDoctorForm((prev) => !prev)
                                            }
                                        >
                                            {showDoctorForm ? "Close form" : "Create Doctor Account"}
                                        </button>
                                    </div>

                                    {showDoctorForm && (
                                        <form
                                            className="row g-3 mb-4 border rounded-3 p-3 bg-light"
                                            onSubmit={handleCreateDoctor}
                                        >
                                            <div className="col-md-3">
                                                <label className="form-label">Username</label>
                                                <input
                                                    name="username"
                                                    className="form-control"
                                                    value={doctorForm.username}
                                                    onChange={handleDoctorChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Password</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className="form-control"
                                                    value={doctorForm.password}
                                                    onChange={handleDoctorChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Full Name</label>
                                                <input
                                                    name="fullName"
                                                    className="form-control"
                                                    value={doctorForm.fullName}
                                                    onChange={handleDoctorChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control"
                                                    value={doctorForm.email}
                                                    onChange={handleDoctorChange}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-3">
                                                <label className="form-label">Phone</label>
                                                <input
                                                    name="phone"
                                                    className="form-control"
                                                    value={doctorForm.phone}
                                                    onChange={handleDoctorChange}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">DOB</label>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    className="form-control"
                                                    value={doctorForm.dob}
                                                    onChange={handleDoctorChange}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">CCCD</label>
                                                <input
                                                    name="CCCD"
                                                    className="form-control"
                                                    value={doctorForm.CCCD}
                                                    onChange={handleDoctorChange}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Gender</label>
                                                <select
                                                    name="gender"
                                                    className="form-select"
                                                    value={doctorForm.gender}
                                                    onChange={handleDoctorChange}
                                                >
                                                    <option value="0">Female</option>
                                                    <option value="1">Male</option>
                                                </select>
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label">Address</label>
                                                <input
                                                    name="address"
                                                    className="form-control"
                                                    value={doctorForm.address}
                                                    onChange={handleDoctorChange}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <button type="submit" className="btn btn-success">
                                                    Create Doctor
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
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4 className="blueText mb-0">Nurse Account Management</h4>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() =>
                                                setShowNurseForm((prev) => !prev)
                                            }
                                        >
                                            {showNurseForm ? "Close form" : "Create Nurse Account"}
                                        </button>
                                    </div>

                                    {showNurseForm && (
                                        <form
                                            className="row g-3 mb-4 border rounded-3 p-3 bg-light"
                                            onSubmit={handleCreateNurse}
                                        >
                                            <div className="col-md-3">
                                                <label className="form-label">Username</label>
                                                <input
                                                    name="username"
                                                    className="form-control"
                                                    value={nurseForm.username}
                                                    onChange={handleNurseChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Password</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className="form-control"
                                                    value={nurseForm.password}
                                                    onChange={handleNurseChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Full Name</label>
                                                <input
                                                    name="fullName"
                                                    className="form-control"
                                                    value={nurseForm.fullName}
                                                    onChange={handleNurseChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control"
                                                    value={nurseForm.email}
                                                    onChange={handleNurseChange}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-3">
                                                <label className="form-label">Phone</label>
                                                <input
                                                    name="phone"
                                                    className="form-control"
                                                    value={nurseForm.phone}
                                                    onChange={handleNurseChange}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">DOB</label>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    className="form-control"
                                                    value={nurseForm.dob}
                                                    onChange={handleNurseChange}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">CCCD</label>
                                                <input
                                                    name="CCCD"
                                                    className="form-control"
                                                    value={nurseForm.CCCD}
                                                    onChange={handleNurseChange}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Gender</label>
                                                <select
                                                    name="gender"
                                                    className="form-select"
                                                    value={nurseForm.gender}
                                                    onChange={handleNurseChange}
                                                >
                                                    <option value="0">Female</option>
                                                    <option value="1">Male</option>
                                                </select>
                                            </div>
                                            <div className="col-9">
                                                <label className="form-label">Address</label>
                                                <input
                                                    name="address"
                                                    className="form-control"
                                                    value={nurseForm.address}
                                                    onChange={handleNurseChange}
                                                />
                                            </div>
                                            <div className="col-3">
                                                <label className="form-label">Image URL</label>
                                                <input
                                                    name="image"
                                                    className="form-control"
                                                    value={nurseForm.image}
                                                    onChange={handleNurseChange}
                                                    placeholder="./images/nurse-1.jpg"
                                                />
                                            </div>
                                            <div className="col-12">
                                                <button type="submit" className="btn btn-success">
                                                    Create Nurse
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
                                    <h4 className="blueText mb-3">Patient List</h4>
                                    <PatientTable />
                                </div>
                            )}

                            {/* ========= News Tab ========= */}
                            {activeTab === "news" && (
                                <div className="mt-3">
                                    <h4 className="blueText mb-3">News Management</h4>

                                    <form className="row g-3 mb-4" onSubmit={handleCreateNews}>
                                        <div className="col-md-6">
                                            <label className="form-label">Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                className="form-control"
                                                value={newsForm.title}
                                                onChange={handleNewsFormChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Date</label>
                                            <input
                                                type="date"
                                                name="date"
                                                className="form-control"
                                                value={newsForm.date}
                                                onChange={handleNewsFormChange}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Author</label>
                                            <input
                                                type="text"
                                                name="author"
                                                className="form-control"
                                                value={newsForm.author}
                                                onChange={handleNewsFormChange}
                                                placeholder="Admin name"
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label">
                                                Image URL (or upload below)
                                            </label>
                                            <input
                                                type="text"
                                                name="image"
                                                className="form-control mb-2"
                                                value={newsForm.image}
                                                onChange={handleNewsFormChange}
                                                placeholder="./images/banner1.webp hoặc http://..."
                                            />

                                            <div className="d-flex gap-2 align-items-center">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="form-control"
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
                                            <label className="form-label">Body</label>
                                            <textarea
                                                name="body"
                                                className="form-control"
                                                rows={3}
                                                value={newsForm.body}
                                                onChange={handleNewsFormChange}
                                                placeholder="News content..."
                                            />
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-success">
                                                Publish News
                                            </button>
                                        </div>
                                    </form>
                                    <div className="table-responsive">
                                        <table className="table table-striped table-bordered ">
                                            <thead className="table-light">
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
                                                                <span className="badge bg-success">
                                                                    Active
                                                                </span>
                                                            ) : (
                                                                <span className="badge bg-secondary">
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button
                                                                className={`btn btn-sm ${n.isActive
                                                                    ? "btn-outline-secondary"
                                                                    : "btn-outline-success"
                                                                    }`}
                                                                onClick={() => handleToggleNewsStatus(n)}
                                                            >
                                                                {n.isActive ? "Unactive" : "Active"}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
