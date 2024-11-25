// src/components/Pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };
    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex justify-between items-center mt-4">
            <button
                onClick={handlePrev}
                className="bg-blue-500 text-white py-1 px-3 rounded-md disabled:opacity-50"
                disabled={currentPage === 1}
            >
                Oldingi
            </button>
            <span className="text-gray-700 dark:text-gray-200">
                {currentPage} / {totalPages}
            </span>
            <button
                onClick={handleNext}
                className="bg-blue-500 text-white py-1 px-3 rounded-md disabled:opacity-50"
                disabled={currentPage === totalPages}
            >
                Keyingi
            </button>
        </div>
    );
};

export default Pagination;
