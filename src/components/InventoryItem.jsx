import React from "react";
import { useLoaderData } from "react-router-dom";
import { formatCurrency } from "../utils/converter";
import moment from "moment";

const InventoryDetails = () => {
    const inventory = useLoaderData();
    const { totalAmount } = inventory.income.reduce((total, inventor) => {
        total.totalAmount = total.totalAmount + (inventor.quantity * inventor.incomePrice); // total miqdorini hisoblash
        return total; // natijani qaytarish
    }, { totalAmount: 0 }); // boshlang'ich qiymat: 0

    console.log(totalAmount);


    return (
        <div className="md:p-6 bg-gray-100 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-6">"{inventory.productId.name}" mahsuloti ma'lumotlari</h1>

            <div
                key={inventory._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 md:p-5 mb-6"
            >
                {/* Mahsulot ma'lumotlari */}
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Mahsulot: {inventory.productId.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Izoh: {inventory.productId.description}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        Kategoriya: {inventory.productId.category}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        Narx: <span className="font-bold">{inventory.productId.price} so'm</span>
                    </p>
                </div>

                {/* Inventor ma'lumotlari */}
                <div className="mb-4">
                    <p>
                        <span className="font-semibold">Umumiy miqdor:</span>{" "}
                        {inventory.totalQuantity}
                    </p>
                    <p>
                        <span className="font-semibold">Inventor narxi:</span>{" "}
                        {inventory.price} so'm
                    </p>
                </div>

                {/* Kirim ma'lumotlari */}
                <h3 className="text-lg font-semibold mb-2">Kirimlar</h3>
                <div className="mb-4 max-w-[100%] overflow-x-auto">
                    <table className="min-w-full  table-auto bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 rounded-lg shadow-inner mb-4 ">
                        <thead>
                            <tr className="border-t border-gray-200 dark:border-gray-700">
                                <th className="py-2 px-4 text-left">Kirim Miqdori</th>
                                <th className="py-2 px-4 text-left">Kirim Narxi</th>
                                <th className="py-2 px-4 text-left">Kirim Vaqti</th>
                                <th className="py-2 px-4 text-left">Ta'minotchi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.income.map((income) => (
                                <tr
                                    key={income._id}
                                    className="border-y border-gray-200 dark:border-black-700 hover:bg-gray-800 "
                                >
                                    <td className="py-2 px-4">{income.quantity}</td>
                                    <td className="py-2 px-4">{income.incomePrice} so'm</td>
                                    <td className="py-2 px-4">
                                        {moment(income.date).format("DD.MM.YYYY")}
                                    </td>
                                    <td className="py-2 px-4">
                                        {income?.supplier?.name || "Kiritilmagan"}
                                    </td>
                                </tr>
                            ))}

                            <tr
                                className="border-t border-gray-200 dark:border-gray-700"
                            >
                                <td className="py-2 px-4" >Umumiy soni</td>
                                <td className="py-2 px-4 font-semibold text-xl" colSpan={2}>{inventory.totalQuantity} ta</td>

                            </tr>
                            <tr
                                className="border-t border-gray-200 dark:border-gray-700"
                            >
                                <td className="py-2 px-4" >Umumiy summasi</td>
                                <td className="py-2 px-4 font-semibold text-xl" colSpan={2}>{formatCurrency(totalAmount)}</td>

                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Chiqim ma'lumotlari */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Chiqimlar</h3>
                    <table className="min-w-full table-auto bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 rounded-lg shadow-inner mb-4">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                <th className="py-2 px-4 text-left">Chiqim Miqdori</th>
                                <th className="py-2 px-4 text-left">Ombor Holati</th>
                                <th className="py-2 px-4 text-left">Chiqim Vaqti</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.outgoings.map((outgoing) => (
                                <tr
                                    key={outgoing._id}
                                    className="border-t border-gray-200 dark:border-gray-700"
                                >
                                    <td className="py-2 px-4">{outgoing.quantity}</td>
                                    <td className="py-2 px-4">{outgoing.currentStock}</td>
                                    <td className="py-2 px-4">
                                        {moment(outgoing.date).format("DD.MM.YYYY")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryDetails;
