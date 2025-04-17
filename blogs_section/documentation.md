# توثيق قسم المدونات مع واجهات برمجة التطبيقات

## نظرة عامة

يوفر هذا المستند توثيقًا شاملاً لقسم المدونات في موقع حاسبة الطاقة الشمسية. تم تطوير هذا القسم باستخدام JavaScript وواجهات برمجة تطبيقات Google المختلفة لتوفير تجربة مدونة متكاملة مع إمكانيات متقدمة مثل الترجمة التلقائية وتحليلات الموقع وتحقيق الدخل من الإعلانات.

## هيكل المشروع

```
blogs_section/
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── blogger_api.js
│   │   ├── adsense_api.js
│   │   ├── analytics_api.js
│   │   ├── search_console_api.js
│   │   ├── translation_api.js
│   │   ├── translation.js
│   │   └── main.js
│   └── images/
├── templates/
│   ├── blog/
│   │   ├── index.html
│   │   └── post.html
│   ├── admin/
│   │   ├── blog_dashboard.html
│   │   ├── adsense.html
│   │   └── earnings.html
│   ├── translation/
│   │   └── language_selector.html
│   └── base.html
└── app.js
```

## واجهات برمجة التطبيقات المستخدمة

### 1. Blogger API

ملف: `static/js/blogger_api.js`

توفر واجهة برمجة تطبيقات Blogger وظائف للتفاعل مع مدونات Google Blogger. تتيح هذه الواجهة إدارة المنشورات والتعليقات والبحث في المحتوى.

#### الاستخدام الأساسي:

```javascript
// إنشاء كائن جديد من واجهة برمجة تطبيقات Blogger
const bloggerApi = new BloggerAPI({
  apiKey: 'YOUR_API_KEY',
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'YOUR_REDIRECT_URI',
  blogId: 'YOUR_BLOG_ID'
});

// المصادقة مع Blogger API
await bloggerApi.authenticate();

// الحصول على قائمة المنشورات
const posts = await bloggerApi.listPosts();

// إنشاء منشور جديد
const newPost = await bloggerApi.createPost(null, 'عنوان المنشور', 'محتوى المنشور');

// تحديث منشور موجود
await bloggerApi.updatePost(null, postId, { title: 'عنوان جديد', content: 'محتوى جديد' });

// حذف منشور
await bloggerApi.deletePost(null, postId);

// البحث في المنشورات
const searchResults = await bloggerApi.searchPosts(null, 'كلمة البحث');
```

### 2. AdSense API

ملف: `static/js/adsense_api.js`

توفر واجهة برمجة تطبيقات AdSense وظائف للتفاعل مع حسابات Google AdSense. تتيح هذه الواجهة إدارة وحدات الإعلانات وعرض تقارير الأرباح وإنشاء أكواد الإعلانات.

#### الاستخدام الأساسي:

```javascript
// إنشاء كائن جديد من واجهة برمجة تطبيقات AdSense
const adsenseApi = new AdSenseAPI({
  apiKey: 'YOUR_API_KEY',
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'YOUR_REDIRECT_URI',
  accountId: 'YOUR_ACCOUNT_ID'
});

// المصادقة مع AdSense API
await adsenseApi.authenticate();

// الحصول على معلومات الحساب
const accountInfo = await adsenseApi.getAccountInfo();

// الحصول على تقرير أرباح AdSense
const earnings = await adsenseApi.getAccountEarnings('2025-01-01', '2025-04-15');

// الحصول على قائمة وحدات الإعلانات
const adUnits = await adsenseApi.listAdUnits();

// إنشاء كود إعلاني متجاوب
const responsiveAdCode = adsenseApi.createResponsiveAdCode('AD_UNIT_ID', 'auto');

// إنشاء كود إعلاني داخل المقال
const inArticleAdCode = adsenseApi.createInArticleAdCode('AD_UNIT_ID');

// إنشاء كود إعلاني تلقائي
const autoAdsCode = adsenseApi.createAutoAdsCode();
```

### 3. Analytics API

ملف: `static/js/analytics_api.js`

توفر واجهة برمجة تطبيقات Google Analytics وظائف للتفاعل مع بيانات تحليلات الموقع. تتيح هذه الواجهة الحصول على تقارير مختلفة عن أداء الموقع وسلوك المستخدمين.

#### الاستخدام الأساسي:

```javascript
// إنشاء كائن جديد من واجهة برمجة تطبيقات Google Analytics
const analyticsApi = new AnalyticsAPI({
  apiKey: 'YOUR_API_KEY',
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'YOUR_REDIRECT_URI',
  propertyId: 'YOUR_PROPERTY_ID'
});

// المصادقة مع Google Analytics API
await analyticsApi.authenticate();

// تشغيل تقرير Google Analytics
const report = await analyticsApi.runReport('2025-01-01', '2025-04-15');

// الحصول على تقرير الصفحات الأكثر مشاهدة
const topPages = await analyticsApi.getTopPages('2025-01-01', '2025-04-15');

// الحصول على تقرير مصادر حركة المرور
const trafficSources = await analyticsApi.getTrafficSources('2025-01-01', '2025-04-15');

// الحصول على تقرير بيانات المستخدمين الديموغرافية
const demographics = await analyticsApi.getUserDemographics('2025-01-01', '2025-04-15');

// الحصول على تقرير الأجهزة المستخدمة
const devices = await analyticsApi.getDeviceReport('2025-01-01', '2025-04-15');

// إنشاء كود تتبع Google Analytics
const trackingCode = analyticsApi.createTrackingCode('MEASUREMENT_ID');
```

### 4. Search Console API

ملف: `static/js/search_console_api.js`

توفر واجهة برمجة تطبيقات Google Search Console وظائف للتفاعل مع بيانات ظهور الموقع في نتائج البحث. تتيح هذه الواجهة الحصول على تحليلات البحث وإدارة خرائط الموقع.

#### الاستخدام الأساسي:

```javascript
// إنشاء كائن جديد من واجهة برمجة تطبيقات Search Console
const searchConsoleApi = new SearchConsoleAPI({
  apiKey: 'YOUR_API_KEY',
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'YOUR_REDIRECT_URI',
  siteUrl: 'YOUR_SITE_URL'
});

// المصادقة مع Search Console API
await searchConsoleApi.authenticate();

// الحصول على قائمة المواقع
const sites = await searchConsoleApi.listSites();

// الحصول على معلومات موقع محدد
const siteInfo = await searchConsoleApi.getSiteInfo();

// الحصول على أهم استعلامات البحث
const topQueries = await searchConsoleApi.getTopQueries('2025-01-01', '2025-04-15');

// الحصول على أهم الصفحات
const topPages = await searchConsoleApi.getTopPages('2025-01-01', '2025-04-15');

// الحصول على تحليلات البحث مع تصفية حسب الأبعاد
const searchAnalytics = await searchConsoleApi.getSearchAnalytics('2025-01-01', '2025-04-15', null, ['query', 'page', 'country']);

// الحصول على قائمة خرائط الموقع
const sitemaps = await searchConsoleApi.listSitemaps();

// إرسال خريطة موقع جديدة
await searchConsoleApi.submitSitemap('https://example.com/sitemap.xml');

// فحص عنوان URL
const urlInspection = await searchConsoleApi.inspectUrl('https://example.com/page');
```

### 5. Translation API

ملف: `static/js/translation_api.js`

توفر واجهة برمجة تطبيقات الترجمة وظائف للترجمة التلقائية للمحتوى واكتشاف لغة المتصفح. تتيح هذه الواجهة ترجمة محتوى المدونة إلى لغات مختلفة.

#### الاستخدام الأساسي:

```javascript
// إنشاء كائن جديد من واجهة برمجة تطبيقات الترجمة
const translationApi = new TranslationAPI({
  apiKey: 'YOUR_API_KEY',
  defaultLanguage: 'ar',
  supportedLanguages: ['ar', 'en', 'fr', 'es', 'de', 'it', 'ru', 'zh', 'ja', 'ko']
});

// الحصول على لغة المتصفح
const browserLanguage = translationApi.getBrowserLanguage();

// ترجمة نص
const translatedText = await translationApi.translateText('مرحبا بالعالم', 'en', 'ar');

// ترجمة محتوى المدونة
const translatedContent = await translationApi.translateContent(blogPost, 'en');

// تعيين لغة المستخدم
translationApi.setUserLanguage('en');

// الحصول على لغة المستخدم
const userLanguage = translationApi.getUserLanguage();

// تفعيل/تعطيل اكتشاف لغة المتصفح التلقائي
translationApi.setAutoDetect(true);

// الحصول على اسم اللغة من رمزها
const languageName = translationApi.getLanguageName('ar');

// التحقق مما إذا كانت اللغة تُكتب من اليمين إلى اليسار
const isRtl = translationApi.isRTL('ar');

// تطبيق اتجاه اللغة على عناصر الصفحة
translationApi.applyLanguageDirection('ar');
```

## ميزة الترجمة التلقائية

ملف: `static/js/translation.js`

توفر ميزة الترجمة التلقائية وظائف لترجمة واجهة المستخدم ومحتوى المدونة تلقائيًا بناءً على لغة المتصفح أو تفضيلات المستخدم.

### الاستخدام الأساسي:

```javascript
// الكائن متاح عالميًا بعد تحميل الصفحة
const translationUI = window.translationUI;

// ترجمة عناصر واجهة المستخدم الثابتة
translationUI.translateStaticUI();

// ترجمة محتوى ديناميكي
translationUI.translateDynamicContent('#blog-content', '<p>محتوى المدونة</p>');

// تغيير اللغة الحالية
translationUI.changeLanguage('en');
```

### صفحة اختيار اللغة

ملف: `templates/translation/language_selector.html`

توفر صفحة اختيار اللغة واجهة مستخدم لاختيار لغة العرض وتفعيل/تعطيل اكتشاف لغة المتصفح التلقائي.

## تكامل واجهات البرمجة

### 1. تكامل Blogger API

يتم استخدام Blogger API لإدارة محتوى المدونة، بما في ذلك:
- عرض قائمة المنشورات في الصفحة الرئيسية للمدونة
- عرض المنشورات الفردية في صفحات مخصصة
- إدارة التعليقات على المنشورات
- البحث في محتوى المدونة

### 2. تكامل AdSense API

يتم استخدام AdSense API لتحقيق الدخل من المدونة، بما في ذلك:
- عرض الإعلانات في الصفحة الرئيسية للمدونة
- عرض الإعلانات داخل المنشورات
- عرض تقارير الأرباح في لوحة التحكم

### 3. تكامل Analytics API

يتم استخدام Analytics API لتحليل أداء المدونة، بما في ذلك:
- تتبع عدد الزيارات والمشاهدات
- تحليل سلوك المستخدمين
- عرض تقارير الأداء في لوحة التحكم

### 4. تكامل Search Console API

يتم استخدام Search Console API لتحسين ظهور المدونة في نتائج البحث، بما في ذلك:
- تحليل استعلامات البحث
- مراقبة أداء الصفحات في نتائج البحث
- إدارة خرائط الموقع

### 5. تكامل Translation API

يتم استخدام Translation API لتوفير تجربة متعددة اللغات، بما في ذلك:
- ترجمة واجهة المستخدم
- ترجمة محتوى المدونة
- اكتشاف لغة المتصفح تلقائيًا

## واجهة المستخدم

### 1. صفحة المدونة الرئيسية

ملف: `templates/blog/index.html`

توفر صفحة المدونة الرئيسية واجهة مستخدم لعرض أحدث المنشورات والمنشورات المميزة والتصنيفات والوسوم.

### 2. صفحة المنشور الفردي

ملف: `templates/blog/post.html`

توفر صفحة المنشور الفردي واجهة مستخدم لعرض منشور كامل مع التعليقات والمنشورات ذات الصلة.

### 3. لوحة تحكم المدونة

ملف: `templates/admin/blog_dashboard.html`

توفر لوحة تحكم المدونة واجهة مستخدم لإدارة المنشورات والتعليقات والتصنيفات والوسوم.

## الاعتبارات الأمنية

1. **المصادقة والتفويض**: تستخدم جميع واجهات البرمجة OAuth 2.0 للمصادقة والتفويض.
2. **تخزين الرموز**: يتم تخزين رموز الوصول في التخزين المحلي مع وقت انتهاء الصلاحية.
3. **تجديد الرموز**: يتم تجديد رموز الوصول تلقائيًا عند انتهاء صلاحيتها.
4. **نطاقات الوصول**: يتم طلب الحد الأدنى من نطاقات الوصول المطلوبة لكل واجهة برمجة.

## الخلاصة

يوفر قسم المدونات في موقع حاسبة الطاقة الشمسية تجربة مدونة متكاملة مع إمكانيات متقدمة مثل الترجمة التلقائية وتحليلات الموقع وتحقيق الدخل من الإعلانات. تم تطوير هذا القسم باستخدام JavaScript وواجهات برمجة تطبيقات Google المختلفة لتوفير تجربة مستخدم سلسة ومتعددة اللغات.
