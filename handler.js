'use strict';
const dbConfig = require('./config/db')
const { Client } = require('pg')

const hello = async (event) => {
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
  }
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
}

const getDistrictsFor = (event, context, callback) => {

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

      const response = {
        statusCode: 200,
        body: JSON.stringify(res.rows[0]['jsonb_build_object']),
      }

      res.setHeader('content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

      callback(null, response)

      client.end()
    })
    .catch((error) => {

      const errorResponse = {
        statusCode: error.statusCode || 500,
        body: `Could not find districts : ${error}`,
      }

      callback(null, errorResponse)

      client.end()
    })
}

module.exports = { hello, getDistrictsFor }