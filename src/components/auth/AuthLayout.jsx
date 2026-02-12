import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/RouteConstants';
import { IMAGES } from '../../utils/constants';

const AuthLayout = ({ children, title, subtitle, image }) => {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 bg-white animate-in slide-in-from-left duration-500">
                <div className="w-full max-w-md mx-auto space-y-8">
                    <div className="flex items-center gap-2 mb-8">
                        <Link to={ROUTES.HOME} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">F</span>
                            </div>
                            <span className="font-bold text-lg text-gray-900">FoodDelivery</span>
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
                        <p className="text-gray-500">{subtitle}</p>
                    </div>

                    {children}
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden md:block relative bg-gray-900 overflow-hidden">
                <img
                    src={image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&q=80"}
                    alt="Food"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent p-12 flex flex-col justify-end">
                    <h2 className="text-4xl font-bold text-white mb-4">Delicious food delivered to your doorstep.</h2>
                    <p className="text-gray-300 text-lg">Order from thousands of restaurants.</p>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
