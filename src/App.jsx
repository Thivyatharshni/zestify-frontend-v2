import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <LocationProvider>
                    <CartProvider>
                        <AppRoutes />
                    </CartProvider>
                </LocationProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
