import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import useInventory from '../hooks/invetory';
import { formatCurrency } from '../utils/converter';
import useProducts from '../hooks/products';

const InventorSearch = React.memo(({ onSelect, }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1); // Tanlangan element uchun indeks
    const inputRef = useRef(null);
    const listRef = useRef(null); // UL uchun reference
    const { inventory: products } = useInventory();

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return products.filter((product) =>
            product.productId.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, products]);

    const handleProductSelect = useCallback(
        (product) => {
            onSelect(product);
            setSearchQuery(''); // Inputni tozalash
            setActiveIndex(-1); // Tanlovni tozalash
        },
        [onSelect]
    );

    const handleKeyDown = useCallback((e) => {
        if (!filteredProducts.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prevIndex) => Math.min(prevIndex + 1, filteredProducts.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            handleProductSelect(filteredProducts[activeIndex]);
        }
    }, [filteredProducts, activeIndex, handleProductSelect]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (activeIndex >= 0 && listRef.current) {
            const activeElement = listRef.current.children[activeIndex];
            if (activeElement) {
                activeElement.scrollIntoView({
                    block: 'nearest',
                    inline: 'nearest',
                });
            }
        }
    }, [activeIndex]);

    const slashEvent = (e) => {
        if (e.code === 'Slash') {
            e.preventDefault();
            inputRef.current.focus();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', slashEvent);
        return () => {
            document.removeEventListener('keydown', slashEvent);
        };
    }, []);

    return (
        <div className="w-full relative">
            <p className="font-bold text-lg text-gray-900 dark:text-gray-200  mb-3">
                Mahsulotlarni qidirish
            </p>
            <input
                type="text"
                value={searchQuery}
                ref={inputRef}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mahsulotni qidiring..."
                className="w-full px-4 py-2 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200"
            />
            {filteredProducts.length > 0 && (
                <ul
                    ref={listRef}
                    className="mt-2 max-h-48 overflow-y-auto border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 absolute w-full"
                >
                    {filteredProducts.map((product, index) => (
                        <li
                            key={product.productId._id}
                            onClick={() => handleProductSelect(product)}
                            className={`p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer ${index === activeIndex ? 'bg-gray-300 dark:bg-gray-500' : ''
                                }`}
                            tabIndex={0} // Fokuslash imkoniyati uchun
                        >
                            {product.productId.name} - {formatCurrency(product.productId.price)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});



const ProductSearch = React.memo(({ onSelect, }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1); // Tanlangan element uchun indeks
    const inputRef = useRef(null);
    const listRef = useRef(null); // UL uchun reference
    const { products } = useProducts();

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return products.filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, products]);

    const handleProductSelect = useCallback(
        (product) => {
            onSelect(product);
            setSearchQuery(''); // Inputni tozalash
            setActiveIndex(-1); // Tanlovni tozalash
        },
        [onSelect]
    );

    const handleKeyDown = useCallback((e) => {
        if (!filteredProducts.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prevIndex) => Math.min(prevIndex + 1, filteredProducts.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            handleProductSelect(filteredProducts[activeIndex]);
        }
    }, [filteredProducts, activeIndex, handleProductSelect]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (activeIndex >= 0 && listRef.current) {
            const activeElement = listRef.current.children[activeIndex];
            if (activeElement) {
                activeElement.scrollIntoView({
                    block: 'nearest',
                    inline: 'nearest',
                });
            }
        }
    }, [activeIndex]);

    const slashEvent = (e) => {
        if (e.code === 'Slash') {
            e.preventDefault();
            inputRef.current.focus();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', slashEvent);
        return () => {
            document.removeEventListener('keydown', slashEvent);
        };
    }, []);

    return (
        <div className="w-full relative">
            <p className="font-bold text-lg text-gray-900 dark:text-gray-200  mb-3">
                Mahsulotlarni qidirish
            </p>
            <input
                type="text"
                value={searchQuery}
                ref={inputRef}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mahsulotni qidiring..."
                className="w-full px-4 py-2 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200"
            />
            {filteredProducts.length > 0 && (
                <ul
                    ref={listRef}
                    className="mt-2 max-h-48 overflow-y-auto border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 absolute w-full"
                >
                    {filteredProducts.map((product, index) => (
                        <li
                            key={product._id}
                            onClick={() => handleProductSelect(product)}
                            className={`p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer ${index === activeIndex ? 'bg-gray-300 dark:bg-gray-500' : ''
                                }`}
                            tabIndex={0} // Fokuslash imkoniyati uchun
                        >
                            {product.name} - {formatCurrency(product.price)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});
export { InventorSearch, ProductSearch };
