// src/components/CustomerForm.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import InputMask from "react-input-mask";
import { formatPhoneNumber } from '../utils/converter';


const CustomerForm = ({ customer, onClose, refreshCustomers }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [region, setRegion] = useState('');
    
    useEffect(() => {
        if (customer) {
            setName(customer.name);
            setPhoneNumber(customer.phoneNumber);
            setRegion(customer.region);
        }

        return (() => {
            setName("");
            setPhoneNumber("");
            setRegion("");
        })
    }, [customer]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCustomer = { name, phoneNumber, region: region, };
        console.log(newCustomer);

        if (customer) {
            // Mijozni tahrirlash
            api.put(`/customers/${customer._id}`, newCustomer)
                .then(() => {
                    refreshCustomers();
                    onClose();
                })
                .catch(err => console.error(err));
        } else {
            console.log(newCustomer);

            // Yangi mijoz qo'shish
            api.post('/customers', newCustomer)
                .then(() => {
                    refreshCustomers();
                    onClose();
                })
                .catch(err => console.error(err));
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Mijoz Nomi"
                        defaultValue={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-gray-200 border-gray-300 dark:border-gray-600"
                    />
                </div>
                <div className="mb-4">
                    <InputMask
                        mask="+999 (99) 999-99-99"
                        value={formatPhoneNumber(phoneNumber)}
                        placeholder="+998 (__) ___-__-__"

                        title="Telefon raqami formati: (XXX) XXX-XX-XX"
                        onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, ""); // \D - bu barcha raqam bo'lmagan belgilarni tozalaydi

                            setPhoneNumber(rawValue)
                        }}
                        required
                        className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-gray-200 border-gray-300 dark:border-gray-600"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Manzil"
                        defaultValue={region}
                        onChange={(e) => setRegion(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-gray-200 border-gray-300 dark:border-gray-600"
                    />
                </div>
             
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-600"
                    >
                        {customer ? 'Yangilash' : 'Qo\'shish'}
                    </button>
                </div>
            </form>
            <div className="flex justify-end mt-4">
                <button
                    onClick={onClose}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
                >
                    Yopish
                </button>
            </div>
        </div>
    );

};

export default CustomerForm;
