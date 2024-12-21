import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { removeToken } from '../utils/tokenUtils';
import useFetchUserData from '../hooks/useFetchUserData'; // Import the custom hook
import Logout from './Logout';
import Role from './Role';

function UserProfile() {
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Use the custom hook to fetch user data
    const { user, loading, error } = useFetchUserData();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        removeToken(); // Remove the token
        navigate('/login'); // Redirect to login page
    };

    // Handle loading and error states
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="relative ">
            {/* Dropdown Toggle */}
            <button
                onClick={toggleDropdown}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded dark:text-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700"
            >
                <span className="mr-2">{user?.username}</span>
                <svg
                    className={`w-4 h-4 transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg dark:bg-gray-800 z-[99]">
                    <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                            <strong>Rol:</strong> <Role role={user?.role} />
                        </p>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={toggleTheme}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Rejim {isDark ? "☀️" : "🌗"}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Chiqish
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;
