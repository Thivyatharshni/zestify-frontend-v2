import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        const dashboardMap = {
            'super_admin': '/admin/dashboard',
            'restaurant_admin': '/restaurant/dashboard',
            'delivery_partner': '/delivery/dashboard',
            'user': '/'
        };

        const userDashboard = dashboardMap[user.role] || '/';
        return <Navigate to={userDashboard} replace />;
    }

    return children;
};

export default RoleProtectedRoute;
