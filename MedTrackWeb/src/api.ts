// src/api.ts

import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
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
    (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const code = error?.response?.data?.code;

        if (
            status === 401 &&
            (code === "TOKEN_EXPIRED" ||
                code === "INVALID_TOKEN")
        ) {
            sessionStorage.clear();

            alert(
                "Your session has expired. Please login again."
            );

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default API;