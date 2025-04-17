/**
 * eia-api.js - تكامل Energy Information Administration API مع حاسبة الطاقة الشمسية
 */

// متغيرات عامة
const EIA_API_KEY = "YOUR_EIA_API_KEY"; // يجب استبداله بمفتاح API الخاص بك
const EIA_API_URL = "https://api.eia.gov/v2";

// بيانات أسعار الكهرباء
let electricityPriceData = null;

// الحصول على أسعار الكهرباء حسب المنطقة
async function getElectricityPrices(countryCode, stateCode) {
    try {
        // في بيئة الإنتاج، سنستخدم واجهة برمجة EIA الحقيقية
        // لكن في هذا المثال، سنستخدم محاكاة للاستجابة لتجنب الحاجة إلى مفتاح API حقيقي
        
        console.log(`طلب أسعار الكهرباء للبلد: ${countryCode}، المنطقة: ${stateCode}`);
        
        // في بيئة الإنتاج، سنستخدم الكود التالي للاتصال بواجهة البرمجة:
        /*
        const url = `${EIA_API_URL}/electricity/retail-sales/data/?api_key=${EIA_API_KEY}&frequency=monthly&data[0]=price&facets[stateid]=${stateCode}&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=1`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`فشل في الاتصال بواجهة برمجة EIA: ${response.status}`);
        }
        
        const data = await response.json();
        */
        
        // بدلاً من ذلك، سنستخدم محاكاة للاستجابة
        const data = simulateEIAResponse(countryCode, stateCode);
        
        // تخزين البيانات للاستخدام في الحسابات
        electricityPriceData = {
            residentialPrice: data.residentialPrice,
            commercialPrice: data.commercialPrice,
            industrialPrice: data.industrialPrice,
            currency: data.currency,
            unit: data.unit,
            lastUpdated: data.lastUpdated
        };
        
        return electricityPriceData;
    } catch (error) {
        console.error("خطأ في الحصول على أسعار الكهرباء:", error);
        return null;
    }
}

// محاكاة استجابة واجهة برمجة EIA
function simulateEIAResponse(countryCode, stateCode) {
    // هذه دالة تحاكي استجابة واجهة برمجة EIA
    // في التطبيق الحقيقي، سنستخدم الاستجابة الفعلية من الواجهة
    
    // قاموس بأسعار الكهرباء التقريبية حسب البلد
    const countriesData = {
        'US': {
            'CA': { residential: 0.22, commercial: 0.18, industrial: 0.15 },
            'TX': { residential: 0.12, commercial: 0.10, industrial: 0.08 },
            'NY': { residential: 0.20, commercial: 0.17, industrial: 0.14 },
            'FL': { residential: 0.13, commercial: 0.11, industrial: 0.09 },
            'default': { residential: 0.15, commercial: 0.13, industrial: 0.11 }
        },
        'SA': {
            'default': { residential: 0.08, commercial: 0.07, industrial: 0.06 }
        },
        'AE': {
            'default': { residential: 0.09, commercial: 0.08, industrial: 0.07 }
        },
        'EG': {
            'default': { residential: 0.05, commercial: 0.04, industrial: 0.03 }
        },
        'default': {
            'default': { residential: 0.15, commercial: 0.13, industrial: 0.11 }
        }
    };
    
    // الحصول على بيانات البلد
    const country = countriesData[countryCode] || countriesData['default'];
    
    // الحصول على بيانات المنطقة
    const state = country[stateCode] || country['default'];
    
    // إضافة بعض التغيير العشوائي للتمثيل الواقعي
    const randomFactor = 0.95 + (Math.random() * 0.1); // 0.95-1.05
    
    // تحديد العملة بناءً على البلد
    let currency;
    switch (countryCode) {
        case 'US':
            currency = 'USD';
            break;
        case 'SA':
        case 'AE':
            currency = 'SAR';
            break;
        case 'EG':
            currency = 'EGP';
            break;
        default:
            currency = 'USD';
    }
    
    return {
        residentialPrice: parseFloat((state.residential * randomFactor).toFixed(4)),
        commercialPrice: parseFloat((state.commercial * randomFactor).toFixed(4)),
        industrialPrice: parseFloat((state.industrial * randomFactor).toFixed(4)),
        currency: currency,
        unit: 'kWh',
        lastUpdated: new Date().toISOString().split('T')[0]
    };
}

// الحصول على متوسط أسعار الكهرباء التاريخية
async function getHistoricalElectricityPrices(countryCode, stateCode, years = 5) {
    try {
        // في بيئة الإنتاج، سنستخدم واجهة برمجة EIA الحقيقية
        // لكن في هذا المثال، سنستخدم محاكاة للاستجابة
        
        console.log(`طلب أسعار الكهرباء التاريخية للبلد: ${countryCode}، المنطقة: ${stateCode}، السنوات: ${years}`);
        
        // محاكاة للاستجابة
        const currentPrice = simulateEIAResponse(countryCode, stateCode).residentialPrice;
        const historicalData = [];
        
        // إنشاء بيانات تاريخية وهمية
        const currentYear = new Date().getFullYear();
        for (let i = 0; i < years; i++) {
            const year = currentYear - i;
            
            // افتراض زيادة سنوية بنسبة 2-4%
            const yearFactor = Math.pow(1 - (0.02 + Math.random() * 0.02), i);
            const price = currentPrice * yearFactor;
            
            historicalData.push({
                year: year,
                price: parseFloat(price.toFixed(4))
            });
        }
        
        return historicalData;
    } catch (error) {
        console.error("خطأ في الحصول على أسعار الكهرباء التاريخية:", error);
        return null;
    }
}

// التنبؤ بأسعار الكهرباء المستقبلية
function predictFutureElectricityPrices(currentPrice, years = 25) {
    try {
        // هذه دالة تتنبأ بأسعار الكهرباء المستقبلية بناءً على السعر الحالي
        // في التطبيق الحقيقي، يمكن استخدام نماذج أكثر تعقيداً
        
        const futureData = [];
        const currentYear = new Date().getFullYear();
        
        // افتراض زيادة سنوية بنسبة 3-5%
        const annualIncrease = 0.03 + Math.random() * 0.02;
        
        for (let i = 0; i < years; i++) {
            const year = currentYear + i;
            
            // حساب السعر المستقبلي
            const yearFactor = Math.pow(1 + annualIncrease, i);
            const price = currentPrice * yearFactor;
            
            futureData.push({
                year: year,
                price: parseFloat(price.toFixed(4))
            });
        }
        
        return futureData;
    } catch (error) {
        console.error("خطأ في التنبؤ بأسعار الكهرباء المستقبلية:", error);
        return null;
    }
}

// حساب التوفير المالي مع مراعاة الزيادة المتوقعة في أسعار الكهرباء
function calculateFinancialSavingsWithPriceIncrease(annualProduction, currentPrice, years = 25) {
    try {
        // الحصول على التنبؤ بأسعار الكهرباء المستقبلية
        const futurePrices = predictFutureElectricityPrices(currentPrice, years);
        
        // حساب التوفير السنوي لكل سنة
        const annualSavings = futurePrices.map(item => ({
            year: item.year,
            savings: parseFloat((annualProduction * item.price).toFixed(2)),
            price: item.price
        }));
        
        // حساب إجمالي التوفير على مدى الفترة
        const totalSavings = annualSavings.reduce((sum, item) => sum + item.savings, 0);
        
        // حساب متوسط التوفير السنوي
        const averageAnnualSavings = totalSavings / years;
        
        // حساب متوسط التوفير الشهري
        const averageMonthlySavings = averageAnnualSavings / 12;
        
        return {
            monthly: parseFloat(averageMonthlySavings.toFixed(2)),
            annual: parseFloat(averageAnnualSavings.toFixed(2)),
            lifetime: parseFloat(totalSavings.toFixed(2)),
            yearlyBreakdown: annualSavings
        };
    } catch (error) {
        console.error("خطأ في حساب التوفير المالي مع مراعاة الزيادة في الأسعار:", error);
        return null;
    }
}

// تحويل العملة
function convertCurrency(amount, fromCurrency, toCurrency) {
    // هذه دالة تحول المبلغ من عملة إلى أخرى
    // في التطبيق الحقيقي، يمكن استخدام واجهة برمجة لأسعار الصرف
    
    // أسعار صرف تقريبية (بالنسبة للدولار الأمريكي)
    const exchangeRates = {
        'USD': 1.0,
        'SAR': 3.75,
        'AED': 3.67,
        'EGP': 30.9,
        'EUR': 0.92,
        'GBP': 0.79
    };
    
    // التحقق من وجود العملات
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        console.error("عملة غير مدعومة");
        return amount;
    }
    
    // تحويل المبلغ إلى الدولار الأمريكي أولاً، ثم إلى العملة المطلوبة
    const amountInUSD = amount / exchangeRates[fromCurrency];
    const amountInTargetCurrency = amountInUSD * exchangeRates[toCurrency];
    
    return parseFloat(amountInTargetCurrency.toFixed(2));
}

// تصدير الدوال للاستخدام في ملفات أخرى
window.getElectricityPrices = getElectricityPrices;
window.getHistoricalElectricityPrices = getHistoricalElectricityPrices;
window.predictFutureElectricityPrices = predictFutureElectricityPrices;
window.calculateFinancialSavingsWithPriceIncrease = calculateFinancialSavingsWithPriceIncrease;
window.convertCurrency = convertCurrency;
window.electricityPriceData = electricityPriceData;
