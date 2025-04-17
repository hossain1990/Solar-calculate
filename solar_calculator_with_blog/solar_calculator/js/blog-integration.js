/* تكامل قسم المدونات مع حاسبة الطاقة الشمسية */

/**
 * blog-integration.js - ملف تكامل قسم المدونات مع حاسبة الطاقة الشمسية
 */

// متغيرات عامة
let blogPosts = [];
let relatedSolarArticles = [];

// تهيئة تكامل المدونة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('تهيئة تكامل قسم المدونات مع حاسبة الطاقة الشمسية...');
    
    // تحميل المنشورات ذات الصلة بالطاقة الشمسية
    loadRelatedSolarArticles();
    
    // إضافة مستمعات الأحداث
    setupBlogIntegrationEvents();
    
    // تهيئة مشاركة نتائج الحاسبة
    initializeResultSharing();
    
    console.log('اكتملت تهيئة تكامل قسم المدونات');
});

// تحميل المنشورات ذات الصلة بالطاقة الشمسية
async function loadRelatedSolarArticles() {
    try {
        // استخدام Blogger API للحصول على المنشورات ذات الصلة
        // في التطبيق الحقيقي، سنستخدم واجهة برمجة Blogger الفعلية
        
        console.log('تحميل المنشورات ذات الصلة بالطاقة الشمسية...');
        
        // محاكاة استجابة واجهة برمجة Blogger
        const articles = simulateBloggerResponse('solar');
        
        // تخزين المنشورات
        relatedSolarArticles = articles;
        
        // عرض المنشورات في الواجهة
        displayRelatedArticles(articles);
        
    } catch (error) {
        console.error('خطأ في تحميل المنشورات ذات الصلة:', error);
    }
}

// محاكاة استجابة واجهة برمجة Blogger
function simulateBloggerResponse(query) {
    // هذه دالة تحاكي استجابة واجهة برمجة Blogger
    // في التطبيق الحقيقي، سنستخدم الاستجابة الفعلية من الواجهة
    
    // منشورات وهمية ذات صلة بالطاقة الشمسية
    const solarArticles = [
        {
            id: 'post-1',
            title: 'دليل شامل لاختيار الألواح الشمسية المناسبة لمنزلك',
            content: 'تعرف على أنواع الألواح الشمسية المختلفة وكيفية اختيار النوع المناسب لمنزلك...',
            author: 'أحمد محمد',
            date: '2025-03-15',
            url: '/blog/solar-panels-guide',
            thumbnail: 'images/solar-panels-guide.jpg',
            tags: ['طاقة شمسية', 'ألواح شمسية', 'دليل']
        },
        {
            id: 'post-2',
            title: '10 نصائح لزيادة كفاءة نظام الطاقة الشمسية',
            content: 'تعلم كيفية تحسين أداء نظام الطاقة الشمسية الخاص بك وزيادة إنتاج الطاقة...',
            author: 'سارة أحمد',
            date: '2025-02-28',
            url: '/blog/solar-efficiency-tips',
            thumbnail: 'images/solar-efficiency.jpg',
            tags: ['طاقة شمسية', 'كفاءة', 'نصائح']
        },
        {
            id: 'post-3',
            title: 'كيف تحسب العائد على الاستثمار في الطاقة الشمسية',
            content: 'دليل خطوة بخطوة لحساب العائد على الاستثمار في نظام الطاقة الشمسية...',
            author: 'محمد علي',
            date: '2025-01-20',
            url: '/blog/solar-roi-calculation',
            thumbnail: 'images/solar-roi.jpg',
            tags: ['طاقة شمسية', 'استثمار', 'عائد']
        },
        {
            id: 'post-4',
            title: 'الدعم الحكومي والحوافز للطاقة الشمسية في المنطقة العربية',
            content: 'نظرة عامة على برامج الدعم الحكومي والحوافز المتاحة لأنظمة الطاقة الشمسية...',
            author: 'ليلى عمر',
            date: '2025-01-05',
            url: '/blog/solar-incentives',
            thumbnail: 'images/solar-incentives.jpg',
            tags: ['طاقة شمسية', 'دعم حكومي', 'حوافز']
        },
        {
            id: 'post-5',
            title: 'تجربتي مع تركيب نظام الطاقة الشمسية في منزلي',
            content: 'قصة نجاح حقيقية لتركيب نظام طاقة شمسية منزلي وتأثيره على فواتير الكهرباء...',
            author: 'خالد سعيد',
            date: '2024-12-10',
            url: '/blog/solar-installation-experience',
            thumbnail: 'images/solar-experience.jpg',
            tags: ['طاقة شمسية', 'تجربة شخصية', 'تركيب']
        }
    ];
    
    return solarArticles;
}

// عرض المنشورات ذات الصلة في الواجهة
function displayRelatedArticles(articles) {
    const relatedArticlesContainer = document.getElementById('related-articles');
    if (!relatedArticlesContainer) return;
    
    // مسح المحتوى الحالي
    relatedArticlesContainer.innerHTML = '';
    
    // إضافة عنوان
    const heading = document.createElement('h3');
    heading.className = 'mb-4';
    heading.textContent = 'مقالات ذات صلة بالطاقة الشمسية';
    relatedArticlesContainer.appendChild(heading);
    
    // إضافة المنشورات
    articles.forEach(article => {
        const articleCard = document.createElement('div');
        articleCard.className = 'card mb-3 shadow-sm';
        
        articleCard.innerHTML = `
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${article.thumbnail}" class="img-fluid rounded-start" alt="${article.title}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.content.substring(0, 100)}...</p>
                        <p class="card-text"><small class="text-muted">بواسطة ${article.author} - ${formatDate(article.date)}</small></p>
                        <a href="${article.url}" class="btn btn-outline-success btn-sm">قراءة المزيد</a>
                    </div>
                </div>
            </div>
        `;
        
        relatedArticlesContainer.appendChild(articleCard);
    });
}

// تنسيق التاريخ
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
}

// إضافة مستمعات الأحداث
function setupBlogIntegrationEvents() {
    // مستمع حدث لزر مشاركة النتائج
    const shareResultsButton = document.getElementById('share-results-button');
    if (shareResultsButton) {
        shareResultsButton.addEventListener('click', shareCalculationResults);
    }
    
    // مستمع حدث لزر الاشتراك في النشرة البريدية
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            subscribeToNewsletter();
        });
    }
}

// مشاركة نتائج الحساب
function shareCalculationResults() {
    // التحقق من وجود نتائج للمشاركة
    if (!window.calculationResults) {
        alert('يرجى إجراء الحساب أولاً قبل المشاركة');
        return;
    }
    
    // إنشاء نص المشاركة
    const shareText = createShareText(window.calculationResults);
    
    // عرض خيارات المشاركة
    showSharingOptions(shareText);
}

// إنشاء نص المشاركة
function createShareText(results) {
    // إنشاء نص يلخص نتائج الحساب
    
    const { solarProduction, financialSavings, environmentalBenefits, investmentDetails } = results;
    
    return `
نتائج حاسبة الطاقة الشمسية:

🔆 الإنتاج السنوي: ${solarProduction.annualProduction.toLocaleString()} كيلوواط ساعة/سنة
💰 التوفير السنوي: ${financialSavings.annual.toLocaleString()} ${results.currency}/سنة
🌳 تخفيض CO2: ${environmentalBenefits.co2Reduction.toLocaleString()} كجم/سنة (ما يعادل ${environmentalBenefits.treesEquivalent} شجرة)
💼 فترة استرداد الاستثمار: ${investmentDetails.paybackPeriod.toLocaleString()} سنة
📈 العائد على الاستثمار: ${investmentDetails.roi.toLocaleString()}%

احسب توفيرك الخاص على موقعنا: [رابط الموقع]
    `;
}

// عرض خيارات المشاركة
function showSharingOptions(shareText) {
    // في التطبيق الحقيقي، سنستخدم واجهات برمجة المشاركة الاجتماعية
    
    // إنشاء مربع حوار للمشاركة
    const shareDialog = document.createElement('div');
    shareDialog.className = 'modal fade';
    shareDialog.id = 'shareModal';
    shareDialog.setAttribute('tabindex', '-1');
    shareDialog.setAttribute('aria-labelledby', 'shareModalLabel');
    shareDialog.setAttribute('aria-hidden', 'true');
    
    shareDialog.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="shareModalLabel">مشاركة النتائج</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="share-text" class="form-label">نص المشاركة:</label>
                        <textarea class="form-control" id="share-text" rows="8">${shareText}</textarea>
                    </div>
                    <div class="d-flex justify-content-center gap-3">
                        <button class="btn btn-outline-primary" onclick="shareToSocialMedia('twitter')">
                            <i class="bi bi-twitter"></i> تويتر
                        </button>
                        <button class="btn btn-outline-primary" onclick="shareToSocialMedia('facebook')">
                            <i class="bi bi-facebook"></i> فيسبوك
                        </button>
                        <button class="btn btn-outline-success" onclick="shareToSocialMedia('whatsapp')">
                            <i class="bi bi-whatsapp"></i> واتساب
                        </button>
                        <button class="btn btn-outline-secondary" onclick="copyShareText()">
                            <i class="bi bi-clipboard"></i> نسخ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // إضافة مربع الحوار إلى الصفحة
    document.body.appendChild(shareDialog);
    
    // عرض مربع الحوار
    const modal = new bootstrap.Modal(document.getElementById('shareModal'));
    modal.show();
    
    // إضافة دالة نسخ النص
    window.copyShareText = function() {
        const shareTextArea = document.getElementById('share-text');
        shareTextArea.select();
        document.execCommand('copy');
        alert('تم نسخ النص');
    };
    
    // إضافة دالة المشاركة على وسائل التواصل الاجتماعي
    window.shareToSocialMedia = function(platform) {
        const text = encodeURIComponent(document.getElementById('share-text').value);
        const url = encodeURIComponent(window.location.href);
        
        let shareUrl;
        
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
                break;
            default:
                return;
        }
        
        window.open(shareUrl, '_blank');
    };
}

// تهيئة مشاركة النتائج
function initializeResultSharing() {
    // إضافة زر مشاركة النتائج إلى قسم النتائج
    const resultsSection = document.getElementById('results-section');
    if (!resultsSection) return;
    
    const shareButton = document.createElement('button');
    shareButton.id = 'share-results-button';
    shareButton.className = 'btn btn-outline-primary mt-3';
    shareButton.innerHTML = '<i class="bi bi-share"></i> مشاركة هذه النتائج';
    
    // إضافة الزر إلى نهاية قسم النتائج
    resultsSection.appendChild(shareButton);
}

// الاشتراك في النشرة البريدية
function subscribeToNewsletter() {
    const emailInput = document.getElementById('newsletter-email');
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    
    // التحقق من صحة البريد الإلكتروني
    if (!email || !isValidEmail(email)) {
        alert('يرجى إدخال بريد إلكتروني صحيح');
        return;
    }
    
    // في التطبيق الحقيقي، سنرسل البريد الإلكتروني إلى الخادم
    console.log(`الاشتراك في النشرة البريدية: ${email}`);
    
    // عرض رسالة نجاح
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.innerHTML = `
            <div class="alert alert-success">
                تم الاشتراك بنجاح! سنرسل لك آخر التحديثات والنصائح حول الطاقة الشمسية.
            </div>
        `;
    }
}

// التحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// إضافة منشور جديد إلى قسم المدونات
function addNewBlogPost(postData) {
    // هذه الدالة ستستخدم واجهة برمجة Blogger لإضافة منشور جديد
    // في التطبيق الحقيقي، سنستخدم واجهة برمجة Blogger الفعلية
    
    console.log('إضافة منشور جديد:', postData);
    
    // محاكاة إضافة المنشور
    const newPost = {
        id: `post-${Date.now()}`,
        title: postData.title,
        content: postData.content,
        author: postData.author,
        date: new Date().toISOString().split('T')[0],
        url: `/blog/${postData.title.toLowerCase().replace(/\s+/g, '-')}`,
        thumbnail: postData.thumbnail || 'images/default-post.jpg',
        tags: postData.tags || []
    };
    
    // إضافة المنشور إلى القائمة
    blogPosts.push(newPost);
    
    // إذا كان المنشور متعلقاً بالطاقة الشمسية، أضفه إلى القائمة ذات الصلة
    if (postData.tags && postData.tags.includes('طاقة شمسية')) {
        relatedSolarArticles.push(newPost);
        
        // تحديث عرض المنشورات ذات الصلة
        displayRelatedArticles(relatedSolarArticles);
    }
    
    return newPost;
}

// تصدير الدوال للاستخدام في ملفات أخرى
window.loadRelatedSolarArticles = loadRelatedSolarArticles;
window.shareCalculationResults = shareCalculationResults;
window.addNewBlogPost = addNewBlogPost;
