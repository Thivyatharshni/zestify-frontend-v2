import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/RouteConstants';
import Button from '../components/common/Button';

const NotFound = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Page Not Found</h2>
            <p className="text-gray-500 mt-2 mb-8 max-w-sm">
                The page you are looking for might have been removed or is temporarily unavailable.
            </p>
            <Link to={ROUTES.HOME}>
                <Button variant="primary" size="lg">Go to Home</Button>
            </Link>
        </div>
    );
};

export default NotFound;
