import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Link, Outlet } from 'react-router-dom';
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

// Asosiy layout komponent
function Layout({ token }) {
    return (
        <div >
            <p>{token}</p>
            <div className='bg-gray-50 dark:bg-gray-800 mb-5'>
                <nav className="flex gap-4 p-5 mb-8 md:flex-row flex-col bg-gray-50 dark:bg-gray-800 container">
                    <Link to="/" className="hover:text-blue-500 dark:hover:text-blue-400">
                        Bosh sahifa
                    </Link>
                    <Link to="/products" className="hover:text-blue-500 dark:hover:text-blue-400">
                        Mahsulotlar
                    </Link>
                    <Link to="/customers" className="hover:text-blue-500 dark:hover:text-blue-400">
                        Mijozlar
                    </Link>
                    <Link to="/orders" className="hover:text-blue-500 dark:hover:text-blue-400">
                        Buyurtmalar
                    </Link>
                    <Link to="/inventory" className="hover:text-blue-500 dark:hover:text-blue-400">
                        Ombor
                    </Link>
                    <Link to="/sales" className="hover:text-blue-500 dark:hover:text-blue-400">
                        Sotuv
                    </Link>
                    <Link to="/supply" className="hover:text-blue-500 dark:hover:text-blue-400">
                        Ta'minlovchilar
                    </Link>
                </nav>
            </div>
            <main className="container">
                <Outlet />
            </main>
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Suspense fallback={<LoadingFallback />}>
                <RouterProvider router={router} />
            </Suspense>
        </div>
    );
}

export default App;
