var expect = require('chai').expect;
var request = require('supertest-as-promised');


describe('Embedded creation', function() {
  var app;

  before(function() {
    app = require('../server/server');
  });


  it('creates books in paralell', function() {
    var library;
    var booksNames = [
      'My first book',
      'My second book',
      'My third book'
    ];
    return request(app)
      .post('/api/libraries')
      .send({ name: 'My library' })
      .expect(200)

      .then(function(res) {
        library = res.body;

        var booksPromises = booksNames.map(function(bookName) {
            return request(app)
              .post('/api/libraries/' + library.id + '/books')
              .send({ name: bookName })
              .expect(200)
              .then(function(res) { return res.body; });
          });

        return Promise.all(booksPromises);
      })
      .then(function() {
        return app.models.Library.findById(library.id)
          .then(function(fetchedLibrary) {
            var libraryJSON = fetchedLibrary.toJSON();
            
            expect(libraryJSON._books.length).to.be.equal(booksNames.length);
          });
      });
  });

});
