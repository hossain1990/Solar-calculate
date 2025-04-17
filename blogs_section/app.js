const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const BloggerAPI = require('../api/blogger/blogger_api'); // Adjust path as needed

const app = express();
const bloggerApi = new BloggerAPI();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../templates'));
app.use(express.static(path.join(__dirname, '../static')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'solar_panel_blog_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Public Routes
app.get('/', async (req, res) => {
    try {
        const posts = await bloggerApi.listPosts(10);
        res.render('blog/index', { posts: posts.items || [] });
    } catch (error) {
        req.flash('error', `Error: ${error.message}`);
        res.render('blog/index', { posts: [] });
    }
});

app.get('/post/:postId', async (req, res) => {
    try {
        const post = await bloggerApi.getPost(req.params.postId);
        const comments = await bloggerApi.listComments(req.params.postId);
        res.render('blog/post', { post, comments: comments.items || [] });
    } catch (error) {
        req.flash('error', `Error: ${error.message}`);
        res.redirect('/');
    }
});

app.get('/search', async (req, res) => {
    const query = req.query.q || '';
    if (!query) return res.redirect('/');
    try {
        const results = await bloggerApi.searchPosts(query);
        res.render('blog/search', { query, posts: results.items || [] });
    } catch (error) {
        req.flash('error', `Error: ${error.message}`);
        res.redirect('/');
    }
});

// Admin Routes
app.get('/admin', async (req, res) => {
    if (!req.session.authenticated) return res.redirect('/admin/login');
    try {
        const blogInfo = await bloggerApi.getBlogInfo();
        const posts = await bloggerApi.listPosts(20);
        res.render('admin/index', { blog: blogInfo, posts: posts.items || [] });
    } catch (error) {
        req.flash('error', `Error: ${error.message}`);
        res.render('admin/index', { blog: {}, posts: [] });
    }
});

app.route('/admin/login')
    .get((req, res) => res.render('admin/login'))
    .post((req, res) => {
        const { username, password } = req.body;
        if (username === 'admin' && password === 'password') {
            req.session.authenticated = true;
            res.redirect('/admin');
        } else {
            req.flash('error', 'Invalid username or password');
            res.redirect('/admin/login');
        }
    });

app.get('/admin/logout', (req, res) => {
    req.session.authenticated = null;
    res.redirect('/');
});

app.get('/admin/posts', async (req, res) => {
    if (!req.session.authenticated) return res.redirect('/admin/login');
    try {
        const posts = await bloggerApi.listPosts(50);
        res.render('admin/posts', { posts: posts.items || [] });
    } catch (error) {
        req.flash('error', `Error: ${error.message}`);
        res.render('admin/posts', { posts: [] });
    }
});

app.route('/admin/posts/new')
    .get((req, res) => {
        if (!req.session.authenticated) return res.redirect('/admin/login');
        res.render('admin/post_form', { post: null });
    })
    .post(async (req, res) => {
        if (!req.session.authenticated) return res.redirect('/admin/login');
        const { title, content, labels, is_draft } = req.body;
        try {
            await bloggerApi.createPost(title, content, labels.split(','), !!is_draft);
            req.flash('success', 'Post created successfully');
            res.redirect('/admin/posts');
        } catch (error) {
            req.flash('error', `Error: ${error.message}`);
            res.redirect('/admin/posts/new');
        }
    });

app.route('/admin/posts/edit/:postId')
    .get(async (req, res) => {
        if (!req.session.authenticated) return res.redirect('/admin/login');
        try {
            const post = await bloggerApi.getPost(req.params.postId);
            res.render('admin/post_form', { post });
        } catch (error) {
            req.flash('error', `Error: ${error.message}`);
            res.redirect('/admin/posts');
        }
    })
    .post(async (req, res) => {
        if (!req.session.authenticated) return res.redirect('/admin/login');
        const { title, content, labels } = req.body;
        try {
            await bloggerApi.updatePost(req.params.postId, title, content, labels.split(','));
            req.flash('success', 'Post updated successfully');
            res.redirect('/admin/posts');
        } catch (error) {
            req.flash('error', `Error: ${error.message}`);
            res.redirect(`/admin/posts/edit/${req.params.postId}`);
        }
    });

app.post('/admin/posts/delete/:postId', async (req, res) => {
    if (!req.session.authenticated) return res.redirect('/admin/login');
    try {
        await bloggerApi.deletePost(req.params.postId);
        req.flash('success', 'Post deleted successfully');
        res.redirect('/admin/posts');
    } catch (error) {
        req.flash('error', `Error: ${error.message}`);
        res.redirect('/admin/posts');
    }
});

app.get('/admin/comments', async (req, res) => {
    if (!req.session.authenticated) return res.redirect('/admin/login');
    try {
        const comments = await bloggerApi.listComments(50);
        res.render('admin/comments', { comments: comments.items || [] });
    } catch (error) {
        req.flash('error', `Error: ${error.message}`);
        res.render('admin/comments', { comments: [] });
    }
});

app.post('/admin/comments/approve/:postId/:commentId', async (req, res) => {
    if (!req.session.authenticated) return res.redirect('/admin/login');
    try {
        await bloggerApi.approveComment(req.params.postId, req.params.commentId);
        req.flash('success', 'Comment approved successfully');
        res.redirect('/admin/comments');
    } catch (error) {
        req.flash('error', `Error: ${error.message}`);
        res.redirect('/admin/comments');
    }
});

app.post('/admin/comments/spam/:postId/:commentId', async (req, res) => {
    if (!req.session.authenticated) return res.redirect('/admin/login');
    try {
        await bloggerApi.markCommentAsSpam(req.params.postId, req.params.commentId);
        req.flash('success', 'Comment marked as spam successfully');
        res.redirect('/admin/comments');
    } catch (error) {
        req.flash('error', `Error: ${error.message}`);
        res.redirect('/admin/comments');
    }
});

app.post('/admin/comments/delete/:postId/:commentId', async (req, res) => {
    if (!req.session.authenticated) return res.redirect('/admin/login');
    try {
        await bloggerApi.deleteComment(req.params.postId, req.params.commentId);
        req.flash('success', 'Comment deleted successfully');
        res.redirect('/admin/comments');
    } catch (error) {
        req.flash('error', `Error: ${error.message}`);
        res.redirect('/admin/comments');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
