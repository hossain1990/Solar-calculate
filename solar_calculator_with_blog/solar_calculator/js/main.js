/**
 * main.js - الملف الرئيسي لحاسبة الطاقة الشمسية
 */

// متغيرات عامة
let calculationResults = null;
let userPreferences = {
    currency: 'USD',
    language: 'ar',
    units: 'metric'
};

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('تهيئة حاسبة الطاقة الشمسية...');
    
    // تهيئة نموذج الحاسبة
    initializeCalculatorForm();
    
    // إضافة مستمعات الأحداث
    setupEventListeners();
    
    // تهيئة الرسوم البيانية
    initializeCharts();
    
    // تهيئة اختيار اللغة
    initializeLanguageSelector();
    
    // تهيئة اختيار العملة
    initializeCurrencySelector();
    
    console.log('اكتملت تهيئة حاسبة الطاقة الشمسية');
});

// تهيئة نموذج الحاسبة
function initializeCalculatorForm() {
    // تعيين القيم الافتراضية
    document.getElementById('system-capacity').value = '5';
    document.getElementById('roof-size').value = '35';
    document.getElementById('panel-tilt').value = '20';
    document.getElementById('panel-azimuth').value = '180';
    document.getElementById('electricity-consumption').value = '500';
    document.getElementById('electricity-price').value = '0.15';
    
    // تحديث القيم المثالية للميل والتوجيه بناءً على الموقع الافتراضي
    updateOptimalTiltAndAzimuth();
}

// إضافة مستمعات الأحداث
function setupEventListeners() {
    // مستمع حدث لزر الحساب
    const calculateButton = document.getElementById('calculate-button');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateSolarResults);
    }
    
    // مستمع حدث لتغيير الموقع
    const locationInput = document.getElementById('location-input');
    if (locationInput) {
        locationInput.addEventListener('change', updateOptimalTiltAndAzimuth);
    }
    
    // مستمع حدث لتغيير حجم السطح
    const roofSizeInput = document.getElementById('roof-size');
    if (roofSizeInput) {
        roofSizeInput.addEventListener('change', updateRecommendedSystemCapacity);
    }
    
    // مستمع حدث لزر القيم المثالية
    const optimalValuesButton = document.getElementById('optimal-values-button');
    if (optimalValuesButton) {
        optimalValuesButton.addEventListener('click', setOptimalValues);
    }
    
    // مستمع حدث لتغيير العملة
    const currencySelector = document.getElementById('currency-selector');
    if (currencySelector) {
        currencySelector.addEventListener('change', function() {
            userPreferences.currency = this.value;
            if (calculationResults) {
                displayResults(calculationResults);
            }
        });
    }
}

// تحديث القيم المثالية للميل والتوجيه
function updateOptimalTiltAndAzimuth() {
    // الحصول على الموقع الحالي
    const lat = window.currentLocation ? window.currentLocation.lat : 24.7136;
    const lng = window.currentLocation ? window.currentLocation.lng : 46.6753;
    
    // حساب القيم المثالية
    const optimalValues = optimizeTiltAndAzimuth(lat);
    
    // عرض القيم المثالية
    document.getElementById('optimal-tilt').textContent = optimalValues.tilt;
    document.getElementById('optimal-azimuth').textContent = optimalValues.azimuth;
}

// تعيين القيم المثالية
function setOptimalValues() {
    const optimalTilt = document.getElementById('optimal-tilt').textContent;
    const optimalAzimuth = document.getElementById('optimal-azimuth').textContent;
    
    document.getElementById('panel-tilt').value = optimalTilt;
    document.getElementById('panel-azimuth').value = optimalAzimuth;
    
    // إعادة حساب النتائج
    calculateSolarResults();
}

// تحديث قدرة النظام الموصى بها بناءً على حجم السطح
function updateRecommendedSystemCapacity() {
    const roofSize = parseFloat(document.getElementById('roof-size').value);
    
    if (!isNaN(roofSize) && roofSize > 0) {
        // حساب قدرة النظام الموصى بها
        const recommendedCapacity = calculateSystemCapacity(roofSize);
        
        // تحديث حقل قدرة النظام
        document.getElementById('system-capacity').value = recommendedCapacity.toFixed(1);
    }
}

// حساب نتائج الطاقة الشمسية
async function calculateSolarResults() {
    try {
        // إظهار مؤشر التحميل
        document.getElementById('loading-indicator').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';
        
        // الحصول على قيم المدخلات
        const systemCapacity = parseFloat(document.getElementById('system-capacity').value);
        const roofSize = parseFloat(document.getElementById('roof-size').value);
        const panelTilt = parseFloat(document.getElementById('panel-tilt').value);
        const panelAzimuth = parseFloat(document.getElementById('panel-azimuth').value);
        const electricityConsumption = parseFloat(document.getElementById('electricity-consumption').value);
        const electricityPrice = parseFloat(document.getElementById('electricity-price').value);
        
        // التحقق من صحة المدخلات
        if (isNaN(systemCapacity) || isNaN(roofSize) || isNaN(panelTilt) || 
            isNaN(panelAzimuth) || isNaN(electricityConsumption) || isNaN(electricityPrice)) {
            throw new Error('يرجى إدخال قيم صحيحة لجميع الحقول');
        }
        
        // الحصول على الموقع الحالي
        const lat = window.currentLocation ? window.currentLocation.lat : 24.7136;
        const lng = window.currentLocation ? window.currentLocation.lng : 46.6753;
        
        // حساب إنتاج الطاقة الشمسية
        const solarProduction = await calculateSolarProduction({
            systemCapacity: systemCapacity,
            tilt: panelTilt,
            azimuth: panelAzimuth,
            latitude: lat,
            longitude: lng,
            losses: 14, // قيمة افتراضية
            arrayType: 0 // ثابتة (قيمة افتراضية)
        });
        
        // الحصول على أسعار الكهرباء
        // في التطبيق الحقيقي، سنستخدم رمز البلد والمنطقة الفعليين
        const countryCode = 'SA'; // افتراضي: المملكة العربية السعودية
        const stateCode = 'default';
        const electricityPrices = await getElectricityPrices(countryCode, stateCode);
        
        // استخدام السعر المدخل إذا لم تتوفر بيانات من API
        const actualElectricityPrice = electricityPrices ? 
            electricityPrices.residentialPrice : electricityPrice;
        
        // حساب التوفير المالي مع مراعاة الزيادة المتوقعة في أسعار الكهرباء
        const financialSavings = calculateFinancialSavingsWithPriceIncrease(
            solarProduction.annualProduction,
            actualElectricityPrice
        );
        
        // حساب الفوائد البيئية
        const environmentalBenefits = calculateEnvironmentalBenefits(
            solarProduction.annualProduction
        );
        
        // حساب تفاصيل الاستثمار
        const investmentDetails = calculateInvestmentDetails(
            systemCapacity,
            financialSavings.annual
        );
        
        // حساب نسبة تغطية الاستهلاك
        const annualConsumption = electricityConsumption * 12; // الاستهلاك السنوي
        const coveragePercentage = (solarProduction.annualProduction / annualConsumption) * 100;
        
        // تخزين النتائج
        calculationResults = {
            solarProduction: solarProduction,
            financialSavings: financialSavings,
            environmentalBenefits: environmentalBenefits,
            investmentDetails: investmentDetails,
            coveragePercentage: coveragePercentage,
            electricityPrice: actualElectricityPrice,
            currency: electricityPrices ? electricityPrices.currency : userPreferences.currency
        };
        
        // عرض النتائج
        displayResults(calculationResults);
        
        // تحديث الرسوم البيانية
        updateCharts(calculationResults);
        
        // إخفاء مؤشر التحميل وإظهار النتائج
        document.getElementById('loading-indicator').style.display = 'none';
        document.getElementById('results-section').style.display = 'block';
        
        // التمرير إلى قسم النتائج
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('خطأ في حساب نتائج الطاقة الشمسية:', error);
        
        // إخفاء مؤشر التحميل
        document.getElementById('loading-indicator').style.display = 'none';
        
        // عرض رسالة الخطأ
        alert(`حدث خطأ أثناء الحساب: ${error.message}`);
    }
}

// عرض النتائج
function displayResults(results) {
    // عرض إنتاج الطاقة
    document.getElementById('annual-production').textContent = 
        `${results.solarProduction.annualProduction.toLocaleString()} كيلوواط ساعة/سنة`;
    
    // عرض التوفير المالي
    const currency = results.currency || userPreferences.currency;
    document.getElementById('monthly-savings').textContent = 
        `${results.financialSavings.monthly.toLocaleString()} ${currency}/شهر`;
    document.getElementById('annual-savings').textContent = 
        `${results.financialSavings.annual.toLocaleString()} ${currency}/سنة`;
    document.getElementById('lifetime-savings').textContent = 
        `${results.financialSavings.lifetime.toLocaleString()} ${currency}`;
    
    // عرض الفوائد البيئية
    document.getElementById('co2-reduction').textContent = 
        `${results.environmentalBenefits.co2Reduction.toLocaleString()} كجم/سنة`;
    document.getElementById('trees-equivalent').textContent = 
        `${results.environmentalBenefits.treesEquivalent.toLocaleString()} شجرة`;
    
    // عرض تفاصيل الاستثمار
    document.getElementById('estimated-cost').textContent = 
        `${results.investmentDetails.estimatedCost.toLocaleString()} ${currency}`;
    document.getElementById('payback-period').textContent = 
        `${results.investmentDetails.paybackPeriod.toLocaleString()} سنة`;
    document.getElementById('roi').textContent = 
        `${results.investmentDetails.roi.toLocaleString()}%`;
    
    // عرض نسبة تغطية الاستهلاك
    document.getElementById('coverage-percentage').textContent = 
        `${Math.min(100, results.coveragePercentage.toFixed(1))}%`;
    
    // تحديث شريط التقدم لنسبة التغطية
    const coverageProgressBar = document.getElementById('coverage-progress');
    if (coverageProgressBar) {
        coverageProgressBar.style.width = `${Math.min(100, results.coveragePercentage)}%`;
        
        // تغيير لون شريط التقدم بناءً على نسبة التغطية
        if (results.coveragePercentage >= 90) {
            coverageProgressBar.className = 'progress-bar bg-success';
        } else if (results.coveragePercentage >= 50) {
            coverageProgressBar.className = 'progress-bar bg-info';
        } else {
            coverageProgressBar.className = 'progress-bar bg-warning';
        }
    }
}

// تهيئة الرسوم البيانية
function initializeCharts() {
    // سيتم تنفيذ هذه الدالة عند تحميل مكتبة الرسوم البيانية
    console.log('تهيئة الرسوم البيانية...');
}

// تحديث الرسوم البيانية
function updateCharts(results) {
    // تحديث مخطط الإنتاج الشهري
    updateMonthlyProductionChart(results.solarProduction.monthlyProduction);
    
    // تحديث مخطط التوفير المالي
    if (results.financialSavings.yearlyBreakdown) {
        updateFinancialSavingsChart(results.financialSavings.yearlyBreakdown);
    }
}

// تحديث مخطط الإنتاج الشهري
function updateMonthlyProductionChart(monthlyProduction) {
    // هذه الدالة ستستخدم مكتبة رسوم بيانية مثل Chart.js
    // في هذا المثال، سنفترض أن المكتبة محملة ومتاحة
    
    const ctx = document.getElementById('monthly-production-chart');
    if (!ctx) return;
    
    // أسماء الأشهر بالعربية
    const monthNames = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    // إنشاء المخطط إذا لم يكن موجوداً، أو تحديثه إذا كان موجوداً
    if (window.monthlyProductionChart) {
        window.monthlyProductionChart.data.datasets[0].data = monthlyProduction;
        window.monthlyProductionChart.update();
    } else if (typeof Chart !== 'undefined') {
        window.monthlyProductionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthNames,
                datasets: [{
                    label: 'الإنتاج الشهري (كيلوواط ساعة)',
                    data: monthlyProduction,
                    backgroundColor: 'rgba(46, 125, 50, 0.7)',
                    borderColor: 'rgba(46, 125, 50, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'كيلوواط ساعة'
                        }
                    }
                }
            }
        });
    }
}

// تحديث مخطط التوفير المالي
function updateFinancialSavingsChart(yearlyBreakdown) {
    // هذه الدالة ستستخدم مكتبة رسوم بيانية مثل Chart.js
    
    const ctx = document.getElementById('financial-savings-chart');
    if (!ctx) return;
    
    // استخراج البيانات
    const years = yearlyBreakdown.map(item => item.year);
    const savings = yearlyBreakdown.map(item => item.savings);
    
    // إنشاء المخطط إذا لم يكن موجوداً، أو تحديثه إذا كان موجوداً
    if (window.financialSavingsChart) {
        window.financialSavingsChart.data.labels = years;
        window.financialSavingsChart.data.datasets[0].data = savings;
        window.financialSavingsChart.update();
    } else if (typeof Chart !== 'undefined') {
        window.financialSavingsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'التوفير السنوي',
                    data: savings,
                    backgroundColor: 'rgba(25, 118, 210, 0.2)',
                    borderColor: 'rgba(25, 118, 210, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: calculationResults.currency || userPreferences.currency
                        }
                    }
                }
            }
        });
    }
}

// تهيئة اختيار اللغة
function initializeLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            userPreferences.language = this.value;
            translateUI(this.value);
        });
    }
}

// ترجمة واجهة المستخدم
function translateUI(language) {
    // هذه الدالة ستستخدم واجهة برمجة الترجمة التي تم تنفيذها سابقاً
    console.log(`ترجمة واجهة المستخدم إلى اللغة: ${language}`);
    
    // في التطبيق الحقيقي، سنستدعي دالة الترجمة من ملف translation-api.js
    if (typeof translatePage === 'function') {
        translatePage(language);
    }
}

// تهيئة اختيار العملة
function initializeCurrencySelector() {
    const currencySelector = document.getElementById('currency-selector');
    if (currencySelector) {
        // إضافة خيارات العملات
        const currencies = [
            { code: 'USD', name: 'دولار أمريكي' },
            { code: 'SAR', name: 'ريال سعودي' },
            { code: 'AED', name: 'درهم إماراتي' },
            { code: 'EGP', name: 'جنيه مصري' },
            { code: 'EUR', name: 'يورو' },
            { code: 'GBP', name: 'جنيه إسترليني' }
        ];
        
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.code;
            option.textContent = `${currency.name} (${currency.code})`;
            currencySelector.appendChild(option);
        });
        
        // تعيين العملة الافتراضية
        currencySelector.value = userPreferences.currency;
    }
}

// تصدير الدوال للاستخدام في ملفات أخرى
window.calculateSolarResults = calculateSolarResults;
window.updateOptimalTiltAndAzimuth = updateOptimalTiltAndAzimuth;
window.setOptimalValues = setOptimalValues;
