const generateRandomData = () => {
    const generateRandomId = () => Math.random().toString(36).substr(2, 24);
    const generateRandomQuantity = () => Math.floor(Math.random() * 20) + 1; // 1 dan 20 gacha tasodifiy son
    const generateRandomSales = () => parseFloat((Math.random() * 100).toFixed(2)); // 0 dan 100 gacha tasodifiy pul qiymati
    const generateRandomCount = () => Math.floor(Math.random() * 5) + 1; // 1 dan 5 gacha sotuvlar soni

    const data = [];
    const startDate = new Date("2024-11-18");

    for (let i = 0; i < 20; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i); // Har bir yangi yozuv uchun kunni oshiramiz

        data.push({
            date: currentDate.toISOString().split('T')[0],
            productId: generateRandomId(),
            customerId: generateRandomId(),
            totalQuantity: generateRandomQuantity(),
            totalSales: generateRandomSales(),
            salesCount: generateRandomCount(),
        });
    }

    return data;
};

export { generateRandomData }
