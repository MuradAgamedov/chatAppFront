import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import loginUser from "@/redux/actions/loginUser.js";
import { logout } from "@/reducers/authReducer.js";
const apiUrl = import.meta.env.VITE_API_URL;

const LeftSectionHeader = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser && !user) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser) {
                    dispatch(loginUser.fulfilled(parsedUser));
                }
            } catch (error) {
                console.error("Ошибка парсинга user из localStorage:", error);
                localStorage.removeItem("user"); // Удаляем поврежденные данные
            }
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (user === null) {
            navigate("/auth/login");
        }
    }, [user, navigate]);

    const handleMenuToggle = () => {
        setShowMenu((prev) => !prev);
    };

    // Логика выхода
    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("user"); 
        navigate("/auth/login");
        alert("Выполняется выход из системы...");
    };

    return (
        <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
            <div>
                <img
                    className="w-10 h-10 rounded-full"
                    src={user?.user?.avatarUrl ? `${apiUrl}${user.user.avatarUrl}` : "default-avatar.png"}
                    alt="avatar"
                />
                <strong style={{
                    fontSize: '18px',
                    color: '#333',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {user?.user?.userName || user?.user?.fullName || "Гость"}
                </strong>
            </div>
            <div className="flex items-center">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="#727A7E" d="M12 20.664a9.163 9.163 0 0 1-6.521-2.702.977.977 0 0 1 1.381-1.381 7.269 7.269 0 0 0 10.024.244.977.977 0 0 1 1.313 1.445A9.192 9.192 0 0 1 12 20.664z"/>
                    </svg>
                </div>

               <div className="ml-4 cursor-pointer" onClick={() => navigate("/status/my")}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path
                        opacity=".55"
                        fill="#263238"
                        d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646z"
                        />
                    </svg>
                </div>


                <div className="ml-4 relative cursor-pointer" onClick={handleMenuToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="#263238" fillOpacity=".6" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"/>
                    </svg>

          
                    {showMenu && (
                        <div className="absolute right-0 mt-8 w-40 rounded shadow-lg bg-white border z-10">
                            <ul className="py-2">
                                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                    Настройки
                                </Link>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleLogout}>
                                    Выйти
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeftSectionHeader;
