import React, { useState, useEffect } from 'react';
import api from '../api';
import { formatPhoneNumber } from '../utils/converter';
import InputMask from "react-input-mask";

const SupplyForm = ({ supply, onClose, refreshSupplies }) => {
    const [name, setName] = useState('');
    const [region, setRegion] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        if (supply) {
            setName(supply.name);
            setRegion(supply.region);
            setPhoneNumber(supply.phoneNumber);
        }
    }, [supply]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newSupply = { name, region, phoneNumber };

        if (supply) {
            api.put(`/supplies/${supply._id}`, newSupply).then(() => {
                refreshSupplies();
                onClose();
            });
        } else {
            api.post('/supplies', newSupply).then(() => {
                refreshSupplies();
                onClose();
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ta'minlovchi nomi"
                    className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                    required
                />
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="Hudud"
                    className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                    required
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
            <div className="flex justify-end gap-2">
                <button
                    type="submit"
                    className="bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-600"
                >
                    Saqlash
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
                >
                    Bekor qilish
                </button>
            </div>
        </form>
    );
};

export default SupplyForm;
