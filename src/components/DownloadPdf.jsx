import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './style.download.css';
import html2pdf from 'html2pdf.js';
import { baseURL } from '../api';

const DownloadPdf = () => {
    const { saleId, invoice } = useParams();
    const [isDownloaded, setIsDownloaded] = useState(false); // Flag for download

    async function downloadGenerator(size) {
        try {
            // Check if already downloaded
            if (!isDownloaded) {
                const response = await fetch(`${baseURL.replace('/api', '')}/download/${saleId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch the invoice');
                }

                // Get the HTML content as text
                const htmlContent = await response.text();

                // Generate the PDF
                const options = {
                    margin: 1,
                    filename: `Sotuv-${invoice}.pdf`,
                    html2canvas: {
                        scale: 2,
                        logging: true,
                        letterRendering: true,
                    },
                    jsPDF: { unit: 'mm', format: size, orientation: 'portrait' },
                };
                await html2pdf().from(htmlContent).set(options).save();

                // Set the flag to true after download
                setIsDownloaded(true);
            }
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }

    useEffect(() => {
        if (!isDownloaded) {
            downloadGenerator([80, 200]);
        }
    }, [isDownloaded]); // Add dependencies to prevent extra renders

    return <p>salom</p>;
};

export default DownloadPdf;
