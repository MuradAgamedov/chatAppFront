// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';  // Лейаут для обычных страниц
import AuthLayout from './layouts/AuthLayout.jsx';  // Лейаут для аутентификации
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Settings from './pages/Settings.jsx';
const App = () => {
    return (
        <Router>
            <Routes>
                {/* Главный layout (для обычных страниц) */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>

                {/* Layout для логина и регистрации */}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
