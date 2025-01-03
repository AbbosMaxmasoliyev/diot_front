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
        const handleKeyDown = (e) => {
            if (e.code === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose])
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
                    ? { ...p, quantity: parseInt(quantity) }
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
            <div className="relative md:w-[90%] sm:w-full  bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg overflow-y-auto h-full">
                <button className="absolute top-4 right-4 z-10 w-5 " onClick={onClose}>
                    <XMarkIcon className='text-white ' fontSize={24} />
                </button>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Yangi import
                    </h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <label className="block text-gray-900 dark:text-gray-200 font-semibold">
                                Yetkazib beruvchi
                            </label>
                            <select
                                id="supplier"
                                className="w-full mt-2 px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                                required
                            >
                                <option value="">Tanlang</option>
                                {/* Yetkazib beruvchilar ro'yxati */}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="block text-gray-900 dark:text-gray-200 font-semibold">
                                Qo'shimcha xarajatlar
                            </label>
                            <div className="mt-2">
                                <PriceInput
                                    containerClass='flex-1 w-full '
                                    placeholder="Qo'shimcha harajatlar"
                                    inputClass="w-full px-2 py-1 border rounded dark:bg-gray-600"
                                    selectClass="w-full px-2 py-1 border rounded dark:bg-gray-600"
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
                    <div className="mt-4 text-gray-900 dark:text-gray-200">
                        <h3 className="font-bold text-gray-900 dark:text-gray-200">Tanlangan mahsulotlar</h3>
                        {selectedProducts.length ? (
                            <div id="product-list" className="flex flex-col gap-2 mt-2">
                                <div className="sm:flex justify-between bg-gray-200 dark:bg-gray-800 p-2 rounded hidden">
                                    <span className="flex-1 w-full  text-left font-semibold">Nomi</span>
                                    <span className="flex-1 w-full  text-left font-semibold">Soni</span>
                                    <span className="flex-[2]   text-center font-semibold">Narxlar</span>
                                    <span className="flex-1 w-full  text-center font-semibold">Sotuv narxi</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {selectedProducts.map((product) => (
                                        <div
                                            key={product.productId}
                                            className="flex flex-col sm:flex-row justify-between sm:items-center bg-white dark:bg-gray-700 p-2 rounded shadow gap-2"
                                        >
                                            <div className="flex-1 w-full  text-left flex gap-1"><span className='sm:hidden inline-block'>Nomi: </span>{product.name}</div>
                                            <label htmlFor="quantity" className='sm:hidden inline-block'>
                                                <span>Soni: </span>
                                            </label>
                                            <input
                                                type="number"
                                                className="flex-1 w-full  px-2 py-1 border rounded dark:bg-gray-600"
                                                value={product.quantity}
                                                id='quantity'
                                                onChange={(e) =>
                                                    handleQuantityChange(product.productId, e.target.value)
                                                }
                                                required
                                            />
                                            <label className='sm:hidden inline-block'>
                                                <span>Kirish narxi: </span>
                                            </label>
                                            <PriceInput
                                                containerClass='flex-1 w-full '
                                                inputClass="w-full  sm:w-20 px-2 py-1 border rounded dark:bg-gray-600"
                                                selectClass="w-full sm:w-20 px-2 py-1 border rounded dark:bg-gray-600"
                                                onChange={(price, currency) =>
                                                    handlePriceChange(product.productId, price, currency, 'incomePrice')
                                                }
                                                defaultCurrency={product.incomePrice.currency}
                                                placeholder="Kirim narxi"
                                            />
                                            <label className='sm:hidden inline-block'>
                                                <span>Sotilish narxi: </span>
                                            </label>
                                            <PriceInput
                                                containerClass='flex-1 w-full '
                                                inputClass="w-full sm:w-20 px-2 py-1 border rounded dark:bg-gray-600"
                                                selectClass="w-full sm:w-20 px-2 py-1 border rounded dark:bg-gray-600"
                                                costPrice={product.costPrice.cost}
                                                onChange={(price, currency) =>
                                                    handlePriceChange(product.productId, price, currency, 'costPrice')
                                                }
                                                defaultCurrency={product.costPrice.currency}
                                                placeholder="Sotish narxi"
                                            />
                                            <label className='sm:hidden inline-block'>
                                                <span>Umumiy sotilish summasi: </span>
                                            </label>
                                            <span className="flex-1 w-full  md:text-center">
                                                {formatCurrency(
                                                    product.incomePrice.cost * product.quantity,
                                                    product.incomePrice.currency
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300">Mahsulotlar tanlanmagan.</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-4">
                        <p className="text-gray-800 dark:text-gray-200">Kirim holati:</p>
                        <p className="text-sm text-gray-900 dark:text-gray-200">
                            So'mda kirayotgan mahsulotlar: <span className="font-bold">{formatCurrency(totalCostIncome.UZS, "UZS")}</span>
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-200">
                            Dollarda kirayotgan mahsulotlar: <span className="font-bold">{formatCurrency(totalCostIncome.USD, "USD")}</span>
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-200">
                            Qo'shimcha xarajatlar: <span className="font-bold">{formatCurrency(additionalCosts, currencyCost)}</span>
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-200">
                            Sotuv holati: {formatCurrency(totalCostSale.UZS, "UZS")} + {formatCurrency(totalCostSale.USD, "USD")}
                        </p>
                        <button
                            type="submit"
                            className="w-full sm:w-max px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500"
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
