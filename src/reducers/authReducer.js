import { createSlice } from "@reduxjs/toolkit";
import registerReducers from "./registerReducer";
import loginReducers from "./loginReducer.js";
import { loadUserFromStorage, removeUserFromStorage } from "../utils/localStorageUtils";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: loadUserFromStorage(),
        loading: false,
        errorMessage: null,
        successMessage: null
    },
    reducers: {
        clearMessages: (state) => {
            state.errorMessage = null;
            state.successMessage = null;
        },
        logout: (state) => {
            state.user = null;
            state.loading = false;
            state.errorMessage = null;
            state.successMessage = null;
            removeUserFromStorage();
        }
    },
    extraReducers: (builder) => {
        registerReducers(builder);
        loginReducers(builder);
    }
});

export const { clearMessages, logout } = authSlice.actions;
export default authSlice.reducer;
