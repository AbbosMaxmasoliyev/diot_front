import React, { Suspense, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './ThemeContext';
import api from './api';
import { getToken, removeToken } from './utils/tokenUtils';

import Products from './components/Products';
import Customers from './components/Customers';
import Orders from './components/Orders';
import Sales from './components/Sales';
import InventoryList from './components/InventoryList';
import InventoryItem from './components/InventoryItem';
import Home from './components/Home';
import Supplies from './components/Supplies';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ProtectedRoute from './service/protected';
import { Navbar } from './components/Navbar';

// Loading fallback component
function LoadingFallback() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
            <p className="text-gray-800 dark:text-gray-200 text-lg">Loading...</p>
        </div>
    );
}

// Error fallback component
function ErrorFallback({ error }) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
            <p className="text-red-500 text-lg">An error occurred: {error?.message}</p>
        </div>
    );
}

// Main layout component
function Layout() {
    const { isDark } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            const token = getToken();
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                await api.get('/validate-token');
            } catch (error) {
                console.error('Token validation failed:', error);
                removeToken();
                navigate('/login');
            }
        };

        validateToken();
    }, [navigate]);

    return (
        <div className={`${isDark ? 'dark bg-gray-900' : ''} min-h-screen`}>
            <Navbar />
            <main className="md:p-5 bg-gray-100 dark:bg-gray-900 ">
                <div className="container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

// App component with router configuration
function App() {
    const router = createBrowserRouter([
        {
            element: <Layout />,
            errorElement: <ErrorFallback />,
            children: [
                { path: '/login', element: <Login /> },
                { path: '/signup', element: <SignUp /> },
                {
                    path: '/',
                    element: (
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: '/products',
                    element: (
                        <ProtectedRoute>
                            <Products />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: '/customers',
                    element: (
                        <ProtectedRoute>
                            <Customers />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: '/inventory',
                    element: (
                        <ProtectedRoute>
                            <InventoryList />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: '/inventory-item/:id',
                    element: (
                        <ProtectedRoute>
                            <InventoryItem />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: '/sales',
                    element: (
                        <ProtectedRoute>
                            <Sales />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: '/supply',
                    element: (
                        <ProtectedRoute>
                            <Supplies />
                        </ProtectedRoute>
                    ),
                },
            ],
        },
    ]);

    return (
        <ThemeProvider>
                <Suspense fallback={<LoadingFallback />}>
                    <RouterProvider router={router} />
                </Suspense>
        </ThemeProvider>
    );
}

export default App;
