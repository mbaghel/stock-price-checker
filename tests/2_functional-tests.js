
/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
  suite('DELETE /api/clear-test-data => "Cleared test data!"', function() {
    test('clear test data', function(done) {
      chai.request(server)
        .delete('/api/clear-test-data')
        .end(function(err, res){
          assert.equal(res.text, 'Cleared test data!')
          done()
      })
    })
  })
  
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
         assert.isObject(res.body)
         assert.equal(res.body.stock, 'GOOG')
         assert.isString(res.body.price)
         assert.isNumber(res.body.likes)
          
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'zvzzt', like: true})
          .end(function(err, res){
            assert.isObject(res.body)
            assert.equal(res.body.stock, 'ZVZZT')
            assert.isString(res.body.price)
            assert.isNumber(res.body.likes)
            done()
        })
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'zvzzt', like: true})
          .end(function(err, res){
            assert.isObject(res.body)
            assert.equal(res.body.stock, 'ZVZZT')
            assert.isString(res.body.price)
            assert.isNumber(res.body.likes)
            done()
        })
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['zwzzt', 'zxzzt']})
          .end(function(err, res) {
            assert.isArray(res.body)
            assert.equal(res.body[0].stock, 'ZWZZT')
            assert.isString(res.body[0].price)
            assert.isNumber(res.body[0].rel_likes)
            assert.equal(res.body[1].stock, 'ZXZZT')
            assert.isString(res.body[1].price)
            assert.isNumber(res.body[1].rel_likes)
            done()
          })
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['zwzzt', 'zxzzt'], like: true})
          .end(function(err, res) {
            assert.isArray(res.body)
            assert.equal(res.body[0].stock, 'ZWZZT')
            assert.isString(res.body[0].price)
            assert.isNumber(res.body[0].rel_likes)
            assert.equal(res.body[1].stock, 'ZXZZT')
            assert.isString(res.body[1].price)
            assert.isNumber(res.body[1].rel_likes)
            done()
          })
      });
      
    });

});
