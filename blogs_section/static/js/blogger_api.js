/**
 * واجهة برمجة تطبيقات Blogger (محاكاة)
 * توفر هذه الوحدة وظائف لإدارة المنشورات باستخدام بيانات ثابتة.
 */

class BloggerAPI {
  constructor() {
    // بيانات ثابتة لمحاكاة المنشورات
    this.posts = [
      {
        id: 1,
        title: 'كيف تحول منزلك بالكامل للاعتماد على الطاقة الشمسية',
        content: 'دليل شامل للتحول إلى الطاقة الشمسية وتوفير فواتير الكهرباء.',
        date: '2025-04-15',
        category: 'الطاقة المتجددة',
        image: '/static/images/featured-post.jpg'
      },
      {
        id: 2,
        title: 'أفضل 5 ألواح شمسية لعام 2025',
        content: 'تعرف على أفضل الخيارات المتاحة في السوق هذا العام.',
        date: '2025-04-10',
        category: 'نصائح وإرشادات',
        image: '/static/images/post-2.jpg'
      }
    ];
  }

  // الحصول على قائمة المنشورات
  async listPosts() {
    return this.posts;
  }

  // الحصول على منشور محدد
  async getPost(postId) {
    return this.posts.find(post => post.id === postId);
  }

  // إنشاء منشور جديد
  async createPost(title, content, category, image) {
    const newPost = {
      id: this.posts.length + 1,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      category,
      image
    };
    this.posts.push(newPost);
    return newPost;
  }

  // تحديث منشور موجود
  async updatePost(postId, updatedData) {
    const postIndex = this.posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      this.posts[postIndex] = { ...this.posts[postIndex], ...updatedData };
      return this.posts[postIndex];
    }
    return null;
  }

  // حذف منشور
  async deletePost(postId) {
    const postIndex = this.posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      return this.posts.splice(postIndex, 1)[0];
    }
    return null;
  }
}

// تصدير الفئة للاستخدام في ملفات أخرى
export default BloggerAPI;
