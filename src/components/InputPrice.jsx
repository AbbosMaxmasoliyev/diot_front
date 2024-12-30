import React, { useState, useEffect, useCallback, useRef } from 'react';

const PriceInput = ({
    onChange,
    defaultCurrency = 'UZS',
    currencies = ['UZS', 'USD'],
    placeholder = "Narx",
    inputClass = "",
    selectClass = "",
    min,
    costPrice,

}) => {
    const [price, setPrice] = useState(costPrice);
    const [currency, setCurrency] = useState(defaultCurrency);
    const inputRef = useRef(null)


    // Handle price change
    const handlePriceChange = (e) => {
        const value = parseFloat(e.target.value); // Default to 0 if input is invalid
        if (min < value) {
            inputRef.current.value = value
        }
        setPrice(value);
    };

    // Handle currency change
    const handleCurrencyChange = (e) => {
        const value = e.target.value;
        setCurrency(value);
    };

    // Memoize the callback to avoid unnecessary renders
    const handleParentUpdate = useCallback(() => {
        onChange(price, currency);
    }, [price, currency,]);

    // Use effect to trigger parent update only when price or currency changes
    useEffect(() => {
        handleParentUpdate();
    }, [handleParentUpdate]);

    return (
        <div className="flex items-center gap-2">
            <input
                type="number"
                ref={inputRef}
                value={price}
                defaultValue={costPrice}
                onChange={handlePriceChange}
                className={`${inputClass} w-32 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200`}
                placeholder={placeholder}
            />
            <select
                value={currency}
                onChange={handleCurrencyChange}
                className={`${selectClass} border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200`}
            >
                {currencies.map((curr, index) => (
                    <option key={index} value={curr}>
                        {curr}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default PriceInput;
