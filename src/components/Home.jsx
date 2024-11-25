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
import Sales from "./Sales"
import InventoryList from './InventoryList';

const Home = () => {
    const { report, loading, fetchReport, error } = useSales()
    const { report: inventorReport, loading: inventoryLoading, fetchReport: inventorFetchReport, error: inventorError } = useInventory()
    // fetchReport()
    

    return (
        <>
            <div className="p-2">
                <div className="flex justify-between md:flex-row flex-col items-start gap-4">
                    <div className="flex flex-col md:w-7/12 w-full gap-5">
                        <Sales />
                        <InventoryList />
                    </div>
                    <div className="flex flex-col gap-5 p-6 w-full  md:w-5/12 justify-start items-start bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg md:p-6">
                        <SalesChart report={report} title={"Savdo indikatori"} />
                        <InventoryChart report={inventorReport} title={"Omborga mahsulotlar kirish"} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
