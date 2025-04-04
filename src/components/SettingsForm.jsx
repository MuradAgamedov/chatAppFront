import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";  // Импорт SweetAlert
const apiUrl = import.meta.env.VITE_API_URL;


const SettingsForm = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);  // Получаем данные пользователя из Redux

    // Состояния для формы
    const [email, setEmail] = useState(user?.user?.email || "");
    const [avatar, setAvatar] = useState(user?.user?.avatarUrl || null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(user?.user?.phoneNumber || "");
    const [userName, setUserName] = useState(user?.user?.userName || "");
    const [fullName, setFullName] = useState(user?.user?.fullName || "");
    const [gender, setGender] = useState(user?.user?.gender || "");
    const currentAvatarUrl = user?.user?.avatarUrl || avatar;
    // Загружаем данные из localStorage при монтировании компонента
    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (savedUser) {
            setEmail(savedUser.user?.email);
            setAvatar(savedUser.user?.avatarUrl);
            setPhoneNumber(savedUser.user?.phoneNumber);
            setUserName(savedUser.user?.userName);
            setFullName(savedUser.user?.fullName);
            setGender(savedUser.user?.gender);

        }

    }, []);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);

            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);  
        }
    };








    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            Swal.fire({
                title: 'Ошибка!',
                text: 'Email не может быть пустым.',
                icon: 'error',
                confirmButtonText: 'ОК'
            });
            return;
        }

        const formData = new FormData();
        formData.append("email", email);

        if (avatar) {
            formData.append("avatarUrl", avatar);  
        } else {
            formData.append("avatarUrl", currentAvatarUrl); 
        }
        formData.append("phoneNumber", phoneNumber);
        formData.append("userName", userName);
        formData.append("fullName", fullName);
        formData.append("gender", gender);

        try {
            const savedUser = JSON.parse(localStorage.getItem("user"));
            const token = savedUser?.token;

            const response = await axios.put(`${apiUrl}/api/user/update-by-email`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}` 
                }
            });


            if (response.status === 200) {
                dispatch({
                    type: "UPDATE_USER",
                    payload: response.data
                });

                let user = { user: response.data };
                    localStorage.setItem("user", JSON.stringify({
                        token: response.data.token,
                        user: response.data.user
                    }));

                setTimeout(window.location.reload(), 1000)
            }
        } catch (error) {
            console.error("Ошибка при обновлении данных", error);
            Swal.fire({
                title: 'Ошибка!',
                text: 'Произошла ошибка при обновлении данных.',
                icon: 'error',
                confirmButtonText: 'ОК'
            });
        }
    };





    return (
        <div style={{ height: '100vh' }} className="w-full border flex flex-col p-4 bg-white shadow-lg">
            <div className="py-4 px-6 bg-grey-lighter flex flex-col items-center">
                <h1 className="text-xl font-semibold text-grey-darkest"><a href="/">Главная</a>→</h1>
                <h2 className="text-xl font-semibold text-grey-darkest">Обновить профиль</h2>
            </div>

            <div className="flex flex-col space-y-4 p-6">
                <div className="flex flex-col items-center">
                    <label className="text-lg text-grey-darkest">Аватар профиля</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="mt-2 border-2 border-gray-300 rounded-lg p-2"
                    />
                    {avatarPreview && (
                        <div className="mt-4">
                            <img
                                src={avatarPreview}
                                alt="Предпросмотр аватара"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        </div>
                    )}

                    {avatar && !avatarPreview && (
                        <div className="mt-4">
                            <img
                                src={apiUrl+avatar}
                                alt="Аватар пользователя"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        </div>
                    )}

                </div>

                <div className="flex flex-col">
                    <label className="text-lg text-grey-darkest">Номер телефона</label>
                    <input
                        type="tel"
                        placeholder="Введите ваш номер телефона"
                        value={phoneNumber != "null" ? phoneNumber : ""}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="mt-2 border-2 border-gray-300 rounded-lg p-2"
                    />

                </div>

                <div className="flex flex-col">
                    <label className="text-lg text-grey-darkest">Имя пользователя</label>
                    <input
                        type="text"
                        placeholder="Введите имя пользователя"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="mt-2 border-2 border-gray-300 rounded-lg p-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-lg text-grey-darkest">Полное имя</label>
                    <input
                        type="text"
                        placeholder="Введите ваше полное имя"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-2 border-2 border-gray-300 rounded-lg p-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-lg text-grey-darkest">Пол</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="mt-2 border-2 border-gray-300 rounded-lg p-2"
                    >
                        <option value="">Выберите пол</option>
                        <option value="male">Мужской</option>
                        <option value="female">Женский</option>
                        <option value="other">Другой</option>
                    </select>
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                    >
                        Сохранить изменения
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsForm;
