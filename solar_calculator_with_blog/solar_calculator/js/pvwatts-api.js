/**
 * pvwatts-api.js - تكامل PVWatts API مع حاسبة الطاقة الشمسية
 */

// متغيرات عامة
const PVWATTS_API_KEY = "YOUR_NREL_API_KEY"; // يجب استبداله بمفتاح API الخاص بك
const PVWATTS_API_URL = "https://developer.nrel.gov/api/pvwatts/v6.json";

// بيانات إنتاج الطاقة الشمسية
let solarProductionData = null;

// حساب إنتاج الطاقة المتوقع باستخدام PVWatts API
async function calculateSolarProduction(params) {
    try {
        // في بيئة الإنتاج، سنستخدم واجهة برمجة PVWatts الحقيقية
        // لكن في هذا المثال، سنستخدم محاكاة للاستجابة لتجنب الحاجة إلى مفتاح API حقيقي
        
        // بناء معلمات الطلب
        const queryParams = {
            api_key: PVWATTS_API_KEY,
            system_capacity: params.systemCapacity || 5, // قدرة النظام بالكيلوواط
            module_type: params.moduleType || 0, // نوع الوحدة (0: قياسي، 1: أفلام رقيقة، 2: أحادي البلورية)
            losses: params.losses || 14, // نسبة الخسائر في النظام
            array_type: params.arrayType || 0, // نوع المصفوفة (0: ثابتة، 1: تتبع محور واحد، 2: تتبع محورين)
            tilt: params.tilt || 20, // زاوية الميل بالدرجات
            azimuth: params.azimuth || 180, // زاوية السمت بالدرجات (180 = جنوب)
            lat: params.latitude, // خط العرض
            lon: params.longitude, // خط الطول
            timeframe: 'monthly' // الإطار الزمني للنتائج (شهري أو ساعي)
        };
        
        console.log("حساب إنتاج الطاقة الشمسية باستخدام المعلمات:", queryParams);
        
        // في بيئة الإنتاج، سنستخدم الكود التالي للاتصال بواجهة البرمجة:
        /*
        const url = `${PVWATTS_API_URL}?${new URLSearchParams(queryParams)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`فشل في الاتصال بواجهة برمجة PVWatts: ${response.status}`);
        }
        
        const data = await response.json();
        */
        
        // بدلاً من ذلك، سنستخدم محاكاة للاستجابة
        const data = simulatePVWattsResponse(queryParams);
        
        // تخزين البيانات للاستخدام في الحسابات
        solarProductionData = {
            annualProduction: data.outputs.ac_annual, // الإنتاج السنوي بالكيلوواط ساعة
            monthlyProduction: data.outputs.ac_monthly, // الإنتاج الشهري بالكيلوواط ساعة
            capacityFactor: data.outputs.capacity_factor, // عامل السعة
            solradMonthly: data.outputs.solrad_monthly // الإشعاع الشمسي الشهري
        };
        
        return solarProductionData;
    } catch (error) {
        console.error("خطأ في حساب إنتاج الطاقة الشمسية:", error);
        return null;
    }
}

// محاكاة استجابة واجهة برمجة PVWatts
function simulatePVWattsResponse(params) {
    // هذه دالة تحاكي استجابة واجهة برمجة PVWatts
    // في التطبيق الحقيقي، سنستخدم الاستجابة الفعلية من الواجهة
    
    const { system_capacity, tilt, azimuth, lat, lon, losses, array_type } = params;
    
    // حساب عامل الموقع بناءً على خط العرض
    const absLat = Math.abs(lat);
    let locationFactor;
    
    if (absLat < 20) {
        locationFactor = 1.3; // المناطق الاستوائية
    } else if (absLat < 35) {
        locationFactor = 1.1; // المناطق شبه الاستوائية
    } else if (absLat < 50) {
        locationFactor = 0.9; // المناطق المعتدلة
    } else {
        locationFactor = 0.7; // المناطق القطبية
    }
    
    // حساب عامل الميل
    // الميل المثالي يقترب من خط العرض
    const optimalTilt = absLat;
    const tiltDifference = Math.abs(tilt - optimalTilt);
    const tiltFactor = 1 - (tiltDifference / 90) * 0.3; // أقصى خسارة 30% عند الميل الخاطئ تماماً
    
    // حساب عامل الاتجاه
    // الاتجاه المثالي هو الجنوب (180 درجة) في نصف الكرة الشمالي
    // والشمال (0 درجة) في نصف الكرة الجنوبي
    const optimalAzimuth = lat >= 0 ? 180 : 0;
    const azimuthDifference = Math.min(Math.abs(azimuth - optimalAzimuth), 360 - Math.abs(azimuth - optimalAzimuth));
    const azimuthFactor = 1 - (azimuthDifference / 180) * 0.5; // أقصى خسارة 50% عند الاتجاه الخاطئ تماماً
    
    // حساب عامل نوع المصفوفة
    let arrayTypeFactor;
    switch (array_type) {
        case 0: // ثابتة
            arrayTypeFactor = 1.0;
            break;
        case 1: // تتبع محور واحد
            arrayTypeFactor = 1.25;
            break;
        case 2: // تتبع محورين
            arrayTypeFactor = 1.35;
            break;
        default:
            arrayTypeFactor = 1.0;
    }
    
    // حساب عامل الخسائر
    const lossesFactor = 1 - (losses / 100);
    
    // حساب الإنتاج الشهري
    const monthlyProduction = [];
    const solradMonthly = [];
    let annualProduction = 0;
    
    // عوامل شهرية تعتمد على الموسم
    // في نصف الكرة الشمالي، يكون الإنتاج أعلى في الصيف (يونيو-أغسطس)
    // في نصف الكرة الجنوبي، يكون الإنتاج أعلى في الصيف (ديسمبر-فبراير)
    for (let i = 0; i < 12; i++) {
        let monthFactor;
        if (lat >= 0) {
            // نصف الكرة الشمالي
            monthFactor = 1 - 0.5 * Math.cos((i - 5) * Math.PI / 6);
        } else {
            // نصف الكرة الجنوبي
            monthFactor = 1 - 0.5 * Math.cos((i + 1) * Math.PI / 6);
        }
        
        // حساب الإشعاع الشمسي الشهري (كيلوواط ساعة/م²/يوم)
        const baseSolrad = 5 * locationFactor * monthFactor;
        const solrad = baseSolrad * tiltFactor * azimuthFactor;
        solradMonthly.push(parseFloat(solrad.toFixed(2)));
        
        // حساب الإنتاج الشهري (كيلوواط ساعة)
        // الصيغة التقريبية: الإنتاج = القدرة × الإشعاع × عدد أيام الشهر × عامل المصفوفة × عامل الخسائر
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i];
        const monthlyOutput = system_capacity * solrad * daysInMonth * arrayTypeFactor * lossesFactor;
        monthlyProduction.push(parseFloat(monthlyOutput.toFixed(2)));
        
        annualProduction += monthlyOutput;
    }
    
    // حساب عامل السعة
    // عامل السعة = الإنتاج السنوي الفعلي / الإنتاج النظري الأقصى
    // الإنتاج النظري الأقصى = القدرة × 24 ساعة × 365 يوم
    const capacityFactor = (annualProduction / (system_capacity * 24 * 365)) * 100;
    
    return {
        inputs: {
            system_capacity,
            lat,
            lon,
            azimuth,
            tilt,
            array_type,
            losses
        },
        outputs: {
            ac_monthly: monthlyProduction,
            ac_annual: parseFloat(annualProduction.toFixed(2)),
            solrad_monthly: solradMonthly,
            capacity_factor: parseFloat(capacityFactor.toFixed(2))
        }
    };
}

// تحسين زاوية الميل والتوجيه
function optimizeTiltAndAzimuth(latitude) {
    // هذه دالة تحسب زاوية الميل والتوجيه المثاليين بناءً على خط العرض
    
    // الميل المثالي يقترب من خط العرض
    // في المناطق ذات الطقس الحار، يمكن تقليل الميل قليلاً
    // في المناطق ذات الطقس البارد، يمكن زيادة الميل قليلاً
    const absLat = Math.abs(latitude);
    let optimalTilt;
    
    if (absLat < 20) {
        // المناطق الاستوائية
        optimalTilt = absLat * 0.87;
    } else if (absLat < 35) {
        // المناطق شبه الاستوائية
        optimalTilt = absLat * 0.93;
    } else if (absLat < 50) {
        // المناطق المعتدلة
        optimalTilt = absLat * 0.98;
    } else {
        // المناطق القطبية
        optimalTilt = absLat * 1.04;
    }
    
    // الاتجاه المثالي هو الجنوب (180 درجة) في نصف الكرة الشمالي
    // والشمال (0 درجة) في نصف الكرة الجنوبي
    const optimalAzimuth = latitude >= 0 ? 180 : 0;
    
    return {
        tilt: Math.round(optimalTilt),
        azimuth: optimalAzimuth
    };
}

// حساب المساحة المطلوبة للألواح الشمسية
function calculateRequiredArea(systemCapacity) {
    // هذه دالة تحسب المساحة التقريبية المطلوبة للألواح الشمسية بناءً على قدرة النظام
    // الصيغة التقريبية: المساحة (م²) = القدرة (كيلوواط) × 7
    // هذا يفترض كفاءة متوسطة للألواح الشمسية
    
    return systemCapacity * 7;
}

// حساب قدرة النظام بناءً على المساحة المتاحة
function calculateSystemCapacity(availableArea) {
    // هذه دالة تحسب قدرة النظام التقريبية بناءً على المساحة المتاحة
    // الصيغة التقريبية: القدرة (كيلوواط) = المساحة (م²) / 7
    
    return availableArea / 7;
}

// حساب التوفير المالي
function calculateFinancialSavings(annualProduction, electricityPrice) {
    // هذه دالة تحسب التوفير المالي بناءً على إنتاج الطاقة وسعر الكهرباء
    
    const annualSavings = annualProduction * electricityPrice;
    const monthlySavings = annualSavings / 12;
    const lifetimeSavings = annualSavings * 25; // عمر افتراضي 25 سنة
    
    return {
        monthly: parseFloat(monthlySavings.toFixed(2)),
        annual: parseFloat(annualSavings.toFixed(2)),
        lifetime: parseFloat(lifetimeSavings.toFixed(2))
    };
}

// حساب الفوائد البيئية
function calculateEnvironmentalBenefits(annualProduction) {
    // هذه دالة تحسب الفوائد البيئية بناءً على إنتاج الطاقة
    
    // متوسط انبعاثات CO2 لكل كيلوواط ساعة من الكهرباء التقليدية
    // هذه القيمة تختلف حسب البلد ومصادر الطاقة
    const co2PerKWh = 0.5; // كجم CO2 لكل كيلوواط ساعة
    
    // حساب تخفيض CO2 السنوي
    const co2Reduction = annualProduction * co2PerKWh;
    
    // حساب ما يعادل عدد الأشجار
    // شجرة واحدة تمتص حوالي 22 كجم من CO2 سنوياً
    const treesEquivalent = co2Reduction / 22;
    
    return {
        co2Reduction: parseFloat(co2Reduction.toFixed(2)),
        treesEquivalent: Math.round(treesEquivalent)
    };
}

// حساب تفاصيل الاستثمار
function calculateInvestmentDetails(systemCapacity, annualSavings) {
    // هذه دالة تحسب تفاصيل الاستثمار بناءً على قدرة النظام والتوفير السنوي
    
    // تكلفة تقريبية لكل كيلوواط
    // هذه القيمة تختلف حسب البلد والتكنولوجيا والمورد
    const costPerKW = 1500; // دولار لكل كيلوواط
    
    // حساب التكلفة الإجمالية
    const totalCost = systemCapacity * costPerKW;
    
    // حساب فترة استرداد الاستثمار
    const paybackPeriod = totalCost / annualSavings;
    
    // حساب العائد على الاستثمار
    // ROI = (صافي الربح / التكلفة) × 100
    // صافي الربح = التوفير على مدى 25 عاماً - التكلفة
    const netProfit = (annualSavings * 25) - totalCost;
    const roi = (netProfit / totalCost) * 100;
    
    return {
        estimatedCost: parseFloat(totalCost.toFixed(2)),
        paybackPeriod: parseFloat(paybackPeriod.toFixed(1)),
        roi: parseFloat(roi.toFixed(1))
    };
}

// تصدير الدوال للاستخدام في ملفات أخرى
window.calculateSolarProduction = calculateSolarProduction;
window.optimizeTiltAndAzimuth = optimizeTiltAndAzimuth;
window.calculateRequiredArea = calculateRequiredArea;
window.calculateSystemCapacity = calculateSystemCapacity;
window.calculateFinancialSavings = calculateFinancialSavings;
window.calculateEnvironmentalBenefits = calculateEnvironmentalBenefits;
window.calculateInvestmentDetails = calculateInvestmentDetails;
window.solarProductionData = solarProductionData;
