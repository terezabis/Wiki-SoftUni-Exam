const Article = require('mongoose').model('Article');
const Edit = require('mongoose').model('Edit');
const auth = require('../config/auth')

module.exports = {
    getCreateArticle: (req, res) => {
        res.render('articles/create');
    },

    postCreateArticle: (req, res) => {
        let reqBody = req.body;

        let articleObj = {
            title: reqBody.title,
            creationDate: Date.now()
        }

        let articleContent = reqBody.content;

        Article.create(articleObj).then((a) => {
            Edit.create({
                author: req.user._id,
                article: a._id,
                creationDate: Date.now(),
                content: articleContent
            }).then((ed) => {
                res.redirect('/')
            })
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.render('articles/create')
        })
    },

    getAllArticlesTitle: (req, res) => {
        Article.find().sort({ title: 1 }).then((articles) => {
            res.render('articles/all', { articles })
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.render('articles/all')
        })
    },

    getLastContentByArticleId: (req, res) => {
        let articleId = req.params.id;
        Edit.findOne({ article: articleId }).sort({ creationDate: -1 }).populate('article').then((edit) => {
            res.render('articles/article', { edit })
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.render('articles/all')
        })
    },

    getEditArticle: (req, res) => {
        let articleId = req.params.id;
        let userRoles = req.user.roles;
        let isAdmin = userRoles.includes('Admin')

        Article.findById(articleId).then((a) => {
            if (isAdmin || !a.lockedStatus) {
                Edit.findOne({ article: articleId }).sort({ creationDate: -1 }).populate('article').then((edit) => {
                    res.render('articles/edit', { edit, isAdmin })
                }).catch((err) => {
                    res.locals.globalError = err.message;
                    res.render('articles/all')
                })
            } else {
                res.redirect('/')
            }
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.redirect('/')
        })
    },

    postEditArticle: (req, res) => {
        let articleId = req.params.id;
        let userRoles = req.user.roles;
        let isAdmin = userRoles.includes('Admin')

        Article.findById(articleId).then((a) => {
            if (isAdmin || !a.lockedStatus) {
                Edit.create({
                    author: req.user._id,
                    article: articleId,
                    creationDate: Date.now(),
                    content: req.body.content
                }).then((ed) => {
                    res.redirect('/')
                }).catch((err) => {
                    res.locals.globalError = err.message;
                    res.render('articles/edit')
                })
            } else {
                res.redirect('/')
            }
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.render('articles/edit')
        })
    },

    getLatestArticle: (req, res) => {
        Article.findOne().sort({ creationDate: -1 }).then((a) => {
            Edit.findOne({ article: a._id }).sort({ creationDate: -1 }).populate('article').then((edit) => {
                res.render('articles/article', { edit })
            }).catch((err) => {
                res.locals.globalError = err.message;
                res.redirect('/')
            })
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.redirect('/')
        })
    },

    getArticleHistory: (req, res) => {
        let articleId = req.params.id;
        Article.findById(articleId).then((ar) => {
            Edit.find({ article: articleId }).sort({ creationDate: -1 }).populate('author')
                .then((edits) => {
                    res.render('articles/history', { edits, ar })
                }).catch((err) => {
                    res.locals.globalError = err.message;
                    res.redirect('/')
                })
        })
    },

    getArticleByEditId: (req, res) => {
        let editId = req.params.id;
        Edit.findById(editId).populate('article').then((edit) => {
            res.render('articles/article', { edit })
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.render('articles/all')
        })
    },

    getLastAddedArticles: (req, res) => {
        Article.find().sort({ creationDate: -1 }).then((articles) => {
            Edit.findOne({ article: articles[0] }).sort({ creationDate: -1 }).populate('article').then((edit) => {
                articles.shift();
                let editWith50Words = edit.content.split(' ').slice(0, 50).join(' ');
                res.render('home/index', { articles, edit, editWith50Words })
            }).catch((err) => {
                res.locals.globalError = err.message;
                res.redirect('/')
            })
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.redirect('/')
        })
    },

    lockArticle: (req, res) => {
        let articleId = req.body.articleId;
        Article.findById(articleId).then((a) => {
            a.lockedStatus = true
            a.save()
            res.redirect('/')
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.redirect('/')
        })
    },

    unlockArticle: (req, res) => {
        let articleId = req.body.articleId;
        Article.findById(articleId).then((a) => {
            a.lockedStatus = false
            a.save()
            res.redirect('/')
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.redirect('/')
        })
    },

    searchArticle: (req, res) => {
        let query = req.body.query
        Article.find({ "title": { "$regex": query, "$options": "i" } }).then((articles) => {
            let articlesResult
            
            res.render('articles/search', { articles, query })
        }).catch((err) => {
            res.locals.globalError = err.message;
            res.redirect('/')
        })
    }

}