import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { baseURL } from '../api';

const DownloadPdf = () => {
    const { saleId, invoice } = useParams();
    const navigate = useNavigate();
    const contentRef = useRef(null); // Ref for the content to measure height
    const [contentHeight, setContentHeight] = useState(0); // State to store content height
    const [isDownloaded, setIsDownloaded] = useState(false); // Flag for download

    // Function to fetch and render the content
    const fetchContent = async () => {
        try {
            const response = await fetch(`${baseURL.replace('/api', '')}/download/${saleId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch the invoice');
            }
            const htmlContent = await response.text();
            contentRef.current.innerHTML = htmlContent;

            // Measure content height after rendering
            setContentHeight(contentRef.current.offsetHeight);
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    };

    // Function to generate and download the PDF
    const downloadPdf = async () => {
        if (contentRef.current) {
            const options = {
                margin: 1,
                filename: `Sotuv-${invoice}.pdf`,
                html2canvas: {
                    scale: 2,
                    loggin: true,
                    letterRendering: true,
                },
                jsPDF: {
                    unit: 'mm',
                    format: [80, ((contentHeight + 256) * 0.264583)], // Convert height to mm
                    orientation: 'portrait',
                },
            };
            await html2pdf().from(contentRef.current).set(options).save();
            setIsDownloaded(true);
        }
    };

    // Handle navigation or window close
    const handleClose = () => {
        if (window.history.length > 1) {
            navigate(-1); // Go back if there's history
        } else {
            window.close(); // Close the window if no history
        }
    };

    useEffect(() => {
        fetchContent(); // Fetch and render the content on mount
    }, []);

    useEffect(() => {
        if (contentHeight > 0 && !isDownloaded) {
            downloadPdf(); // Download PDF after height is measured
        } else if (isDownloaded) {
            handleClose(); // Navigate or close after download
        }
    }, [contentHeight, isDownloaded]);

    return (
        <div>
            <div ref={contentRef} />
            <p>Chek yuklanmoqda...</p>
        </div>
    );
};

export default DownloadPdf;
