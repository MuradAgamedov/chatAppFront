// userReducer.js
const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null, // Инициализация из localStorage
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'CLEAR_USER':
            return { ...state, user: null };
        default:
            return state;
    }
};

export default userReducer;
