// src/components/ProductForm.js
import React, { useState, useEffect } from 'react';
import api from '../api';

const ProductForm = ({ product, setProduct, refreshProducts }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDesription] = useState('');
    const [category, setCategory] = useState('all');
    console.log(product);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setDesription(product.description)
            setCategory(product.category)
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = { name, price, description, category };

        if (product) {
            // Tahrirlash
            api.put(`/products/${product._id}`, productData)
                .then(() => {
                    refreshProducts();
                    setProduct(null);
                    setName('');
                    setPrice('');
                    setDesription("")
                    setCategory('')
                });
        } else {
            // Yaratish
            api.post('/products', productData)
                .then(() => {
                    refreshProducts();
                    setName('');
                    setPrice('');
                    setDesription("")
                    setCategory("")
                });
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
            <input type="text" className='w-full px-4 py-2 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200' placeholder="Mahsulot nomi" defaultValue={name} onChange={(e) => setName(e.target.value)} required />
            <input type="number" className='w-full px-4 py-2 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200' placeholder="Narx" defaultValue={price} onChange={(e) => setPrice(e.target.value)} required />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full px-4 py-2 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200'>
                <option value={"all"}>Barchasi</option>
                <option value={"technical"}>Texnika</option>
                <option value={"hardware"}>Qattiq qismlar</option>
            </select>
            <textarea type="number" className='w-full px-4 py-2 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200' placeholder="Izoh"  onChange={(e) => setDesription(e.target.value)} required >
                {description}
            </textarea>
            <button type="submit">{product ? "Yangilash" : "Qo'shish"}</button>
        </form>
    );
};

export default ProductForm;
