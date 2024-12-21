import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api';
import useSuppliers from '../hooks/supplies';
import useProducts from '../hooks/products';
import { ProductSearch } from './ProductSearch';
import { formatCurrency } from '../utils/converter';
import { XMarkIcon } from '@heroicons/react/24/solid';
import PriceInput from './InputPrice';

const ImportForm = ({ importItem, onClose, refreshImports }) => {
    const [supplier, setSupplier] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [additionalCosts, setAdditionalCosts] = useState(0);
    const [currencyCost, setCurrencyCost] = useState('UZS');
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
                    incomePrice: p.incomePrice || { cost: 0, currency: 'USD' },
                    costPrice: p.costPrice || { cost: 0, currency: 'USD' },
                    quantity: p.quantity,
                }))
            );
            setPaymentMethod(importItem.paymentMethod);
            setAdditionalCosts(importItem.additionalCosts?.cost || 0);
            setCurrencyCost(importItem.additionalCosts?.currency || 'UZS');
        } else {
            resetForm();
        }
    }, [importItem]);

    const resetForm = useCallback(() => {
        setSupplier('');
        setSelectedProducts([]);
        setPaymentMethod('cash');
        setAdditionalCosts(0);
        setCurrencyCost('UZS');
        setError('');
    }, []);

    const handleProductSelect = useCallback((product) => {

        setSelectedProducts((prev) => {
            // Find if the product already exists in the selected products
            const existingProductIndex = prev.findIndex((p) => p.productId === product._id);

            if (existingProductIndex !== -1) {
                // Create a copy of the existing array
                const updatedProducts = [...prev];
                const existingProduct = updatedProducts[existingProductIndex];

                // Update the quantity of the existing product
                updatedProducts[existingProductIndex] = {
                    ...existingProduct,
                    quantity: existingProduct.quantity + 1,
                };

                return updatedProducts;
            }
            let price = product.price
            console.log(price);

            // If the product doesn't exist, add it as a new entry
            return [
                ...prev,
                {
                    productId: product._id,
                    name: product.name,
                    incomePrice: { cost: price, currency: 'USD' },
                    costPrice: { cost: price, currency: 'USD' },
                    quantity: 1,
                },
            ];
        });
        console.log(selectedProducts);

    }, []);

    const handleQuantityChange = useCallback((productId, quantity) => {
        setSelectedProducts((prev) =>
            prev.map((p) =>
                p.productId === productId
                    ? { ...p, quantity: Math.max(1, parseInt(quantity) || 1) }
                    : p
            )
        );
    }, []);

    const handlePriceChange = useCallback((productId, price, currency, type) => {
        setSelectedProducts((prev) =>
            prev.map((p) =>
                p.productId === productId
                    ? {
                        ...p,
                        [type]: {
                            cost: parseFloat(price) || 0,
                            currency: currency || 'USD',
                        },
                    }
                    : p
            )
        );
    }, []);

    const totalCostIncome = useMemo(() => {
        return selectedProducts.reduce(
            (sum, product) => {
                const currency = product.incomePrice?.currency || "UZS"; // Default to "UZS" if currency is undefined
                const cost = product.incomePrice?.cost || 0;
                const total = cost * product.quantity;

                // Increment the sum for the specific currency
                sum[currency] = (sum[currency] || 0) + total;
                console.log(sum);

                return sum;
            },
            { "USD": 0, "UZS": 0 } // Initial sums for each currency
        );
    }, [selectedProducts]);

    // const totalCostSale = useMemo(() => {
    //     return (
    //         selectedProducts.reduce(
    //             (sum, product) => sum + (product.costPrice?.cost || 0) * product.quantity,
    //             0
    //         ) + parseFloat(additionalCosts || 0)
    //     );
    // }, [selectedProducts, additionalCosts]);

    const totalCostSale = useMemo(() => {
        return selectedProducts.reduce(
            (sum, product) => {
                const currency = product.costPrice?.currency || "UZS"; // Default to "UZS" if currency is undefined
                const cost = product.costPrice?.cost || 0;
                const total = cost * product.quantity;

                // Increment the sum for the specific currency
                sum[currency] = (sum[currency] || 0) + total;
                console.log(sum);

                return sum;
            },
            { "USD": 0, "UZS": 0 } // Initial sums for each currency
        );
    }, [selectedProducts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!supplier) {
            setError('Yetkazib beruvchi tanlanmagan!');
            return;
        }
        if (selectedProducts.length === 0) {
            setError('Hech qanday mahsulot tanlanmagan!');
            return;
        }

        const newImport = {
            supplier,
            products: selectedProducts.map((p) => ({
                productId: p.productId,
                quantity: p.quantity,
                costPrice: p.costPrice,
                incomePrice: p.incomePrice,
            })),
            paymentMethod,
            additionalCosts: {
                cost: parseFloat(additionalCosts || 0),
                currency: currencyCost,
            },
            totalCost: [{
                cost: selectedProducts.reduce((sum, pro) => {
                    const price = pro.incomePrice.cost || 0; // Ensure price is a number, default to 0 if undefined
                    if (pro.incomePrice.currency === "UZS") {
                        return sum + price; // Add price to sum if currency is UZS
                    }
                    return sum; // Otherwise, just return the current sum
                }, 0),
                currency: "UZS"
            },
            {
                cost: selectedProducts.reduce((sum, pro) => {
                    const price = pro.incomePrice.cost || 0; // Ensure price is a number, default to 0 if undefined
                    if (pro.incomePrice.currency === "USD") {
                        return sum + price; // Add price to sum if currency is UZS
                    }
                    return sum; // Otherwise, just return the current sum
                }, 0),
                currency: "USD"
            },]
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
        <div className="fixed inset-0 flex items-start justify-end bg-gray-900 bg-opacity-50 z-50">
            <div className="relative min-h-screen w-11/12 max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <button className="absolute top-4 right-4" onClick={onClose}>
                    <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {importItem ? 'Importni tahrirlash' : 'Yangi import'}
                    </h2>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
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
                            <div className="mt-2">
                                <PriceInput
                                    placeholder="Qo'shimcha harajatlar"
                                    inputClass="w-20 px-2 py-1 border rounded dark:bg-gray-600"
                                    selectClass="w-20 px-2 py-1 border rounded dark:bg-gray-600"
                                    onChange={(price, currency) => {
                                        setAdditionalCosts(price);
                                        setCurrencyCost(currency);
                                    }}
                                    defaultCurrency="USD"
                                />
                            </div>
                        </div>
                    </div>
                    <ProductSearch onSelect={handleProductSelect} />
                    <div className=''>
                        <h3 className="font-bold text-gray-900 dark:text-gray-200">Tanlangan mahsulotlar</h3>
                        {selectedProducts.length ? (
                            <table className="w-full mt-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200">
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
                                                    onChange={(e) =>
                                                        handleQuantityChange(product.productId, e.target.value)
                                                    }
                                                    className="w-16 px-2 py-1 border rounded dark:bg-gray-600"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <PriceInput
                                                    inputClass="w-20 px-2 py-1 border rounded dark:bg-gray-600"
                                                    selectClass="w-20 px-2 py-1 border rounded dark:bg-gray-600"

                                                    onChange={(price, currency) =>
                                                        handlePriceChange(product.productId, price, currency, 'incomePrice')
                                                    }
                                                    defaultCurrency={product.incomePrice.currency}
                                                    placeholder="Kirim narxi"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                {
                                                    (() => {
                                                        console.log(product)
                                                    })()

                                                }
                                                <PriceInput
                                                    inputClass="w-20 px-2 py-1 border rounded dark:bg-gray-600"
                                                    selectClass="w-20 px-2 py-1 border rounded dark:bg-gray-600"
                                                    min={product.incomePrice.cost}
                                                    costPrice={product.costPrice.cost}
                                                    onChange={(price, currency) =>
                                                        handlePriceChange(product.productId, price, currency, 'costPrice')
                                                    }
                                                    defaultCurrency={product.costPrice.currency}
                                                    placeholder="Sotish narxi"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                {formatCurrency(product.incomePrice.cost * product.quantity, product.incomePrice.currency)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300">Mahsulotlar tanlanmagan.</p>
                        )}
                    </div>
                    <div className="flex justify-between items-start flex-col">
                        <div className="flex flex-col">
                            <p className="text-gray-800 dark:text-gray-200">
                                Kirim holati:
                            </p>
                            <p className='md:text-lg text-sm  text-gray-900 dark:text-gray-200 md:flex-col flex-row'>So'mda kirayotgan mahsulotlari kirimi: <span className='font-bold'>{formatCurrency(totalCostIncome.UZS, "UZS")}</span></p>
                            <p className='md:text-lg text-sm  text-gray-900 dark:text-gray-200 md:flex-col flex-row'>Dollarda kirayotgan mahsulotlar uchun: <span className='font-bold'>{formatCurrency(totalCostIncome.USD, "USD")}</span></p>
                            <p className='md:text-lg text-sm  text-gray-900 dark:text-gray-200 md:flex-col flex-row'>Qo'shimcha harajatlar: <span className='font-bold'>{formatCurrency(additionalCosts, currencyCost)}</span></p>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-200">
                            Sotuv holati: {formatCurrency(totalCostSale.UZS, "UZS")} + {formatCurrency(totalCostSale.USD, "USD")}

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
