/**
 * ملف JavaScript للترجمة التلقائية
 * يوفر وظائف الترجمة التلقائية للمحتوى وواجهة المستخدم
 */

// الإعدادات الافتراضية
const DEFAULT_LANGUAGE = 'ar';
const SUPPORTED_LANGUAGES = ['ar', 'en', 'fr', 'es', 'de', 'it', 'ru', 'zh', 'ja', 'ko'];

// عناصر واجهة المستخدم للترجمة
class TranslationUI {
  constructor() {
    this.currentLanguage = localStorage.getItem('userLanguage') || this.getBrowserLanguage();
    this.autoDetect = localStorage.getItem('autoDetectLanguage') === 'true';
    this.translationCache = {};
    
    // تهيئة واجهة المستخدم عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', () => this.initUI());
  }
  
  /**
   * الحصول على لغة المتصفح
   * @returns {string} رمز اللغة
   */
  getBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0];
    
    return SUPPORTED_LANGUAGES.includes(langCode) ? langCode : DEFAULT_LANGUAGE;
  }
  
  /**
   * تهيئة واجهة المستخدم للترجمة
   */
  initUI() {
    // إضافة محدد اللغة إلى شريط التنقل
    this.addLanguageSelectorToNavbar();
    
    // ترجمة عناصر واجهة المستخدم الثابتة
    this.translateStaticUI();
    
    // إضافة مستمعي الأحداث
    this.setupEventListeners();
  }
  
  /**
   * إضافة محدد اللغة إلى شريط التنقل
   */
  addLanguageSelectorToNavbar() {
    const navbar = document.querySelector('.navbar-nav');
    if (!navbar) return;
    
    // إنشاء عنصر القائمة المنسدلة
    const dropdownItem = document.createElement('li');
    dropdownItem.className = 'nav-item dropdown';
    dropdownItem.innerHTML = `
      <a class="nav-link dropdown-toggle" href="#" id="languageDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-globe"></i> <span class="language-name">${this.getLanguageName(this.currentLanguage)}</span>
      </a>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
        ${SUPPORTED_LANGUAGES.map(lang => `
          <li><a class="dropdown-item ${lang === this.currentLanguage ? 'active' : ''}" href="#" data-language="${lang}">
            ${this.getLanguageName(lang)}
          </a></li>
        `).join('')}
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="/language">إعدادات اللغة</a></li>
      </ul>
    `;
    
    navbar.appendChild(dropdownItem);
  }
  
  /**
   * الحصول على اسم اللغة من رمزها
   * @param {string} langCode رمز اللغة
   * @returns {string} اسم اللغة
   */
  getLanguageName(langCode) {
    const languageNames = {
      'ar': 'العربية',
      'en': 'English',
      'fr': 'Français',
      'es': 'Español',
      'de': 'Deutsch',
      'it': 'Italiano',
      'ru': 'Русский',
      'zh': '中文',
      'ja': '日本語',
      'ko': '한국어'
    };
    
    return languageNames[langCode] || langCode;
  }
  
  /**
   * ترجمة عناصر واجهة المستخدم الثابتة
   */
  translateStaticUI() {
    // لا نحتاج لترجمة إذا كانت اللغة الحالية هي الافتراضية
    if (this.currentLanguage === DEFAULT_LANGUAGE) return;
    
    // العناصر التي تحتاج إلى ترجمة
    const translatableElements = document.querySelectorAll('[data-translate]');
    
    translatableElements.forEach(element => {
      const key = element.getAttribute('data-translate');
      const originalText = element.textContent;
      
      // استخدام النص المخزن مؤقتًا إذا كان متاحًا
      if (this.translationCache[originalText]) {
        element.textContent = this.translationCache[originalText];
        return;
      }
      
      // ترجمة النص
      this.translateText(originalText, this.currentLanguage)
        .then(translatedText => {
          element.textContent = translatedText;
          this.translationCache[originalText] = translatedText;
        })
        .catch(error => {
          console.error('خطأ في الترجمة:', error);
        });
    });
  }
  
  /**
   * إعداد مستمعي الأحداث
   */
  setupEventListeners() {
    // مستمعي أحداث لعناصر القائمة المنسدلة للغة
    const languageItems = document.querySelectorAll('[data-language]');
    languageItems.forEach(item => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        const language = item.getAttribute('data-language');
        this.changeLanguage(language);
      });
    });
  }
  
  /**
   * تغيير اللغة الحالية
   * @param {string} language رمز اللغة الجديدة
   */
  changeLanguage(language) {
    if (!SUPPORTED_LANGUAGES.includes(language)) return;
    
    // تحديث اللغة الحالية
    this.currentLanguage = language;
    localStorage.setItem('userLanguage', language);
    localStorage.setItem('autoDetectLanguage', 'false');
    
    // إرسال طلب لتعيين اللغة في الجلسة
    fetch('/api/set_language', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ language })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // إعادة تحميل الصفحة لتطبيق اللغة الجديدة
        window.location.reload();
      }
    })
    .catch(error => {
      console.error('خطأ في تغيير اللغة:', error);
    });
  }
  
  /**
   * ترجمة نص باستخدام واجهة برمجة الترجمة
   * @param {string} text النص المراد ترجمته
   * @param {string} targetLanguage اللغة الهدف
   * @returns {Promise<string>} وعد بالنص المترجم
   */
  translateText(text, targetLanguage) {
    // لا نحتاج لترجمة إذا كانت اللغة الهدف هي الافتراضية
    if (targetLanguage === DEFAULT_LANGUAGE) {
      return Promise.resolve(text);
    }
    
    // استخدام النص المخزن مؤقتًا إذا كان متاحًا
    if (this.translationCache[text]) {
      return Promise.resolve(this.translationCache[text]);
    }
    
    // إرسال طلب الترجمة
    return fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        target_language: targetLanguage,
        source_language: DEFAULT_LANGUAGE
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // تخزين الترجمة مؤقتًا
        this.translationCache[text] = data.translated_text;
        return data.translated_text;
      }
      return text;
    })
    .catch(error => {
      console.error('خطأ في الترجمة:', error);
      return text;
    });
  }
  
  /**
   * ترجمة محتوى ديناميكي
   * @param {string} selector محدد CSS للعنصر
   * @param {string} content المحتوى الجديد
   */
  translateDynamicContent(selector, content) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    // لا نحتاج لترجمة إذا كانت اللغة الحالية هي الافتراضية
    if (this.currentLanguage === DEFAULT_LANGUAGE) {
      element.innerHTML = content;
      return;
    }
    
    // ترجمة المحتوى
    this.translateText(content, this.currentLanguage)
      .then(translatedContent => {
        element.innerHTML = translatedContent;
      })
      .catch(error => {
        console.error('خطأ في ترجمة المحتوى الديناميكي:', error);
        element.innerHTML = content;
      });
  }
}

// إنشاء كائن الترجمة عند تحميل الصفحة
const translationUI = new TranslationUI();

// تصدير الكائن للاستخدام في ملفات JavaScript أخرى
window.translationUI = translationUI;
