const mongoose = require('mongoose');
const router = require('express').Router();
const Books = mongoose.model('Books');

router.post('/', (req, res, next) => {
  const { body } = req;

  if(!body.title) {
    return res.status(422).json({
      errors: {
        title: 'is required',
      },
    });
  }

  if(!body.author) {
    return res.status(422).json({
      errors: {
        author: 'is required',
      },
    });
  }

  if(!body.body) {
    return res.status(422).json({
      errors: {
        body: 'is required',
      },
    });
  }

  const finalBook = new Books(body);
  return finalBook.save()
    .then(() => res.json({ book: finalBook.toJSON() }))
    .catch(next);
});

router.get('/', (req, res, next) => {
  return Books.find()
    .sort({ createdAt: 'descending' })
    .then((books) => res.json({ books: books.map(book => book.toJSON()) }))
    .catch(next);
});

router.param('id', (req, res, next, id) => {
  return Books.findById(id, (err, book) => {
    if(err) {
      return res.sendStatus(404);
    } else if(book) {
      req.book = book;
      return next();
    }
  }).catch(next);
});

router.get('/:id', (req, res, next) => {
  return res.json({
    book: req.book.toJSON(),
  });
});

router.patch('/:id', (req, res, next) => {
  const { body } = req;

  if(typeof body.title !== 'undefined') {
    req.book.title = body.title;
  }

  if(typeof body.author !== 'undefined') {
    req.book.author = body.author;
  }

  if(typeof body.body !== 'undefined') {
    req.book.body = body.body;
  }

  if(typeof body.notes !== 'undefined') {
    req.book.notes = body.notes;
  }

  return req.book.save()
    .then(() => res.json({ book: req.book.toJSON() }))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  return Books.findByIdAndRemove(req.book._id)
    .then(() => res.sendStatus(200))
    .catch(next);
});

router.post('/search', (req, res, next) => {
  const { body } = req;
  if(!body.search) {
    return res.status(422).json({
      errors: {
        search: 'is required',
      },
    });
  }


  const books = require('google-books-search');

  var options = {
      key: "AIzaSyCt01gDpWa9Wh12bmWL2Dmlk8_3F7SyYR8",
      field: 'title',
      offset: 0,
      limit: 12,
      type: 'books',
      order: 'relevance',
      lang: 'en'
  };
  
  books.search(body.search, function(error, results) {
      if ( ! error ) {
          console.log(results);
          var filteredResults = results.filter(book => book.authors && book.authors.length && book.title && book.description && book.thumbnail)
          return res.status(200).json({results:filteredResults});
      } else {
          console.log(error);
      }
  });
});

module.exports = router;