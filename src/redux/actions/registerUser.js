import { createAsyncThunk } from "@reduxjs/toolkit";
import { registerAPI } from "../../api";

// 🔹 Qeydiyyat üçün Redux thunk
const registerUser = createAsyncThunk(
    "auth/register",
    async (userData, thunkAPI) => {
        try {
            const response = await registerAPI(userData); // API call

            // 🔥 Əgər istədiyin varsa — məsələn, token gəlibsə onu yadda saxla
            if (response.token) {
                localStorage.setItem("token", response.token);
            }

            // 🔥 Burada məsələn, redirect və ya success toast call yazmaq da olar (əgər istənilirsə)
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export default registerUser;
