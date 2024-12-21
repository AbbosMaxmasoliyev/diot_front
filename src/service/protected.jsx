import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from "../utils/tokenUtils"
import { Navbar } from '../components/Navbar';
const ProtectedRoute = ({ children }) => {

    const token = getToken();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return (
        <>
            <div className="">
                {children}

            </div>
        </>
    );
};

export default ProtectedRoute;