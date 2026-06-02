import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://192.168.2.5:3000';

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Tự động đính kèm Token trước khi gửi request
axiosClient.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Xử lý lỗi trả về từ Backend
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Tích hợp logic ép đăng xuất tại đây
            console.error("Token expired or unauthorized access");
        }
        return Promise.reject(error);
    }
);

export default axiosClient;