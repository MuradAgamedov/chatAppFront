import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/authReducer.js"; // Redux slice-ləri import et

const store = configureStore({
    reducer: {
        auth: authReducer, // Auth state idarə etmək üçün reducer
    }
});

export default store;
