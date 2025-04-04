import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const API_URL = apiUrl + "/api/auth";

export const registerAPI = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Qeydiyyat uğursuz oldu.");
    }
};

export const loginAPI = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Login uğursuz oldu.");
    }
};
