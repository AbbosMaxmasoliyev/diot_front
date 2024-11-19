import React from "react";
import { Line } from "react-chartjs-2"; // Line grafikasi uchun import
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { generateRandomData } from "../utils/genrate";
import moment from "moment";
import useSales from "../hooks/sales";
import useCustomers from "../hooks/clients";

// Chart.js modullarini ro'yxatdan o'tkazish
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const SalesChart = ({ displayed, title }) => {
    const { fetchReport, report } = useSales()
    const { customers } = useCustomers()
    // JSON ma'lumotlaringiz
    const data = generateRandomData()
    console.log(data);

    // Grafik ma'lumotlarini tayyorlash
    const chartData = {
        labels: data.map((item) => moment(item.date).format("DD")), // Sanalar
        datasets: [
            {
                label: "Umumiy sotilgan tovarlar soni",
                data: data.map((item) => item.totalQuantity), // Umumiy sotilgan miqdor
                backgroundColor: "rgba(75, 192, 192, 0.2)", // Xatoliklar bilan to'ldirilgan fon rangi
                borderColor: "rgba(75, 192, 192, 1)", // Chiziq rangi
                borderWidth: 1,
                fill: true, // To'ldirishni yoqish
            },
            {
                label: "Sotuvlar soni", // Ikkinchi chiziq (sotuvlar soni)
                data: data.map((item) => item.salesCount), // Sotuvlar soni
                backgroundColor: "rgba(153, 102, 255, 1)", // Fon rangi
                borderColor: "rgba(153, 102, 255, 1)", // Chiziq rangi
                borderWidth: 1,
                fill: false, // To'ldirish
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    boxWidth: 10, // Raqam oldidagi kvadratning eni
                    boxHeight: 10, // Raqam oldidagi kvadratning balandligi
                    borderRadius: 5,
                    font: {
                        size: 10 // Legend matni o'lchami
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,

            },
        },
    };

    return (
        <div className="w-96 flex flex-col gap-4">
            <div className="flex gap-3 md:flex-row flex-col  justify-between flex-wrap">
                <h2>{title}</h2>
                <select
                    onChange={(e) => {
                        console.log(e.target.value);
                        if (e.target.value !== "all") {
                            fetchReport({ customerId: e.target.value })
                        } else {
                            fetchReport()
                        }
                    }}
                    className="w-36 px-2 py-0 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                    <option
                        className="text-gray-700 dark:text-gray-300"
                        value={"all"}
                    >
                        Barchasi
                    </option>
                    {
                        customers.map((customer) => (
                            <option
                                value={customer._id}
                                className="text-gray-700 dark:text-gray-300"
                            >
                                {customer.name}
                            </option>
                        ))
                    }
                </select>
            </div>
            <Line data={chartData} options={{ ...options, scales: { y: { beforeFit: true } } }} /> {/* Bar o'rniga Line grafikasi */}
        </div>
    );
};

export default SalesChart;
