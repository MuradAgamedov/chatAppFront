export const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
};

export const saveUserToStorage = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
};

export const removeUserFromStorage = () => {
    localStorage.removeItem("user");
};
