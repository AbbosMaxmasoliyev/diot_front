import React, { useRef } from 'react';
import { baseURL } from '../api';
import html2pdf from 'html2pdf.js';
import "./style.download.css"
const DownloadInvoice = ({ sale }) => {
    const handleDownload = async (size) => {
        try {
            // Send a GET request to the backend to get the HTML content
            console.log();

            const response = await fetch(`${baseURL.replace("/api", "")}/download/${sale._id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch the invoice');
            }

            // Get the HTML content as text
            const htmlContent = await response.text();
          

            // Use html2pdf.js to generate the PDF and preserve the design
            const options = {
                margin: 1,
                
                filename: `Sotuv-${sale.invoiceId}.pdf`,
                html2canvas: {
                    scale: 2, // For higher resolution rendering
                    logging: true, // For debugging
                    letterRendering: true, // For better font rendering
                },
                jsPDF: { unit: 'mm', format: size, orientation: 'portrait' },
            };

            html2pdf()
                .from(htmlContent)
                .set(options)
                .save();
            // Create a Blob with the HTML content

        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <div className='flex gap-4 relative'>
            <button onClick={() => handleDownload("a4")}>Katta</button>
            <button onClick={() => handleDownload([80, 200])}>Kichik</button>
            
        </div>
    );
};

export default DownloadInvoice;
