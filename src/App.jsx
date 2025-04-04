// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Settings from './pages/Settings.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyStatuses from './pages/MyStatuses.jsx';
import UserStatuses from './pages/UserStatuses.jsx';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>

                <Route path="/status">
                    <Route path="my" element={<MyStatuses />} />
                    <Route path="user/:userId" element={<UserStatuses />} />
                </Route>


            </Routes>

            <ToastContainer position="top-right" autoClose={5000} />
        </Router>
    );
};

export default App;
