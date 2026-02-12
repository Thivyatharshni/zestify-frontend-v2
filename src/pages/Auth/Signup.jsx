import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import SignupForm from '../../components/auth/SignupForm';

const Signup = () => {
    return (
        <AuthLayout
            title="Create account"
            subtitle="Sign up to start ordering food."
            image="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&q=80"
        >
            <SignupForm />
        </AuthLayout>
    );
};

export default Signup;
