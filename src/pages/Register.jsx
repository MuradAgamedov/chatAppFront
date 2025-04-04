import React, { useEffect } from "react"; // Импортируем useEffect
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerValidationSchema } from "../validations/validationSchema"; // 🔥 Yeni fayldan import edirik
import { useDispatch, useSelector } from "react-redux";
import registerUser from "../redux/actions/registerUser.js";
import RightPanel from "../components/RightPanel.jsx";
import { Link } from "react-router-dom";

const Register = () => {
    const dispatch = useDispatch();
    const { loading, errorMessage, successMessage } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(registerValidationSchema)
    });

    const onSubmit = (data) => {
        dispatch(registerUser(data));
    };

    useEffect(() => {
        if (successMessage) {
            window.location.reload();
        }
    }, [successMessage]);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div className="mt-12 flex flex-col items-center">
                        <div className="w-full flex-1 mt-8">
                            <form className="mx-auto max-w-xs" onSubmit={handleSubmit(onSubmit)}>
                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="text"
                                    placeholder="Полное имя"
                                    {...register("fullName")}
                                />
                                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}

                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    type="email"
                                    placeholder="Электронная почта"
                                    {...register("email")}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    type="password"
                                    placeholder="Пароль"
                                    {...register("password")}
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

                                <button
                                    type="submit"
                                    className="mt-5 tracking-wide font-semibold bg-green-400 text-white w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                    disabled={loading}
                                >
                                    {loading ? "Регистрация..." : "Зарегистрироваться"}
                                </button>

                                {/* 🔥 Вывод сообщений об успехе или ошибке */}
                                {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
                                {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

                                <div className="mt-4 text-center">
                                    <span className="text-gray-600 text-sm">Уже есть аккаунт? </span>
                                    <Link to="/auth/login" className="text-blue-500 hover:text-blue-700 font-semibold">
                                        Войти
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <RightPanel /> 
            </div>
        </div>
    );
};

export default Register;
