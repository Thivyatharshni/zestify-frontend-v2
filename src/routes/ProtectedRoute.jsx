import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from './RouteConstants';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');

    if (!token) {
        // Redirect to login with return URL
        return <Navigate to={ROUTES.LOGIN} state={{ returnUrl: location.pathname }} replace />;
    }

    return children;
};

export default ProtectedRoute;
