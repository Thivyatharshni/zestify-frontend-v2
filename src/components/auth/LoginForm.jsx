import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/RouteConstants';
import { authApi } from '../../services/authApi';
import Button from '../common/Button';
import PasswordInput from './PasswordInput';

const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            console.log('Attempting login with:', { email });
            const response = await authApi.login(email, password);
            console.log('Login response:', response);

            const { user, token } = response;
            if (!token || !user) {
                throw 'Invalid response from server';
            }

            login(user, token);

            // Role-based dashboard redirect
            const dashboardMap = {
                'super_admin': '/admin/dashboard',
                'restaurant_admin': '/restaurant/dashboard',
                'delivery_partner': '/delivery/dashboard',
                'user': '/'
            };

            const redirectPath = dashboardMap[user.role] || '/';
            navigate(redirectPath, { replace: true });
        } catch (err) {
            console.error('Login failed:', err);
            setError(typeof err === 'string' ? err : err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                <Button type="submit" variant="primary" className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700" isLoading={loading}>
                    Login
                </Button>
            </form>

            <div className="text-center text-sm text-gray-600 mt-6">
                Don't have an account? <a href={ROUTES.SIGNUP} className="text-blue-700 font-bold hover:underline">Sign up</a>
            </div>
        </div>
    );
};

export default LoginForm;
