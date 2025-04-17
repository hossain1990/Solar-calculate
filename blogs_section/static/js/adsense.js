// إضافة أكواد AdSense إلى صفحات المدونة
function injectAdsenseCode() {
  // الحصول على معرف عميل AdSense من التكوين
  const adClientId = 'ca-pub-XXXXXXXXXXXXXXXX'; // سيتم استبداله بالقيمة الفعلية من التكوين
  
  // إنشاء كود الإعلانات التلقائية
  const autoAdsCode = `
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    <script>
      (adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: "${adClientId}",
        enable_page_level_ads: true
      });
    </script>
  `;
  
  // إضافة كود الإعلانات التلقائية إلى رأس الصفحة
  document.head.insertAdjacentHTML('beforeend', autoAdsCode);
  
  // إضافة إعلانات متجاوبة إلى مساحات الإعلانات المحددة
  const adPlaceholders = document.querySelectorAll('.adsense-placeholder');
  
  if (adPlaceholders.length > 0) {
    adPlaceholders.forEach((placeholder, index) => {
      // إنشاء كود إعلان متجاوب
      const responsiveAdCode = `
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${adClientId}"
             data-ad-slot="SLOT_ID_${index}" <!-- سيتم استبداله بالقيمة الفعلية من التكوين -->
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      `;
      
      // استبدال المساحة المحددة بكود الإعلان
      placeholder.innerHTML = responsiveAdCode;
    });
  }
  
  // إضافة إعلان داخل المقال بعد الفقرة الثالثة في محتوى المدونة
  const blogContent = document.querySelector('.blog-content');
  
  if (blogContent) {
    const paragraphs = blogContent.querySelectorAll('p');
    
    if (paragraphs.length >= 3) {
      // إنشاء كود إعلان داخل المقال
      const inArticleAdCode = `
        <div class="ad-container my-4">
          <ins class="adsbygoogle"
               style="display:block; text-align:center;"
               data-ad-layout="in-article"
               data-ad-format="fluid"
               data-ad-client="${adClientId}"
               data-ad-slot="IN_ARTICLE_SLOT_ID"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
      `;
      
      // إضافة الإعلان بعد الفقرة الثالثة
      paragraphs[2].insertAdjacentHTML('afterend', inArticleAdCode);
    }
  }
}

// تنفيذ الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  // تحقق مما إذا كانت الصفحة تحتوي على محتوى المدونة
  if (document.querySelector('.blog-post') || document.querySelector('.blog-content')) {
    injectAdsenseCode();
  }
});
