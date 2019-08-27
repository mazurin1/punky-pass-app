const books = require('google-books-search');

var options = {
    key: "YOUR API KEY",
    field: 'title',
    offset: 0,
    limit: 12,
    type: 'books',
    order: 'relevance',
    lang: 'en'
};

books.search('Professional JavaScript for Web Developers', function(error, results) {
    if ( ! error ) {
        console.log(results);
    } else {
        console.log(error);
    }
});