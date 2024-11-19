import React, { useState } from 'react';
import OrderForm from './OrderForm';
import { TrashIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import useOrders from '../hooks/orders'; // Import the custom hook
import { formatPhoneNumber } from '../utils/converter';
import Payments from './payments';
import useSales from '../hooks/sales';
import SalesChart from './SalesChart';
import useInventory from '../hooks/invetory';
import InventoryChart from './InconeOutcome';

const Home = () => {
    const { report, loading, fetchReport, error } = useSales()
    const { report: inventorReport, loading: inventoryLoading, fetchReport: inventorFetchReport, error: inventorError } = useInventory()
    // fetchReport()
    console.log(report);

    return (
        <>
            <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Statistika</h2>
                <div className="flex flex-row gap-12 flex-wrap">

                    <SalesChart report={report} title={"Savdo indikatori"} />
                    <InventoryChart report={inventorReport} title={"Omborga mahsulotlar kirish"} />
                </div>
            </div>
        </>
    );
};

export default Home;
