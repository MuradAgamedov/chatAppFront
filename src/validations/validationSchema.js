import * as yup from "yup";

export const registerValidationSchema = yup.object({
    fullName: yup
        .string()
        .required("Полное имя обязательно для заполнения")
        .min(3, "Полное имя должно содержать минимум 3 символа")
        .max(100, "Полное имя не должно превышать 100 символов"),
    email: yup
        .string()
        .required("Электронная почта обязательна")
        .email("Неверный формат электронной почты"),
    password: yup
        .string()
        .required("Пароль обязателен")
        .min(6, "Пароль должен содержать минимум 6 символов")
        .max(50, "Пароль не должен превышать 50 символов")
});
