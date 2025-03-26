import loginUser from "../redux/actions/loginUser.js";
import { saveUserToStorage } from "../utils/localStorageUtils";

const loginReducers = (builder) => {
    builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.errorMessage = null;
            state.successMessage = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.successMessage = "Login uğurla tamamlandı!";
            state.errorMessage = null;
            saveUserToStorage(action.payload);
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = action.payload;
            state.successMessage = null;
        });
};

export default loginReducers;
