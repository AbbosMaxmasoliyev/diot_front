import React from 'react';
import useImports from '../hooks/imports';

const ImportList = () => {
    const {
        imports,
        loading,
        error,
        currentPage,
        totalPages,
        pageSize,
        changePage,
        setPageSize,
        refreshImports,
    } = useImports();

    return (
        <div className='text-gray-700 dark:text-gray-200'>
            <h1 className="text-xl font-bold">Importlar</h1>
            {loading && <p>Yuklanmoqda...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && imports.length === 0 && <p>Importlar topilmadi.</p>}

            {!loading && imports.length > 0 && (
                <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700">
                            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200">Yetkazib beruvchi</th>
                            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200">Mahsulotlar soni</th>
                            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200">To'lov turi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {imports.map((item) => (
                            <tr key={item._id}>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200">{item?.supplierId?.name}</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200">
                                    {item.products.length}
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200">{item.paymentMethod}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Sahifalash */}
            <div className="mt-4 flex justify-between items-center">
                <div className='flex '>
                    <button
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-400 rounded disabled:opacity-50 text-white"
                    >
                        Oldingi
                    </button>
                    <button
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="ml-2 px-4 py-2 bg-blue-700 hover:bg-blue-400 rounded disabled:opacity-50 text-white"
                    >
                        Keyingi
                    </button>
                </div>
                <div className='flex items-center '>
                    <label className='hidden md:inline'>
                        Sahifa hajmi:{' '}
                    </label>
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>

            {/* Importlarni qayta yuklash */}
            <button
                onClick={refreshImports}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
                Yangilash
            </button>
        </div>
    );
};

export default ImportList;
