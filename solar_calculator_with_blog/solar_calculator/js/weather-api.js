/**
 * weather-api.js - تكامل Weather API مع حاسبة الطاقة الشمسية
 */

// متغيرات عامة
const WEATHER_API_KEY = "YOUR_WEATHER_API_KEY"; // يجب استبداله بمفتاح API الخاص بك
const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5";

// بيانات الطقس الحالية
let currentWeatherData = null;

// الحصول على بيانات الطقس للموقع المحدد
async function getWeatherData(lat, lng) {
    try {
        // الحصول على بيانات الطقس الحالية
        const currentWeather = await fetchCurrentWeather(lat, lng);
        
        // الحصول على بيانات الإشعاع الشمسي
        const solarRadiation = await fetchSolarRadiation(lat, lng);
        
        // تحديث واجهة المستخدم ببيانات الطقس
        updateWeatherDisplay(currentWeather);
        
        // تحديث واجهة المستخدم ببيانات الإشعاع الشمسي
        updateSolarRadiationDisplay(solarRadiation);
        
        // تخزين البيانات للاستخدام في الحسابات
        currentWeatherData = {
            ...currentWeather,
            solarRadiation
        };
        
        return currentWeatherData;
    } catch (error) {
        console.error("خطأ في الحصول على بيانات الطقس:", error);
        updateWeatherDisplay(null);
        updateSolarRadiationDisplay(null);
        return null;
    }
}

// الحصول على بيانات الطقس الحالية من API
async function fetchCurrentWeather(lat, lng) {
    const url = `${WEATHER_API_BASE_URL}/weather?lat=${lat}&lon=${lng}&units=metric&appid=${WEATHER_API_KEY}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`فشل في الحصول على بيانات الطقس: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            temperature: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            cloudCover: data.clouds.all,
            weatherDescription: data.weather[0].description,
            weatherIcon: data.weather[0].icon,
            sunrise: data.sys.sunrise * 1000, // تحويل إلى ميلي ثانية
            sunset: data.sys.sunset * 1000, // تحويل إلى ميلي ثانية
            location: data.name,
            country: data.sys.country
        };
    } catch (error) {
        console.error("خطأ في جلب بيانات الطقس:", error);
        throw error;
    }
}

// الحصول على بيانات الإشعاع الشمسي
async function fetchSolarRadiation(lat, lng) {
    // ملاحظة: OpenWeatherMap لا توفر بيانات الإشعاع الشمسي مباشرة في الواجهة المجانية
    // سنستخدم بيانات تقريبية بناءً على الموقع والغطاء السحابي
    // في التطبيق الحقيقي، يمكن استخدام واجهة برمجة متخصصة مثل NREL أو Solcast
    
    try {
        // الحصول على بيانات الطقس للحصول على الغطاء السحابي
        const url = `${WEATHER_API_BASE_URL}/weather?lat=${lat}&lon=${lng}&units=metric&appid=${WEATHER_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`فشل في الحصول على بيانات الطقس: ${response.status}`);
        }
        
        const data = await response.json();
        const cloudCover = data.clouds.all; // نسبة الغطاء السحابي (0-100)
        
        // حساب الإشعاع الشمسي التقريبي بناءً على خط العرض والغطاء السحابي
        // هذه صيغة تقريبية جداً وليست دقيقة علمياً
        // في التطبيق الحقيقي، يجب استخدام نماذج أكثر تعقيداً
        
        // الإشعاع الشمسي الأقصى يعتمد على خط العرض
        // القيم النموذجية تتراوح بين 3-7 كيلوواط ساعة/م²/يوم
        const absLat = Math.abs(lat);
        let maxSolarRadiation;
        
        if (absLat < 20) {
            // المناطق الاستوائية
            maxSolarRadiation = 6.5;
        } else if (absLat < 35) {
            // المناطق شبه الاستوائية
            maxSolarRadiation = 5.5;
        } else if (absLat < 50) {
            // المناطق المعتدلة
            maxSolarRadiation = 4.5;
        } else {
            // المناطق القطبية
            maxSolarRadiation = 3.5;
        }
        
        // تعديل الإشعاع بناءً على الغطاء السحابي
        // 0% غطاء سحابي = 100% من الإشعاع الأقصى
        // 100% غطاء سحابي = 20% من الإشعاع الأقصى
        const cloudFactor = 1 - (cloudCover * 0.8 / 100);
        const currentSolarRadiation = maxSolarRadiation * cloudFactor;
        
        return {
            dailyAverage: currentSolarRadiation.toFixed(2), // كيلوواط ساعة/م²/يوم
            monthlyAverage: (currentSolarRadiation * 30).toFixed(2), // كيلوواط ساعة/م²/شهر
            cloudCover: cloudCover,
            maxSolarRadiation: maxSolarRadiation.toFixed(2)
        };
    } catch (error) {
        console.error("خطأ في حساب الإشعاع الشمسي:", error);
        throw error;
    }
}

// تحديث عرض بيانات الطقس في الواجهة
function updateWeatherDisplay(weatherData) {
    const weatherDisplay = document.getElementById("weather-display");
    
    if (!weatherData) {
        weatherDisplay.textContent = "بيانات الطقس غير متاحة";
        return;
    }
    
    const { temperature, weatherDescription, cloudCover } = weatherData;
    weatherDisplay.innerHTML = `${temperature.toFixed(1)}°C، ${weatherDescription}، غيوم: ${cloudCover}%`;
}

// تحديث عرض بيانات الإشعاع الشمسي في الواجهة
function updateSolarRadiationDisplay(solarData) {
    const solarRadiationDisplay = document.getElementById("solar-radiation-display");
    
    if (!solarData) {
        solarRadiationDisplay.textContent = "بيانات الإشعاع الشمسي غير متاحة";
        return;
    }
    
    const { dailyAverage } = solarData;
    solarRadiationDisplay.textContent = `الإشعاع الشمسي: ${dailyAverage} كيلوواط ساعة/م²/يوم`;
}

// الحصول على بيانات الطقس التاريخية للموقع
async function getHistoricalWeatherData(lat, lng, startDate, endDate) {
    // ملاحظة: الحصول على البيانات التاريخية يتطلب اشتراكاً مدفوعاً في معظم واجهات برمجة الطقس
    // هذه دالة وهمية تعيد بيانات تقريبية
    
    // في التطبيق الحقيقي، يمكن استخدام واجهة برمجة مثل:
    // - OpenWeatherMap One Call API
    // - Visual Crossing Weather API
    // - World Weather Online Historical Weather API
    
    console.log(`طلب بيانات الطقس التاريخية للموقع (${lat}, ${lng}) من ${startDate} إلى ${endDate}`);
    
    // إنشاء بيانات وهمية للأغراض التوضيحية
    const months = 12;
    const historicalData = [];
    
    for (let i = 0; i < months; i++) {
        // حساب الإشعاع الشمسي التقريبي لكل شهر
        // هذه قيم تقريبية تعتمد على خط العرض والشهر
        const absLat = Math.abs(lat);
        let monthFactor;
        
        // في نصف الكرة الشمالي، يكون الإشعاع أعلى في الصيف (يونيو-أغسطس)
        // في نصف الكرة الجنوبي، يكون الإشعاع أعلى في الصيف (ديسمبر-فبراير)
        if (lat >= 0) {
            // نصف الكرة الشمالي
            monthFactor = 1 - 0.5 * Math.cos((i - 5) * Math.PI / 6);
        } else {
            // نصف الكرة الجنوبي
            monthFactor = 1 - 0.5 * Math.cos((i + 1) * Math.PI / 6);
        }
        
        // تعديل الإشعاع بناءً على خط العرض
        let baseRadiation;
        if (absLat < 20) {
            baseRadiation = 6.0 + (Math.random() * 1.0);
        } else if (absLat < 35) {
            baseRadiation = 5.0 + (Math.random() * 1.0);
        } else if (absLat < 50) {
            baseRadiation = 4.0 + (Math.random() * 1.0);
        } else {
            baseRadiation = 2.5 + (Math.random() * 1.0);
        }
        
        const solarRadiation = baseRadiation * monthFactor;
        
        // إضافة بعض التغيير العشوائي للتمثيل الواقعي
        const randomVariation = 0.8 + (Math.random() * 0.4); // 0.8-1.2
        
        historicalData.push({
            month: i,
            solarRadiation: (solarRadiation * randomVariation).toFixed(2),
            temperature: (20 * monthFactor + 5 + (Math.random() * 5)).toFixed(1),
            cloudCover: Math.floor(30 + Math.random() * 40)
        });
    }
    
    return historicalData;
}

// تصدير الدوال للاستخدام في ملفات أخرى
window.getWeatherData = getWeatherData;
window.fetchSolarRadiation = fetchSolarRadiation;
window.getHistoricalWeatherData = getHistoricalWeatherData;
window.currentWeatherData = currentWeatherData;
