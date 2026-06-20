import axios from "axios";

const API = axios.create({
   // baseURL: "http://localhost:3000",
   baseURL: "https://projectb-medtrack.onrender.com",
});

// REQUEST
API.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// RESPONSE
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        // Token hết hạn
        if (status === 401) {
            sessionStorage.clear();
            window.location.href = "/login";
            return Promise.reject(error);
        }

        // Các lỗi server
        if (
            status === 500 ||
            status === 502 ||
            status === 503 ||
            status === 504
        ) {
            window.location.href = "/error";
            return Promise.reject(error);
        }

        // Backend tắt / mất mạng / timeout
        if (!error.response) {
            window.location.href = "/error";
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default API;