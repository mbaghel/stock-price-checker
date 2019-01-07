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

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      res.send(req.query.stock)
      /*const stock = req.query.stock.toUpperCase();
      const likeBool = req.query.like; 
    
      // start fetching price
      const price = await iex.request(`stock/${stock}/price`);
      if (!price || typeof price == 'string') return res.status(400).send(price);
      
      // increment likes if like===true and ip has not already liked stock
      if (likeBool) {
        let ip = req.ip;
        // accept ipV6 and ipV4 ips
        if (ip.slice(0, 7) === '::ffff:') ip = ip.slice(7);
        // check if ip already liked stock
        const likeCount = await stockDb.collection('likes').count({ $and: [{stock: stock}, { ips: ip }] })
        if (likeCount < 1) {
          await stockDb.collection('likes').updateOne({ stock: stock }, { $inc: { likes: 1 }, $push: { ips: ip } }, {upsert: true})
        } 
      }
      
      // fetch and await price
      const likeRes = await stockDb.collection('likes').findOne({ stock: stock }, {fields: {likes: 1, _id: 0}})
     
      
      const likes = likeRes ? likeRes.likes : 0;
      
      
      const stockData = {
        stock,
        price: price.toFixed(2),
        likes
      }
      res.send(stockData);*/
    });
    
};
