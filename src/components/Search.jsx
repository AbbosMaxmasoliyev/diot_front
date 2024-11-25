import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

const SearchInput = ({ refreshInventory }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Debounce qidiruv funksiyasini yaratish
    const debouncedSearch = useCallback(
        debounce((value) => {
            refreshInventory(value); // 1 soniyadan keyin ishga tushirish
        }, 500), // 1000 millisekund (1 soniya) kutish
        []
    );

    // `searchTerm` o'zgarganda `debouncedSearch` funksiyasini chaqirish
    const handleChange = (e) => {
        setSearchTerm(e.target.value); // Qidiruv so'zini o'zgartirish
        debouncedSearch(e.target.value); // Debounced qidiruv funksiyasini chaqirish
    };

    return (
        <input
            type="text"
            placeholder="Mahsulot izlash..."
            onChange={handleChange}
            value={searchTerm}
            className="border rounded py-2 px-4  w-full sm:w-auto bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-blue-300 dark:focus:border-blue-300"
        />
    );
};

export default SearchInput;
