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
  SELECT jsonb_build_object(
    'type', 'FeatureCollection',
    'features', jsonb_agg(features.feature)
  )
  FROM 
  (
    SELECT jsonb_build_object(
    'type', 'Feature',
    'geometry', ST_AsGeoJSON(geom,3)::jsonb,
    'properties', to_jsonb(inputs) - 'geom'
  ) AS feature
  FROM 
    (
      SELECT districts.*, states.stusps as state_abbrev, states.name as state_name
      FROM cb_2018_us_state_20m states
      JOIN cb_2018_us_cd116_20m districts on districts.statefp = states.statefp
      WHERE stusps = $1
    ) inputs
  ) features;
  `

  const client = new Client(dbConfig)
  client.connect()

  client
    .query(sql, [event.pathParameters.state_abbrev])
    .then((res) => {
      callback(null,{
        statusCode: 200,
        body: JSON.stringify(res.rows[0]['jsonb_build_object'])
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

module.exports.getTodo = (event, context, callback) => {
  
  const client = new Client(dbConfig)
  console.log('client', client)

  client.connect()

  console.log('client connect')

  const sql = `SELECT * FROM public.todo limit 1;`
  
  console.log('sql', sql)

  client
    .query(sql, null)
    .then((res) => {
      console.log('here1')
      callback(null,{
        statusCode: 200,
        body: JSON.stringify(res)
      })
      console.log('here2')
      client.end()
    })
    .catch((error) => {
      console.log('here3')
      callback(null,{
        statusCode: error.statusCode || 500,
        body: `Could not find districts : ${error}`
      })
      console.log('here4')
      client.end()
    })
  

}