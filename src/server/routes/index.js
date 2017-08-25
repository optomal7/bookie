const router = require('express').Router();

const dbBooks = require('../../db/books');

router.get('/', (req, res) => {
  res.redirect('/1')
})

router.get('/admin', (req, res) => {
  res.render('admin')
})

router.get('/search', (req, res, next) => {
  console.log('yo')
  const query = req.query.q
  dbBooks.searchForBook(query)
  .then(function(books) {
    const pages = Math.ceil(books.length / 10)
    books = books.slice(0, 10)
    if (books) return res.render('results', { query, books, pages})
    next()
  })
  .catch( error => renderError(error, response, response) )
})

router.get('/search/:query/:page', (req, res, next) => {
  const page = parseInt(req.params.page)
  console.log(req.params);
  const last = page * 10
  const first = last - 10
  const query = req.params.query
  dbBooks.searchForBook(query)
  .then(function(books) {
    const pages = Math.ceil(books.length / 10)
    books = books.slice(first, last)
    if (books) return res.render('results', { query, books, pages})
    next()
  })
  .catch( error => renderError(error, response, response) )
})

router.get('/:page', (req, res) => {
  const page = parseInt(req.params.page)
  const last = page * 10
  const first = last - 10
  dbBooks.getBooks()
  .then((books) => {
    const pages = Math.ceil(books.length / 10)
    books = books.slice(first, last)
    res.render('home', {books, pages})
  })
  .catch(err => console.log('err', err))
})



router.post('/admin', (req, res) => {
  console.log(req.body);
  dbBooks.addBook(req.body)
    .then(() => {
      res.render('admin');
    })
})

router.get('/book/:bookId', (req, res, next) => {
  const bookId = req.params.bookId
  console.log(req.params);
  console.log(bookId);
  if (!bookId || !/^\d+$/.test(bookId)) return next()
  dbBooks.getBook(bookId)
  .then(function(book) {
    if (book) return res.render('book', { book })
    next()
  })
})



router.get('/book/:bookId/edit', (req, res, next) => {
  const bookId = req.params.bookId
  if (!bookId || !/^\d+$/.test(bookId)) return next()
  dbBooks.getBook(bookId)
  .then(function(book) {
    if (book) return res.render('edit', { book })
    next()
  })
})

router.put('/book/:bookId/edit', (req, res) => {
  req.body.id = req.params.bookId
  console.log('its happening!')
  dbBooks.editBook(req.body)
  .then(() => {
    res.redirect('/')
  })
})

router.delete('/book/:bookId/delete', (req, res) => {
  console.log('gonna delete ya!')
  dbBooks.deleteBook(req.params.bookId)
  .then(() => {
    res.redirect('/')
  })

})

module.exports = router
