const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  //app.get('/', controllers.home.index)
  app.get('/', controllers.article.getLastAddedArticles)
  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/logout', controllers.users.logout)

  app.get('/articles/all', controllers.article.getAllArticlesTitle)
  app.get('/articles/latest', controllers.article.getLatestArticle)
  app.get('/articles/article/:id', controllers.article.getLastContentByArticleId)
  app.post('/search', controllers.article.searchArticle)

  app.get('/articles/create', auth.isAuthenticated, controllers.article.getCreateArticle)
  app.post('/articles/create', auth.isAuthenticated, controllers.article.postCreateArticle)

  app.get('/articles/edit/:id', auth.isAuthenticated, controllers.article.getEditArticle)
  app.post('/articles/edit/:id', auth.isAuthenticated, controllers.article.postEditArticle)
  app.get('/articles/history/:id', auth.isAuthenticated, controllers.article.getArticleHistory)
  app.get('/articles/edits/history/:id', auth.isAuthenticated, controllers.article.getArticleByEditId)
  
  app.post('/lock', auth.isInRole('Admin'), controllers.article.lockArticle)
  app.post('/unlock', auth.isInRole('Admin'), controllers.article.unlockArticle)


  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
