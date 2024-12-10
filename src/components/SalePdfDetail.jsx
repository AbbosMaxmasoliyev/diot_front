import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatPhoneNumber } from '../utils/converter';
import Payments from './payments';
import { FileIcon } from '@radix-ui/react-icons';

const SaleDetailsPdf = ({ sale }) => {
    const generatePdf = () => {
        console.log(sale);

        // XP-58 uchun sahifa o'lchami: 58mm x cheksiz uzunlik
        const initialPageHeight = 50; // Dastlabki uzunlik (mm)
        const pageWidth = 50; // Sahifa kengligi (mm)

        // Ma'lumotlar uzunligi asosida sahifa balandligini hisoblash
        const calculateDynamicHeight = () => {
            let y = 10; // Boshlang'ich y koordinatasi
            y += 8; // Title uchun joy
            y += 20; // Mijoz ma'lumotlari uchun joy
            y += sale.outgoings.length * 12; // Har bir mahsulot uchun joy (12mm har bir mahsulot)
            y += 25; // Umumiy narx, chegirma va to'lov turi uchun joy
            y += 10; // Qo'shimcha joy
            return y > initialPageHeight ? y : initialPageHeight; // Minimum uzunlikni ta'minlash
        };

        const pageHeight = calculateDynamicHeight();

        const doc = new jsPDF({
            unit: 'mm',
            format: [pageWidth, pageHeight], // Dinamik uzunlik o'rnatish
        });

        // Sahifa boshlang'ich y koordinatasi
        let y = 10;
        let x = 2

        // Title
        doc.setFontSize(12);
        doc.text('Sales Receipt', x, y);
        y += 8;

        // Customer Info
        doc.setFontSize(10);
        doc.text(`Customer: ${sale.customerId.name}`, x, y);
        y += 5;
        doc.text(`Region: ${sale.customerId.region}`, x, y);
        y += 5;
        doc.text(`Phone: ${formatPhoneNumber(sale.customerId.phoneNumber)}`, x, y);
        y += 8;

        // Products Table
        doc.setFontSize(10);
        doc.text('Products:', x, y);
        y += 5;

        sale.outgoings.forEach((p, index) => {
            doc.text(`${index + 1}. ${p.productId.name}`, x, y);
            y += 4;
            doc.text(`Qty: ${p.quantity} x ${formatCurrency(p.salePrice.cost, p.salePrice.currency)}`, 5, y);
            y += 4;
            doc.text(`Total: ${formatCurrency(p.quantity * p.salePrice.cost, p.salePrice.currency)}`, 5, y);
            y += 6;
        });

        // Divider
        doc.line(x, y, 53, y);
        y += 5;

        // Total Price
        const uzsPrice = sale.totalPrice.find((p) => p.currency === 'UZS')?.cost || 0;
        const usdPrice = sale.totalPrice.find((p) => p.currency === 'USD')?.cost || 0;
        doc.text(`Total (UZS): ${formatCurrency(uzsPrice, "UZS")}`, x, y);
        y += 5;
        doc.text(`Total (USD): ${formatCurrency(usdPrice, "USD")}`, x, y);
        y += 5;

        // Discount
        doc.text(`Discount Applied: ${sale.discountApplied}%`, x, y);
        y += 5;

        // Payment Method
        doc.text(`Payment Method: ${sale.paymentMethod.toUpperCase()}`, x, y);
        y += 8;

        // Final Divider
        doc.line(5, y, 53, y);
        y += 5;

        // Save or Print PDF
        doc.autoPrint(); // Avtomatik chop qilish
        doc.output('dataurlnewwindow'); // Yangi oynada ochish
    };


    return (
        <button
            onClick={generatePdf}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            <FileIcon />
            <span className='hidden md:block'>Chop etish</span>
        </button>
    );
};

export default SaleDetailsPdf;
