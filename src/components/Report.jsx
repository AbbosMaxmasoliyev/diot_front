import React, { useEffect, useState } from "react";
import api from "../api";

const Report = () => {
    const [inventoryReport, setInventoryReport] = useState({});
    const [salesReport, setSalesReport] = useState({});

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const inventory = await api.get("/inventory-report");
                const sales = await api.get("/sales-report");
                setInventoryReport(inventory.data || {});
                setSalesReport(sales.data || {});
            } catch (error) {
                console.error("Hisobotlarni olishda xatolik:", error);
            }
        };

        fetchReports();
    }, []);

    return (
        <div className="bg-white p-4 shadow rounded">
            <h3 className="text-lg font-bold mb-4">Umumiy Hisobot</h3>
            <div className="mb-4">
                <h4 className="font-bold">Omborga Kirim:</h4>
                <p>Jami Mahsulot Miqdori: {inventoryReport.totalQuantity || 0}</p>
                <p>Jami Kirim Narxi: {inventoryReport.totalCost || 0} so'm</p>
            </div>
            <div className="mb-4">
                <h4 className="font-bold">Savdolar:</h4>
                <p>Jami Sotilgan Miqdor: {salesReport.totalQuantitySold || 0}</p>
                <p>Jami Daromad: {salesReport.totalRevenue || 0} so'm</p>
            </div>
        </div>
    );
};

export default Report;
