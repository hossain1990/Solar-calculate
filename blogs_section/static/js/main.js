/**
 * الوظائف الرئيسية لقسم المدونات
 */

// تهيئة محرر المحتوى
function initContentEditor() {
  if (document.getElementById('contentEditor')) {
    // يمكن استبدال هذا بمحرر WYSIWYG مثل TinyMCE أو CKEditor
    console.log('تم تهيئة محرر المحتوى');
  }
}

// التحقق من صحة نموذج المنشور
function validatePostForm() {
  const form = document.getElementById('postForm');
  if (form) {
    form.addEventListener('submit', function(event) {
      const title = document.getElementById('postTitle').value;
      const content = document.getElementById('postContent').value;
      
      if (!title || title.trim() === '') {
        event.preventDefault();
        alert('يرجى إدخال عنوان للمنشور');
        return false;
      }
      
      if (!content || content.trim() === '') {
        event.preventDefault();
        alert('يرجى إدخال محتوى للمنشور');
        return false;
      }
      
      return true;
    });
  }
}

// تهيئة نموذج التعليقات
function initCommentForm() {
  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // هنا سيتم إضافة كود للتعامل مع إرسال التعليق عبر API
      alert('تم إرسال التعليق بنجاح وسيظهر بعد المراجعة');
      commentForm.reset();
    });
  }
}

// تحميل المزيد من المنشورات
function loadMorePosts() {
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      // هنا سيتم إضافة كود لتحميل المزيد من المنشورات عبر API
      console.log('جاري تحميل المزيد من المنشورات...');
    });
  }
}

// تأكيد حذف المنشور
function confirmPostDelete() {
  const deleteButtons = document.querySelectorAll('.delete-post-btn');
  if (deleteButtons.length > 0) {
    deleteButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        if (!confirm('هل أنت متأكد من رغبتك في حذف هذا المنشور؟')) {
          event.preventDefault();
        }
      });
    });
  }
}

// Fetch and render featured post
function renderFeaturedPost() {
  const featuredPostContainer = document.getElementById('featured-post');
  if (featuredPostContainer) {
    // Simulated data for the featured post
    const featuredPost = {
      title: 'كيف تحول منزلك بالكامل للاعتماد على الطاقة الشمسية',
      summary: 'دليل شامل للتحول إلى الطاقة الشمسية وتوفير فواتير الكهرباء',
      image: '/static/images/featured-post.jpg',
      date: '15 أبريل 2025',
      link: '/blog/post/1'
    };

    featuredPostContainer.innerHTML = `
      <img src="${featuredPost.image}" alt="${featuredPost.title}">
      <div class="featured-post-content">
        <h3>${featuredPost.title}</h3>
        <p>${featuredPost.summary}</p>
        <div class="d-flex justify-content-between align-items-center">
          <small>${featuredPost.date}</small>
          <a href="${featuredPost.link}" class="btn btn-sm btn-outline-light">قراءة المزيد</a>
        </div>
      </div>
    `;
  }
}

// Fetch and render latest posts
function renderLatestPosts() {
  const latestPostsContainer = document.getElementById('latest-posts-container');
  if (latestPostsContainer) {
    // Simulated data for latest posts
    const posts = [
      {
        id: 2,
        title: 'أفضل 5 ألواح شمسية لعام 2025',
        summary: 'تعرف على أفضل الخيارات المتاحة في السوق هذا العام.',
        image: '/static/images/post-2.jpg',
        date: '10 أبريل 2025',
        category: 'الطاقة المتجددة'
      },
      {
        id: 3,
        title: 'كيفية حساب احتياجاتك من الطاقة الشمسية',
        summary: 'خطوات بسيطة لتحديد النظام المناسب لمنزلك.',
        image: '/static/images/post-3.jpg',
        date: '5 أبريل 2025',
        category: 'نصائح وإرشادات'
      }
    ];

    latestPostsContainer.innerHTML = posts.map(post => `
      <div class="col">
        <div class="card blog-card h-100">
          <span class="badge bg-primary category-badge">${post.category}</span>
          <img src="${post.image}" class="card-img-top" alt="${post.title}">
          <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.summary}</p>
          </div>
          <div class="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center">
            <small class="text-muted">${post.date}</small>
            <a href="/blog/post/${post.id}" class="btn btn-sm btn-outline-success">قراءة المزيد</a>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// Initialize dynamic content rendering
function initDynamicContent() {
  renderFeaturedPost();
  renderLatestPosts();
}

// تهيئة جميع الوظائف عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  initContentEditor();
  validatePostForm();
  initCommentForm();
  loadMorePosts();
  confirmPostDelete();
  initDynamicContent();
  
  // إضافة تاريخ السنة الحالية في تذييل الصفحة
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
