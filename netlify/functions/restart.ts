import fetch from 'node-fetch';
import { schedule } from '@netlify/functions';

const handler = async (event: any, context: any) => {
  await fetch(`https://api.render.com/v1/services/${process.env.RENDER_SERVICE_ID}/restart`, {
    method: 'POST',    
    headers:{
      'Accept': ' application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.RENDER_SERVICE_TOKEN
    },
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'OK'})
  };
}

exports.handler = schedule("*/15 * * * *", handler);
