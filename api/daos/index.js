var Mongoose = require('mongoose'), cfg = require('../config');
Mongoose.Promise = require('bluebird');
const winston = require('../config/winston');
var Connection = Mongoose.connection;
var model = require('./models');
var Grid = require('gridfs-stream');
var MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');
//var streamBuffers = require('stream-buffers');
//var StringDecoder = require('string_decoder').StringDecoder;

var db = Mongoose.connect(
  'mongodb://' + cfg.mongo.uri + ':' + cfg.mongo.port + '/' + cfg.mongo.db, {  })
  .then(
    () => {
      winston.info('connection with database succeeded');

    }
  )
  .catch(
    err => winston.error(err)
  );

var gfs;
//var decoder = new StringDecoder('utf8');

// Use connect method to connect to the server
MongoClient.connect('mongodb://' + cfg.mongo.uri + ':' + cfg.mongo.port, function (err, client) {
  console.log("Connected successfully to server");

  const db = client.db(cfg.mongo.db);
  gfs = Grid(db, mongo);


});



//var gfs = Grid(Mongoose.mongo.Db, Mongoose.mongo);
Mongoose.set('debug', true);

exports.checkIfExists = function (query, collectionName) {

  return new Promise(function (resolve, reject) {

    //var collSchema = new Schema({ any: Schema.Types.Mixed });
    //var coll = Mongoose.model(collectionName, collSchema);
    var coll = model.getModel(collectionName);
    coll.findOne(query, function (err, results) {

      if (err)
        reject(err)
      else
        resolve(results)


    })



  })

}

exports.findAggregate = function (collectionName, aggregateArray) {

  return new Promise(function (resolve, reject) {
    var coll = model.getModel(collectionName);
    coll.aggregate(aggregateArray).exec((err, aggVal) => {
      if (err) reject(err);
      resolve(aggVal)
    });

  })
}

exports.insert = function (doc, collectionName) {

  return new Promise(function (resolve, reject) {
    Connection.collection(collectionName).insertOne(doc).then(
      function (obj) {
        resolve(obj);
      }
    ).catch(function (err) {
      reject(err);
    });

  })


}


exports.getCollection = function (collectionName, options) {

  return new Promise(function (resolve, reject) {

    //var collSchema = new Schema({ any: Schema.Types.Mixed });
    //var coll = Mongoose.model(collectionName, collSchema);
    var coll = model.getModel(collectionName);

    coll.find({}, options, function (err, results) {

      if (err)
        reject(err)
      else
        resolve(results)

    })
    /*
    coll.find({}, function (err, results) {

      if (err)
        reject(err)
      else
        resolve(results)


    })
    */



  })

}

exports.db = db;