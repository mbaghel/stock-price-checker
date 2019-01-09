/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var iexApi = require('iex-api')
var _fetch = require('isomorphic-fetch');

// create stock fetcher
const iex = new iexApi.Client(_fetch);

// connect to MongoDB 
const CONNECTION_STRING = process.env.DB;
let stockDb;
MongoClient.connect(CONNECTION_STRING, (err, db) => {
  if (err) return console.log('Unable to connect to database');
  stockDb = db;
})

function getPrice(stock) {
  return iex.request(`stock/${stock}/price`);
}

async function getLikes(stock, likeBool, ip) {
  // increment likes if like===true and ip has not already liked stock
  if (likeBool) {
    // check if ip already liked stock
    const likeCount = await stockDb.collection('likes').count({ $and: [{stock: stock}, { ips: ip }] })
    if (likeCount < 1) {
      await stockDb.collection('likes').updateOne({ stock: stock }, { $inc: { likes: 1 }, $push: { ips: ip } }, {upsert: true})
    } 
  }
  const likeRes = await stockDb.collection('likes').findOne({ stock: stock }, {fields: {likes: 1, _id: 0}});
  return likeRes ? likeRes.likes : 0;
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      const stock = req.query.stock;
      const likeBool = req.query.like; 
      let ip = req.ip;
      // accept ipV6 and ipV4 ips
      if (ip.slice(0, 7) === '::ffff:') ip = ip.slice(7);
    
      let stockData;
      // allow two stocks to be passed
      if (Array.isArray(stock)) {
        stockData = [];
        for (let i = 0; i < 2; i++) {
          // fetch price from api
          const price = await getPrice(stock[i])
          if (!price || typeof price == 'string') return res.status(400).send(price);
      
          // get number of likes
          const likes = await getLikes(stock[i].toUpperCase(), likeBool, ip);
          
          stockData.push({stock: stock[i].toUpperCase(), price: price.toFixed(2), rel_likes: likes});
        }
        const temp = stockData[0].rel_likes
        stockData[0].rel_likes = temp - stockData[1].rel_likes;
        stockData[1].rel_likes = stockData[1].rel_likes - temp;
      } else {
        // fetch price from api
        const price = await getPrice(stock)
        if (!price || typeof price == 'string') return res.status(400).send(price);
      
        // get number of likes
        const likes = await getLikes(stock.toUpperCase(), likeBool, ip);
      
        stockData = {
          stock: stock.toUpperCase(),
          price: price.toFixed(2),
          likes
        }
      }
      res.send(stockData);
    });
  
  // endpoint for clearing old test data from db before starting tests
  app.route('/api/clear-test-data')
    .delete(function(req, res){
      stockDb.collection('likes').deleteMany({ stock: { $in: ["ZVZZT", "ZWZZT", "ZXZZT"]}})
        .catch(err => res.status(500).send(err.message))
        .then(r => res.send('Cleared test data!'))
    })
};
