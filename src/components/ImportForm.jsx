import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import api from '../api';
import useSuppliers from '../hooks/supplies';
import useInventory from '../hooks/invetory';
import { ProductSearch } from './ProductSearch';
import { formatCurrency } from '../utils/converter';
import { XMarkIcon } from '@heroicons/react/24/solid';
import useProducts from '../hooks/products';

const ImportForm = ({ importItem, onClose, refreshImports }) => {
    const [supplier, setSupplier] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [additionalCosts, setAdditionalCosts] = useState(0);
    const [error, setError] = useState('');
    const { supplies } = useSuppliers();
    const { products } = useProducts();

    useEffect(() => {
        if (importItem) {
            setSupplier(importItem.supplier?._id || '');
            setSelectedProducts(
                importItem.products.map((p) => ({
                    productId: p.productId?._id,
                    name: p.productId?.name,
                    costPrice: p.incomePrice || 0,
                    quantity: p.quantity,
                }))
            );
            setPaymentMethod(importItem.paymentMethod);
            setAdditionalCosts(importItem.additionalCosts || 0);
        } else {
            resetForm();
        }
    }, [importItem]);

    const resetForm = useCallback(() => {
        setSupplier('');
        setSelectedProducts([]);
        setPaymentMethod('cash');
        setAdditionalCosts(0);
        setError('');
    }, []);

    const handleProductSelect = useCallback((product) => {
        setSelectedProducts((prev) => {
            const existingProduct = prev.find((p) => p._id === product._id);
            if (existingProduct) {
                return prev.map((p) =>
                    p._id === product._id
                        ? { ...p, quantity: Math.min(p.quantity + 1, product.totalQuantity) }
                        : p
                );
            }
            return [
                ...prev,
                {
                    productId: product._id,
                    name: product.name,
                    costPrice: product.price,
                    quantity: 1,
                },
            ];
        });
    }, []);

    const handleQuantityChange = useCallback((productId, quantity) => {
        setSelectedProducts((prev) =>
            prev.map((p) =>
                p._id === productId
                    ? { ...p, quantity: Math.max(1, parseInt(quantity) || 1) }
                    : p
            )
        );
    }, []);

    const handleIncomePrice = useCallback((productId, incomePrice) => {
        setSelectedProducts((prev) =>
            prev.map((p) =>
                p._id === productId
                    ? { ...p, incomePrice: parseFloat(incomePrice) }
                    : p
            )
        );
    }, []);

    const handleSalePrice = useCallback((productId, costPrice) => {
        setSelectedProducts((prev) =>
            prev.map((p) =>
                p._id === productId
                    ? { ...p, costPrice: parseFloat(costPrice) }
                    : p
            )
        );
    }, []);
    const totalCost = useMemo(() => {
        return selectedProducts.reduce(
            (sum, product) => sum + product.costPrice * product.quantity,
            0
        ) + parseFloat(additionalCosts || 0);
    }, [selectedProducts, additionalCosts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!supplier) {
            setError("Yetkazib beruvchi tanlanmagan!");
            return;
        }
        if (selectedProducts.length === 0) {
            setError("Hech qanday mahsulot tanlanmagan!");
            return;
        }

        const newImport = {
            supplier,
            products: selectedProducts.map((p) => ({
                productId: p.productId,
                quantity: p.quantity,
                costPrice: p.costPrice,
                incomePrice: p.incomePrice
            })),
            paymentMethod,
            additionalCosts: parseFloat(additionalCosts || 0),
        };

        console.log(newImport);

        try {
            if (importItem) {
                await api.put(`/import/${importItem._id}`, newImport);
            } else {
                await api.post('/import', newImport);
            }
            refreshImports();
            resetForm();
            onClose();
        } catch (err) {
            setError("Ma'lumotni saqlashda xato yuz berdi!");
            console.error(err);
        }
    };

    return (
        <div className="fixed   inset-0 flex items-start justify-end bg-gray-900 bg-opacity-50 z-50 ">
            <div className="relative min-h-screen  w-11/12 max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg ">
                <button className="absolute top-4 right-4" onClick={onClose}>
                    <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {importItem ? 'Importni tahrirlash' : 'Yangi import'}
                    </h2>
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-900 dark:text-gray-200 font-semibold">
                                Yetkazib beruvchi
                            </label>
                            <select
                                value={supplier}
                                onChange={(e) => setSupplier(e.target.value)}
                                required
                                className="w-full mt-2 px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                            >
                                <option value="">Tanlang</option>
                                {supplies.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-900 dark:text-gray-200 font-semibold">
                                Qo'shimcha xarajatlar
                            </label>
                            <input
                                type="number"
                                value={additionalCosts}
                                onChange={(e) => setAdditionalCosts(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                            />
                        </div>
                    </div>
                    <ProductSearch onSelect={handleProductSelect} />
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-200">Tanlangan mahsulotlar</h3>
                        {selectedProducts.length ? (
                            <table className="w-full mt-2 border border-gray-300 dark:border-gray-700">
                                <thead>
                                    <tr className="bg-gray-200 dark:bg-gray-800">
                                        <th className="px-4 py-2 text-left">Nomi</th>
                                        <th className="px-4 py-2 text-left">Soni</th>
                                        <th className="px-4 py-2 text-left">Kirish narxi</th>
                                        <th className="px-4 py-2 text-left">Sotuv narxi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProducts.map((product) => (
                                        <tr key={product.productId} className="bg-white dark:bg-gray-700">
                                            <td className="px-4 py-2">{product.name}</td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={product.quantity}
                                                    max={10000}
                                                    onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                                    className="w-16 px-2 py-1 border rounded dark:bg-gray-600"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={product.incomePrice}
                                                    placeholder='Kirish narxi'
                                                    onChange={(e) => handleIncomePrice(product._id, e.target.value)}
                                                    className="w-16 px-2 py-1 border rounded dark:bg-gray-600"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={product.costPrice}
                                                    placeholder='Sotuv narxi'
                                                    onChange={(e) => handleSalePrice(product._id, e.target.value)}
                                                    className="w-16 px-2 py-1 border rounded dark:bg-gray-600"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                {formatCurrency(product.costPrice * product.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300">Mahsulotlar tanlanmagan.</p>
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-200">
                            Umumiy: {formatCurrency(totalCost)}
                        </p>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500"
                        >
                            {importItem ? 'Yangilash' : 'Saqlash'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ImportForm;
