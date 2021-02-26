'use strict';
const db = require('./db_connect');

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.getTodo = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('db', db)
  
  db.getById('todo', event.pathParameters.id)
    .then(res => {
      callback(null,{
        statusCode: 200,
        body: JSON.stringify(res)
      })
    })
    .catch(e => {
      callback(null,{
        statusCode: e.statusCode || 500,
        body: "Could not find Todo: " + e
      })
    })
};

module.exports.getDistrict = (event, context, callback) => {
  console.log('here1')
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('here2')
  console.log('event.pathParameters.id', event.pathParameters.id)
 
  db.getById('cb_2018_us_cd116_20m', event.pathParameters.id)
    .then(res => {
      console.log('here3')
      callback(null,{
        statusCode: 200,
        body: JSON.stringify(res)
      })
    })
    .catch(e => {
      console.log('here4')
      callback(null,{
        statusCode: e.statusCode || 500,
        body: "Could not find district : " + e
      })
    })
};

module.exports.getAllDistricts = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  db.getAll('cb_2018_us_cd116_20m')
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(res)
      })
    })
    .catch(e => {
      console.log(e);
      callback(null, {
        statusCode: e.statusCode || 500,
        body: 'Error: Could not find districts: ' + e
      })
    })
};
