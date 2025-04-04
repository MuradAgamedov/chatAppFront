import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI } from "../../api"; // API funksiyasını import edirik

// 🔹 Login üçün Redux thunk
const loginUser = createAsyncThunk(
    "auth/login",
    async (userData, thunkAPI) => {
        try {
            console.log("Sending login request with data:", userData); // Daxil olan məlumatları log edin
            const response = await loginAPI(userData); // `loginAPI` funksiyasını çağırırıq
            return response;
        } catch (error) {
            console.error("Login error:", error); // Xətanı log edin
            return thunkAPI.rejectWithValue(error.message); // Xətanı `rejected` olaraq göndəririk
        }
    }
);

export default loginUser; // Default export edirik
