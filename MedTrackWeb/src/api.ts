import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api",
});

// ================= REQUEST INTERCEPTOR =================
API.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// ================= RESPONSE INTERCEPTOR =================
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const code = error?.response?.data?.code;

        if (
            error?.response?.status === 401 &&
            (code === "TOKEN_EXPIRED" || code === "INVALID_TOKEN")
        ) {
            // 🔥 clear session toàn bộ
            sessionStorage.clear();

            alert("Session expired. Please login again.");

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default API;