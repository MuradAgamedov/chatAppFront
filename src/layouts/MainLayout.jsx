// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div>

            <div>
                {/* Top bar (could be your header/nav) */}
                <div className="w-full h-32" style={{backgroundColor: "#449388"}}></div>
                <Outlet />

            </div>
        </div>
    );
};

export default MainLayout;
