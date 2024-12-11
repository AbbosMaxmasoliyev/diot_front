import React, { Suspense, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Link, Outlet, useNavigation, useLocation } from 'react-router-dom';
import Products from './components/Products';
import Customers from './components/Customers';
import Orders from './components/Orders';
import Sales from './components/Sales';
import InventoryList from './components/InventoryList';
import Home from './components/Home';
import Supplies from './components/Supplies';
import useInventory from './hooks/invetory';
import InventoryItem from './components/InventoryItem';
import api from './api';
import { ThemeProvider, useTheme } from './ThemeContext'; // ThemeContext'dan theme boshqaruvi uchun
import { ExitIcon, HamburgerMenuIcon, DoubleArrowLeftIcon } from '@radix-ui/react-icons';

// Yuklanish jarayonida fallback
function LoadingFallback() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
            <p className="text-gray-800 dark:text-gray-200 text-lg">Yuklanmoqda...</p>
        </div>
    );
}

// Xatoliklarni boshqarish uchun komponent
function ErrorFallback({ error }) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
            <p className="text-red-500 text-lg">Xatolik yuz berdi: {error?.message}</p>
        </div>
    );
}

// Asosiy layout komponenti
function Layout({ token }) {
    const { isDark, toggleTheme } = useTheme(); // Tema holatini olish va o'zgartirish
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Light va dark rejimni o'zgartirish
    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleToggleTheme = () => {
        toggleTheme();
    };

    return (
        <div className={isDark ? 'dark' : ''}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Navbar */}
                <nav className="flex md:hidden justify-between items-center p-5 mb-8 bg-white dark:bg-gray-800 shadow-lg rounded-md container">
                    <div className="flex items-center justify-between">
                        <button
                            className="lg:hidden p-2 text-2xl dark:text-white text-gray-800"
                            onClick={handleToggleMenu}
                        >
                            <HamburgerMenuIcon />
                        </button>
                        <button
                            onClick={handleToggleTheme}
                            className="p-2 text-xl text-gray-800 dark:text-white"
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>
                    </div>
                </nav>

                {/* Navbar (desktop) */}
                <nav className="hidden md:flex gap-4 p-5 mb-8 justify-between bg-white dark:bg-gray-800 container shadow-lg rounded-md">
                    <div className="flex gap-4">
                        <Link
                            to="/"
                            className="dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Bosh sahifa
                        </Link>
                        <Link
                            to="/products"
                            className="dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Mahsulotlar
                        </Link>
                        <Link
                            to="/customers"
                            className="dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Mijozlar
                        </Link>
                        <Link
                            to="/orders"
                            className="dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Buyurtmalar
                        </Link>
                        <Link
                            to="/inventory"
                            className="dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Ombor
                        </Link>
                        <Link
                            to="/sales"
                            className="dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Sotuv
                        </Link>
                        <Link
                            to="/supply"
                            className="dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Ta'minlovchilar
                        </Link>
                    </div>
                    <button
                        onClick={handleToggleTheme}
                        className="p-2 text-xl text-gray-800 dark:text-white"
                    >
                        {isDark ? '☀️' : '🌙'}
                    </button>
                </nav>

                {/* Sidebar (Hamburger menyu) */}
                <div
                    className={`lg:hidden fixed left-0 top-0 w-full h-[100vh] bg-gray-700 bg-opacity-90 z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}
                    onClick={handleToggleMenu}
                >
                    <div className="flex flex-col bg-gray-700 bg-opacity-90" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="lg:hidden p-2 text-2xl dark:text-white text-black self-end mr-4"
                            onClick={handleToggleMenu}
                        >
                            <DoubleArrowLeftIcon />
                        </button>
                        <nav className="p-5 text-white" onClick={(e) => e.stopPropagation()}>
                            <Link to="/" className="block mb-4">
                                Bosh sahifa
                            </Link>
                            <Link to="/products" className="block mb-4">
                                Mahsulotlar
                            </Link>
                            <Link to="/customers" className="block mb-4">
                                Mijozlar
                            </Link>
                            <Link to="/orders" className="block mb-4">
                                Buyurtmalar
                            </Link>
                            <Link to="/inventory" className="block mb-4">
                                Ombor
                            </Link>
                            <Link to="/sales" className="block mb-4">
                                Sotuv
                            </Link>
                            <Link to="/supply" className="block mb-4">
                                Ta'minlovchilar
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Main content */}
                <main className="container md:p-5 bg-gray-100 dark:bg-gray-900 rounded-lg">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}


const fetchInventoryItem = async (id) => {

    try {
        const response = await api.get(`/inventory-byId/${id}`);
        console.log(response.data, "=====>>>>>>> Inventory Item");
        return response.data; // Ma'lumotni qaytarish
    } catch (err) {
        throw new Error('Inventarlarni olishda xatolik yuz berdi');
    }
};

function App() {

    const ua = navigator.userAgent || navigator.vendor || window.opera;
    console.log(ua)
    const router = createBrowserRouter([
        {
            element: <Layout token={ua} />,
            errorElement: <ErrorFallback />, // Xatolikni ko‘rsatish
            children: [
                { path: '/', element: <Home /> },
                { path: '/products', element: <Products /> },
                { path: '/customers', element: <Customers /> },
                { path: '/orders', element: <Orders /> },
                { path: '/inventory', element: <InventoryList /> },
                {
                    path: '/inventory-item/:id',
                    element: <InventoryItem />,
                    loader: async ({ params }) => {
                        const data = await fetchInventoryItem(params.id);
                        if (!data) throw new Error('Inventar topilmadi');
                        return data;
                    },
                },
                { path: '/sales', element: <Sales /> },
                { path: '/supply', element: <Supplies /> },
            ],
        },
    ]);

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                <Suspense fallback={<LoadingFallback />}>
                    <RouterProvider router={router} />
                </Suspense>
            </div>
        </ThemeProvider>
    );
}

export default App;
