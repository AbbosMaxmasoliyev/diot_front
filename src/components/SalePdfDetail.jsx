import React, { useRef } from 'react';
import { baseURL } from '../api';
import html2pdf from 'html2pdf.js';
import "./style.download.css"
import { useNavigate } from 'react-router-dom';
const DownloadInvoice = ({ sale }) => {
    const navigate = useNavigate()
    const handleDownload = async (size) => {
        window.open(`/download/${sale._id}/${sale.invoiceId}/${size}`)
    };

    return (
        <div className='flex gap-4 relative'>
            <button onClick={() => handleDownload(210)}>Katta</button>
            <button onClick={() => handleDownload([80])}>Kichik</button>

        </div>
    );
};

export default DownloadInvoice;
