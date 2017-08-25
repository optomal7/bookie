const db = require('./db');

/*
 TODO
xADD BOOK(adds title, author, genre to books table)
xEDIT BOOK(title, author, genre)
xDELETE BOOK(by id?)
xGET BOOKS(by title||author||genre)
x??GET BOOK (by id)??
*/
const editBook = function(edit) {
  return db.query(`
    UPDATE
      books
    SET
      title = ($1), author = ($2), genre = ($3)
    WHERE
      id = ($4)
    `,
    [
      edit.title,
      edit.author,
      edit.genre,
      edit.id
    ])
    .catch(error => error);
}

const getBooks = function(){
  return db.query(`
    SELECT
      *
    FROM
      books
    `, [])
    .catch(error => error)
}

const addBook = function (book) {
  return db.query(`
    INSERT INTO
      books (title, author, genre)
    VALUES
      ($1::text, $2::text, $3::text)
    `,
    [
      book.title,
      book.author,
      book.genre
    ])
    .catch(error => error);
}

const getBook = function (bookId) {
  return db.one(`
    SELECT
      *
    FROM
      books
    WHERE
      id = $1::int
    LIMIT 1
    `,
  [bookId])
  .catch(error => error)
}

const searchForBook = function(searchQuery){
  return db.query(`
    SELECT
      *
    FROM
      books
    WHERE
      lower(title || author || genre) LIKE $1::text
    `,
    [`%${searchQuery.toLowerCase().replace(/\s+/,'%')}%`])
    .catch(error => error);
}

const deleteBook = function (bookId) {
  return db.query(`
    DELETE FROM
      books
    WHERE
     id=$1::int
     `,
      [bookId])
      .catch(error => error);
}

module.exports = {
  getBooks,
  editBook,
  addBook,
  getBook,
  searchForBook,
  deleteBook
}
