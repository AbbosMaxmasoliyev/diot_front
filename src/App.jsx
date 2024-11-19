import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Products from './components/Products';
import Customers from './components/Customers';
import Orders from './components/Orders';
import Sales from './components/Sales';
import InventoryList from './components/InventoryList'; // Ombordagi mahsulotlar sahifasi
import Home from './components/Home';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-y-8 sm:p-2 ">
                {/* Navigatsiya */}
                <nav className="flex gap-4 p-5 mb-8 md:flex-row flex-col">
                    <Link to="/">
                        <p

                            className="hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Bosh sahifa
                        </p>
                    </Link>
                    <Link to="/products">
                        <p

                            className="hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Mahsulotlar
                        </p>
                    </Link>
                    <Link to="/customers">
                        <p

                            className="hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Mijozlar
                        </p>
                    </Link>
                    <Link to="/orders">
                        <p

                            className="hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Buyurtmalar
                        </p>
                    </Link>
                    <Link to="/inventory">
                        <p

                            className="hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Ombor
                        </p>
                    </Link>
                    <Link to="/sales">
                        <p

                            className="hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Sotuv
                        </p>
                    </Link>
                </nav>

                {/* Sahifalar */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/inventory" element={<InventoryList />} /> {/* Ombor sahifasi */}
                    <Route path="/sales" element={<Sales />} /> {/* Ombor sahifasi */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
