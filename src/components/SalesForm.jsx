import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import api from '../api';
import useCustomers from '../hooks/clients';
import useInventory from '../hooks/invetory';
import { InventorSearch } from './ProductSearch';
import { formatCurrency } from '../utils/converter';
import { XMarkIcon } from '@heroicons/react/24/solid';

const SalesForm = ({ order, onClose, refreshOrders }) => {
    const [customer, setCustomer] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discountApplied, setDiscountApplied] = useState(null);
    const { customers } = useCustomers();
    const { inventory: products } = useInventory();
    const totalRef = useRef(0);
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
        if (order) {
            setCustomer(order.customerId?._id || '');
            setSelectedProducts(
                order.outgoings.map((p) => ({
                    productId: p.productId?._id,
                    name: p.productId?.name,
                    price: p.salePrice.cost,
                    currency: p.salePrice.currency,
                    quantity: p.quantity,
                }))
            );
            setPaymentMethod(order.paymentMethod);
            setDiscountApplied(order.discountApplied || null);
        } else {
            resetForm();
        }
    }, [order]);

    const resetForm = useCallback(() => {
        setCustomer('');
        setSelectedProducts([]);
        setPaymentMethod('cash');
        setDiscountApplied(null);
    }, []);

    const handleProductSelect = useCallback((product) => {
        if (order) return; // Editing products not allowed in update mode
        setSelectedProducts((prev) => {
            const existingProduct = prev.find((p) => p.productId === product.productId?._id);
            if (existingProduct) {
                return prev.map((p) =>
                    p.productId === product.productId?._id
                        ? { ...p, quantity: Math.min(p.quantity + 1, product.totalQuantity) }
                        : p
                );
            }
            return [
                ...prev,
                {
                    productId: product.productId?._id,
                    name: product.productId?.name,
                    price: product.price,
                    quantity: 1,
                    totalQuantity: product?.totalQuantity,
                },
            ];
        });
    }, [order]);

    const handleQuantityChange = useCallback((productId, quantity) => {
        if (order) return; // Editing quantities not allowed in update mode
        setSelectedProducts((prev) =>
            prev.map((p) =>
                p.productId === productId
                    ? { ...p, quantity: Math.max(1, Math.min(parseInt(quantity), p.totalQuantity)) }
                    : p
            )
        );
    }, [order]);

    const totalPrice = useMemo(() => {
        if (order) return { "UZS": order?.totalPrice[1].UZS, "USD": order?.totalPrice[0].USD };


        if (!selectedProducts.length) return 0;
        const total = selectedProducts.reduce(
            (sum, product) => {
                const currency = product.price?.currency || "UZS";
                const cost = product.price?.cost || 0;
                const total = cost * product.quantity;
                sum[currency] = (sum[currency] || 0) + total;
                return sum;
            },
            { "USD": 0, "UZS": 0 }
        );

        const discountFactor = 1 - (discountApplied / 100 || 0);
        return { "UZS": total.UZS * discountFactor, "USD": total.USD * discountFactor };
    }, [selectedProducts, discountApplied]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedOrder = {
            customerId: customer,
            paymentMethod,
            discountApplied,
            ...(order ? {} : { products: selectedProducts, totalPrice }),
        };
        console.log(updatedOrder);

        try {
            if (order) {
                await api.put(`/sales/${order._id}`, updatedOrder);
            } else {
                await api.post('/sales', updatedOrder);
            }
            refreshOrders();
            resetForm();
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <button className="fixed top-2 right-2 w-8 h-8 text-gray-900 dark:text-gray-100 z-10" onClick={onClose}>
                <XMarkIcon />
            </button>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 p-4 bg-gray-100 dark:bg-gray-800 h-screen rounded-md shadow-md w-[90%] overflow-y-auto"
            >
                <div>
                    <InventorSearch onSelect={handleProductSelect} disabled={!!order} />
                    <p className="font-bold text-lg text-gray-900 dark:text-gray-200 mt-5 mb-3">Savatcha</p>
                    {selectedProducts.length ? (
                        <div className="flex flex-col gap-3">
                            <div className="md:flex hidden justify-between p-2 bg-gray-200 dark:bg-gray-700 rounded-md font-bold text-gray-900 dark:text-gray-200 ">
                                <span className="flex-1">Nomi</span>
                                <span className="flex-1">Soni</span>
                                <span className="flex-1">Umumiy summa</span>
                            </div>
                            {selectedProducts.map((product) => (
                                <div
                                    key={product.productId}
                                    className="flex flex-col md:flex-row gap-2  justify-between md:items-center items-start p-2 bg-white dark:bg-gray-700 rounded-md shadow text-gray-900 dark:text-gray-200"
                                >
                                    <span className="flex-1 flex gap-1 text-sm md:text-base  truncate">
                                        <span className='md:hidden inline-block'>Nomi: </span>
                                        {product.name}
                                    </span>
                                    <label htmlFor="quantity" className='flex-1 flex gap-1 items-center'>

                                        <span className='md:hidden inline-block'>Soni: </span>
                                        <input
                                            type="number"
                                            id='quantity'
                                            value={product.quantity}
                                            max={product.totalQuantity}
                                            onChange={(e) => handleQuantityChange(product.productId, e.target.value)}
                                            disabled={!!order}
                                            className=" w-20 px-2 py-1 border rounded bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-gray-200"
                                        />
                                    </label>
                                    <span className="flex-1 flex gap-1 text-sm md:text-base text-gray-900 dark:text-gray-200">
                                        <span className='md:hidden inline-block'>Umumiy summasi: </span>

                                        {formatCurrency(
                                            order
                                                ? product.price
                                                : product.price.cost * Number(product?.quantity),
                                            order ? product.currency : product.price.currency
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="font-semibold text-md text-gray-900 dark:text-gray-400">
                            Iltimos mahsulotlarni tanlang
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-6">
                    <div>
                        <label className="block font-bold mb-2 text-gray-900 dark:text-gray-200">Mijozni tanlang:</label>
                        <select
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            disabled={!!order}
                            required
                            className="w-full px-4 py-2 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                        >
                            <option value="">Mijozni tanlang</option>
                            {customers.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="discount" className="text-gray-900 dark:text-gray-200">Chegirma</label>
                        <input
                            type="number"
                            value={discountApplied}
                            onChange={(e) => setDiscountApplied(Math.min(100, parseInt(e.target.value)))}
                            disabled={!!order}
                            id="discount"
                            placeholder="Chegirma"
                            className="w-full px-2 py-2 pr-4 border rounded focus:outline-none focus:ring focus:ring-blue-300 text-gray-900 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <p className="font-bold text-sm md:text-lg text-gray-900 dark:text-gray-200">
                            Umumiy (so'mda): {formatCurrency(order ? order.totalPrice[0].cost : totalPrice.UZS || 0, "UZS")}
                        </p>
                        <p className="font-bold text-sm md:text-lg text-gray-900 dark:text-gray-200">
                            Umumiy (dollarda): {formatCurrency(order ? order.totalPrice[1].cost : totalPrice.USD || 0, "USD")}
                        </p>
                    </div>
                    <div>
                        <label className="text-gray-900 dark:text-gray-200">To'lov turi:</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                        >
                            <option value="cash">Naqd</option>
                            <option value="card">Karta</option>
                            <option value="transfer">O'tkazma</option>
                            <option value="debit">Qarz</option>
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded dark:bg-blue-400 dark:hover:bg-blue-500"
                        >
                            {order ? 'Yangilash' : 'Saqlash'}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );

};

export default SalesForm;
