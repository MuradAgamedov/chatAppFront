import registerUser from "../redux/actions/registerUser";


const registerReducers = (builder) => {
    builder
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.errorMessage = null;
            state.successMessage = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.successMessage = action.payload.message || "Регистрация успешно завершена!";
            state.errorMessage = null;

        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = action.payload;
            state.successMessage = null;
        });
};

export default registerReducers;
