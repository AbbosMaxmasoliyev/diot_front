const formatPhoneNumber = (value) => {

    // Faqat raqamlar
    const phoneNumber = value.toString().replace(/[^\d]/g, "");

    // Agar raqam 9 ta bo'lsa, telefon raqamini formatlash
    if (phoneNumber.length >= 12) {
        return "+998 (" + phoneNumber.slice(3, 5) + ") " + phoneNumber.slice(5, 8) + "-" + phoneNumber.slice(8, 10) + "-" + phoneNumber.slice(10, 12);
    }
    console.log(phoneNumber.length);

    return phoneNumber; // Raqamlar uzunligi 9 dan katta bo'lsa, qaytarish
};


/**
 * Berilgan qiymatni valyuta formatiga o'zgartiradi
 * @param {number} value - Formatlanadigan qiymat
 * @param {string} currency - Valyuta kodi (masalan, "UZS", "USD")
 * @param {string} locale - Hudud kodi (masalan, "uz-UZ", "en-US")
 * @returns {string} Formatlangan valyuta
 */
const formatCurrency = (value, currency = 'UZS', locale = 'uz-UZ') => {
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(value);
    } catch (error) {
        console.error('Valyuta formatlashda xatolik:', error);
        return value.toString(); // Xatolik bo'lsa, oddiy qiymatni qaytaradi
    }
};


const categorizeSalesByDate = (sales, productId = null, customerId = null) => {
    // Filtrni qo'llash (mijoz yoki mahsulot bo'yicha)
    const filteredSales = sales.filter(sale => {
        let productMatch = productId ? sale.productId === productId : true;
        let customerMatch = customerId ? sale.customerId === customerId : true;
        return productMatch && customerMatch;
    });

    // Ma'lumotlarni kunlar bo'yicha guruhlash
    const salesByDate = filteredSales.reduce((acc, sale) => {
        if (!acc[sale.date]) {
            acc[sale.date] = [];
        }
        acc[sale.date].push(sale);
        return acc;
    }, {});

    // Natijani massivga aylantirish va umumiy qiymatlarni hisoblash
    return Object.entries(salesByDate).map(([date, daySales]) => {
        const totalQuantity = daySales.reduce((sum, sale) => sum + sale.totalQuantity, 0);
        const totalSales = daySales.reduce((sum, sale) => sum + sale.totalSales, 0);
        const salesCount = daySales.reduce((sum, sale) => sum + sale.salesCount, 0);

        return {
            date,
            totalQuantity,
            totalSales,
            salesCount,
            details: daySales, // Kundagi har bir sotuvni batafsil ko‘rish uchun
        };
    });
};

// Misol uchun foydalanish:
const sales = [
    {
        "date": "2024-11-18",
        "productId": "673b105fc0f18f81510c0874",
        "customerId": "6735ecedc7a6011eec16c578",
        "totalQuantity": 15,
        "totalSales": 0,
        "salesCount": 1
    },
    {
        "date": "2024-11-18",
        "productId": "673a2e11f3c6e45b91743ae3",
        "customerId": "6735ecedc7a6011eec16c578",
        "totalQuantity": 24,
        "totalSales": 0,
        "salesCount": 2
    },
    {
        "date": "2024-11-18",
        "productId": "673b1045c0f18f81510c0871",
        "customerId": "6735ecedc7a6011eec16c578",
        "totalQuantity": 13,
        "totalSales": 0,
        "salesCount": 1
    }
];

// Faqat mahsulot ID bo'yicha
const categorizedByProduct = categorizeSalesByDate(sales, "673b105fc0f18f81510c0874");
console.log("Categorized by Product:", categorizedByProduct);

// Faqat mijoz ID bo'yicha
const categorizedByCustomer = categorizeSalesByDate(sales, null, "6735ecedc7a6011eec16c578");
console.log("Categorized by Customer:", categorizedByCustomer);

// Hech qanday filtrsiz barcha savdolar
const allSalesCategorized = categorizeSalesByDate(sales);
console.log("All Sales Categorized:", allSalesCategorized);



export { formatPhoneNumber, formatCurrency }