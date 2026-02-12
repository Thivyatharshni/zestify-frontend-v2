import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/RouteConstants';
import { authApi } from '../../services/authApi';
import Button from '../common/Button';
import PasswordInput from './PasswordInput';

const SignupForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Attempting signup with:', { name, email, phone });
            const response = await authApi.signup(name, email, password, phone);
            console.log('Signup response:', response);

            const { user, token } = response;
            if (!token || !user) {
                throw 'Invalid response from server';
            }

            login(user, token);

            // Redirect to return URL or home
            const returnUrl = location.state?.returnUrl || ROUTES.HOME;
            navigate(returnUrl, { replace: true });
        } catch (err) {
            console.error('Signup failed:', err);
            setError(typeof err === 'string' ? err : err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

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
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                />
            </div>

            <Button type="submit" variant="primary" className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700" isLoading={loading}>
                Create Account
            </Button>

            <div className="text-center text-sm text-gray-600 mt-6">
                Already have an account? <a href={ROUTES.LOGIN} className="text-blue-700 font-bold hover:underline">Log in</a>
            </div>
        </form>
    );
};

export default SignupForm;
