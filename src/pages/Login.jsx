import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import loginUser from "../redux/actions/loginUser.js";
import RightPanel from "../components/RightPanel.jsx";
import { Link } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, errorMessage, user } = useSelector((state) => state.auth);

    // 🔥 Əgər istifadəçi artıq login olubsa, onu ana səhifəyə yönləndiririk
    useEffect(() => {
        if (user) {
            navigate("/");  // Ana səhifəyə yönləndirmək
        }
    }, [user, navigate]);

    // 🔥 Form göndərildikdə
    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            email: e.target.email.value,
            password: e.target.password.value,
        };
        dispatch(loginUser(userData));  // Redux ilə login funksiyasını çağırırıq
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div>
                        <img
                            src="https://drive.google.com/uc?export=view&id=1MFiKAExRFF0-2YNpAZzIu1Sh52J8r16v"
                            className="mx-auto w-full max-w-xs"
                            alt="Логотип"
                        />
                    </div>
                    <div className="mt-12 flex flex-col items-center">
                        <div className="w-full flex-1 mt-8">
                            <div className="mx-auto max-w-xs">
                                <form onSubmit={handleSubmit}>
                                    <input
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                        type="email"
                                        placeholder="Электронная почта"
                                        name="email"
                                    />
                                    <input
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                        type="password"
                                        placeholder="Пароль"
                                        name="password"
                                    />
                                    <button
                                        type="submit"
                                        className="mt-5 tracking-wide font-semibold bg-green-400 text-white w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                        disabled={loading}
                                    >
                                        {loading ? "Загрузка..." : "Войти"}
                                    </button>

                                    {/* Error message from backend */}
                                    {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

                                    <div className="mt-4 text-center">
                                        <span className="text-gray-600 text-sm">У вас уже есть аккаунт? </span>
                                        <Link to="/auth/register" className="text-blue-500 hover:text-blue-700 font-semibold">
                                            Зарегистрироваться
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <RightPanel />
            </div>
        </div>
    );
};

export default Login;
