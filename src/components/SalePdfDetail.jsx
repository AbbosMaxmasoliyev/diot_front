import React, { useRef } from 'react';
import { baseURL } from '../api';
import html2pdf from 'html2pdf.js';
import "./style.download.css"
import { useNavigate } from 'react-router-dom';
import { DocumentArrowDownIcon, NewspaperIcon } from '@heroicons/react/24/solid';
const DownloadInvoice = ({ sale }) => {
    const navigate = useNavigate()
    const handleDownload = async (size) => {
        window.open(`/download/${sale._id}/${sale.invoiceId}/${size}`)
    };

    return (
        <div className='flex gap-4 relative'>
            <button onClick={() => handleDownload("a4")} className="bg-green-500 text-white py-1 px-3 rounded hover:bg-yellow-600 flex items-center"><DocumentArrowDownIcon className="h-5 w-5" /> <span className='hidden lg:inline'>A4</span></button>
            <button onClick={() => handleDownload("auto")} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-yellow-600 flex items-center"><NewspaperIcon className="h-5 w-5" /><span className='hidden lg:inline'>Chek</span></button>

        </div>
    );
};

export default DownloadInvoice;
