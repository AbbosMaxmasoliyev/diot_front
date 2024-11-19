import React, { useEffect, useState } from 'react';
import api from '../api';
import ProductForm from './ProductForm';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/solid';
import useProducts from '../hooks/products';
import { ExitIcon } from '@radix-ui/react-icons';
import { X } from 'shadcn-react/icons';

const Products = () => {
    const [editingProduct, setEditingProduct] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const { products, loading, error, refreshProducts } = useProducts()


    // Delete a product
    const deleteProduct = (id) => {
        api.delete(`/products/${id}`)
            .then(() => {
                refreshProducts()
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6">
            <div className="mb-4 flex justify-between flex-wrap">
                <h2 className="text-2xl font-bold mb-4">Mahsulotlar</h2>
                {/* Yangi mahsulot qo'shish uchun dialog */}
                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setShowDialog(true);
                    }}
                    className="bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-600"
                >
                    Yangi Mahsulot
                </button>
            </div>

            {/* Mahsulotlar kartochkalari */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product._id} className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">Narx: {product.price} so'm</p>

                        <div className="flex justify-start gap-4">
                            <button
                                className="bg-yellow-500 dark:bg-yellow-600 text-white py-1 px-3 rounded hover:bg-yellow-600 dark:hover:bg-yellow-500 flex items-center"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDialog(true);
                                    setEditingProduct(product);
                                }} // Tahrirlash uchun
                            >
                                <PencilIcon className="h-5 w-5" />
                                {/* Tahrirlash */}
                            </button>
                            <button
                                className="bg-red-500 dark:bg-red-600 text-white py-1 px-3 rounded hover:bg-red-600 dark:hover:bg-red-500 flex items-center"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteProduct(product._id);
                                }} // O'chirish uchun
                            >
                                <TrashIcon className="h-5 w-5" />
                                {/* O'chirish */}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mahsulot qo'shish yoki tahrirlash uchun form */}
            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded shadow-lg w-96">
                        <div className="flex justify-between items-center  mb-4">
                            <h3 className="text-xl ">{editingProduct ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot Qo\'shish'}</h3>
                            <button onClick={() => setShowDialog(false)}><X /></button>
                        </div>
                        <ProductForm
                            product={editingProduct}
                            setProduct={setEditingProduct}
                            refreshProducts={() => {
                                refreshProducts()
                                setShowDialog(false)
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
