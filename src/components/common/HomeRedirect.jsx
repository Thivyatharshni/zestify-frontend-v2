import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Component to redirect logged-in admins away from homepage
const HomeRedirect = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Only redirect if user is on homepage
        if (user && location.pathname === '/') {
            const dashboardMap = {
                'super_admin': '/admin/dashboard',
                'restaurant_admin': '/restaurant/dashboard',
                'delivery_partner': '/delivery/dashboard'
            };

            const redirectPath = dashboardMap[user.role];

            // If user has an admin role, redirect to their dashboard
            if (redirectPath) {
                navigate(redirectPath, { replace: true });
            }
        }
    }, [user, location.pathname, navigate]);

    return children;
};

export default HomeRedirect;
