import { jwtDecode } from "jwt-decode";

export default function getUserIDFromToken () {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded: any = jwtDecode(token);
        return decoded.userID; // Extract userID from token
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};