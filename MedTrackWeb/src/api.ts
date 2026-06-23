import axios from "axios";

const API = axios.create({
//     baseURL: "https://projectb-medtrack.onrender.com",
    baseURL: "http://localhost:3000",
    timeout: 15000, // ⬅️ prevents hanging requests
});

// ================= REQUEST INTERCEPTOR =================
API.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ================= RESPONSE INTERCEPTOR =================
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        // ================= 401: AUTH ERROR =================
        if (status === 401) {
            sessionStorage.removeItem("token");

            // safer than hard reload redirect
            window.location.replace("/login");

            return Promise.reject(error);
        }

        // ================= NETWORK ERROR =================
        // (backend sleeping, no internet, DNS, timeout)
        if (!error.response) {
            console.warn("Network error or server not reachable");
            return Promise.reject(error);
        }

        // ================= SERVER ERRORS =================
        if ([500, 502, 503, 504].includes(status)) {
            console.warn("Server error:", status);
            return Promise.reject(error); // ❌ NO redirect
        }

        // ================= DEFAULT =================
        return Promise.reject(error);
    }
);

export default API;