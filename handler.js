'use strict';
const dbConfig = require('./config/db')
const { Client } = require('pg')

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

module.exports.getDistrictsFor = (event, context, callback) => {

  const sql = 
  `
    SELECT id, geom, statefp, cd116fp, affgeoid, geoid, lsad, cdsessn, aland, awater
    FROM public.cb_2018_us_cd116_20m
    WHERE statefp = $1;
  `
  const client = new Client(dbConfig)
  client.connect()

  client
    .query(sql, [event.pathParameters.state_abbrev])
    .then((res) => {
      callback(null,{
        statusCode: 200,
        body: JSON.stringify(res)
      })
      client.end()
    })
    .catch((error) => {
      callback(null,{
        statusCode: error.statusCode || 500,
        body: `Could not find districts : ${error}`
      })
      client.end()
    })
}