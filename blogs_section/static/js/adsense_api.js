/**
 * واجهة برمجة تطبيقات AdSense (محاكاة)
 * توفر هذه الوحدة وظائف لإدارة الإعلانات باستخدام بيانات ثابتة.
 */

class AdSenseAPI {
  constructor() {
    // بيانات ثابتة لمحاكاة الإعلانات
    this.ads = [
      {
        id: 'ad1',
        type: 'responsive',
        content: '<div class="ad">إعلان متجاوب</div>'
      },
      {
        id: 'ad2',
        type: 'in-article',
        content: '<div class="ad">إعلان داخل المقال</div>'
      }
    ];
  }

  // الحصول على قائمة الإعلانات
  async listAds() {
    return this.ads;
  }

  // إنشاء كود إعلان متجاوب
  createResponsiveAdCode(adId) {
    const ad = this.ads.find(ad => ad.id === adId);
    return ad ? ad.content : '<div class="ad">إعلان غير متوفر</div>';
  }

  // إنشاء كود إعلان داخل المقال
  createInArticleAdCode(adId) {
    const ad = this.ads.find(ad => ad.id === adId);
    return ad ? ad.content : '<div class="ad">إعلان غير متوفر</div>';
  }
}

// تصدير الفئة للاستخدام في ملفات أخرى
export default AdSenseAPI;
