import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && currentUser.user.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default PrivateRoute;