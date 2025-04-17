/**
 * maps-api.js - تكامل Google Maps API مع حاسبة الطاقة الشمسية
 */

// متغيرات عامة
let map;
let marker;
let geocoder;
let autocomplete;
let currentLocation = {
    lat: 24.7136, // الإحداثيات الافتراضية (الرياض، المملكة العربية السعودية)
    lng: 46.6753
};

// تهيئة الخريطة
function initMap() {
    // إنشاء كائن الخريطة
    map = new google.maps.Map(document.getElementById("map"), {
        center: currentLocation,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        fullscreenControl: true
    });

    // إنشاء كائن العلامة
    marker = new google.maps.Marker({
        position: currentLocation,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: "موقعك"
    });

    // إنشاء كائن محول العناوين
    geocoder = new google.maps.Geocoder();

    // إضافة مستمع حدث للنقر على الخريطة
    map.addListener("click", (event) => {
        placeMarker(event.latLng);
    });

    // إضافة مستمع حدث لسحب العلامة
    marker.addListener("dragend", () => {
        const position = marker.getPosition();
        updateLocationInfo(position.lat(), position.lng());
    });

    // إعداد الإكمال التلقائي للعناوين
    setupAutocomplete();

    // محاولة الحصول على موقع المستخدم الحالي
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                placeMarker(pos);
                updateLocationInfo(pos.lat, pos.lng);
            },
            () => {
                // في حالة رفض المستخدم مشاركة موقعه
                console.log("تم رفض الوصول إلى الموقع أو حدث خطأ.");
                updateLocationDisplay("لم يتم تحديد الموقع");
            }
        );
    } else {
        // المتصفح لا يدعم تحديد الموقع
        console.log("المتصفح لا يدعم تحديد الموقع.");
        updateLocationDisplay("المتصفح لا يدعم تحديد الموقع");
    }
}

// إعداد الإكمال التلقائي للعناوين
function setupAutocomplete() {
    const input = document.getElementById("location-input");
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields(["address_components", "geometry", "name"]);
    
    // إضافة مستمع حدث لاختيار مكان
    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry) {
            // لم يتم العثور على المكان
            console.log("لم يتم العثور على تفاصيل لهذا المكان.");
            return;
        }
        
        // تحريك الخريطة إلى المكان المحدد
        map.setCenter(place.geometry.location);
        map.setZoom(15);
        
        // وضع العلامة على المكان المحدد
        placeMarker(place.geometry.location);
    });
}

// وضع العلامة على الخريطة
function placeMarker(location) {
    marker.setPosition(location);
    map.panTo(location);
    updateLocationInfo(location.lat(), location.lng());
}

// تحديث معلومات الموقع
function updateLocationInfo(lat, lng) {
    currentLocation.lat = lat;
    currentLocation.lng = lng;
    
    // تحديث حقل الإدخال بالعنوان
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
            document.getElementById("location-input").value = results[0].formatted_address;
            updateLocationDisplay(results[0].formatted_address);
        } else {
            document.getElementById("location-input").value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            updateLocationDisplay(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
    });
    
    // الحصول على بيانات الإشعاع الشمسي للموقع
    getSolarRadiationData(lat, lng);
    
    // تحديث بيانات الطقس للموقع
    getWeatherData(lat, lng);
    
    // تحفيز إعادة حساب النتائج
    triggerCalculation();
}

// تحديث عرض الموقع في الواجهة
function updateLocationDisplay(locationText) {
    document.getElementById("location-display").textContent = locationText;
}

// الحصول على بيانات الإشعاع الشمسي
function getSolarRadiationData(lat, lng) {
    // هذه الدالة ستستدعي واجهة برمجة خارجية للحصول على بيانات الإشعاع الشمسي
    // سيتم تنفيذها في ملف pvwatts-api.js
    if (typeof fetchSolarRadiation === 'function') {
        fetchSolarRadiation(lat, lng);
    } else {
        console.log("لم يتم تحميل وحدة بيانات الإشعاع الشمسي بعد.");
    }
}

// تحفيز إعادة حساب النتائج
function triggerCalculation() {
    // هذه الدالة ستحفز إعادة حساب النتائج بناءً على الموقع الجديد
    if (typeof calculateSolarResults === 'function') {
        calculateSolarResults();
    } else {
        console.log("لم يتم تحميل وحدة الحساب بعد.");
    }
}

// مستمع حدث لزر تحديد الموقع
document.addEventListener("DOMContentLoaded", () => {
    const detectLocationButton = document.getElementById("detect-location");
    if (detectLocationButton) {
        detectLocationButton.addEventListener("click", () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        placeMarker(new google.maps.LatLng(pos.lat, pos.lng));
                    },
                    () => {
                        alert("فشل في تحديد موقعك. يرجى السماح بالوصول إلى الموقع أو إدخال العنوان يدوياً.");
                    }
                );
            } else {
                alert("المتصفح لا يدعم تحديد الموقع.");
            }
        });
    }
});

// تصدير الدوال والمتغيرات للاستخدام في ملفات أخرى
window.initMap = initMap;
window.currentLocation = currentLocation;
window.updateLocationInfo = updateLocationInfo;
