import { DoubleArrowLeftIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useTheme } from "../ThemeContext";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import UserProfile from "./UserProfile";

export function Navbar() {
    const location = useLocation()
    const { isDark, toggleTheme } = useTheme(); // Tema holatini olish va o'zgartirish

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleToggleTheme = () => {
        toggleTheme();
       
    };
    console.log(location);

    if (location.pathname === "/signup" || location.pathname === "/login") {
        return null
    }
    return (
        <div>
            <div className="bg-white dark:bg-gray-800">
                {/* Navbar */}
                <nav className="flex md:hidden justify-between items-center p-5 mb-8 bg-white dark:bg-gray-800 shadow-lg rounded-md container-custom">
                    <div className="flex items-center justify-between w-full">
                        <button
                            className="lg:hidden p-2 text-2xl dark:text-white text-gray-800"
                            onClick={handleToggleMenu}
                        >
                            <HamburgerMenuIcon />
                        </button>
                        <UserProfile />
                    </div>
                </nav>

                {/* Navbar (desktop) */}
                <nav className="hidden md:flex gap-4 p-5 mb-8 justify-between  container-custom shadow-lg rounded-md">
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
                        {/* <Link
                            to="/orders"
                            className="dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Buyurtmalar
                        </Link> */}
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
                    <UserProfile />

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
                            {/* <Link to="/orders" className="block mb-4">
                                Buyurtmalar
                            </Link> */}
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

            </div>
        </div>
    );
}