const ngrok = require('@expo/ngrok');
const fs = require('fs');

(async function() {
  try {
    const url = await ngrok.connect(5000);
    console.log('NGROK TUNNEL IS LIVE AT: ' + url);
    
    const apiPath = '../mobile/api.js';
    let apiContent = fs.readFileSync(apiPath, 'utf8');
    apiContent = apiContent.replace(/baseURL:\s*'.*'/, `baseURL: '${url}/api'`);
    fs.writeFileSync(apiPath, apiContent);
    
    console.log('✅ mobile/api.js has been updated automatically!');
    console.log('Keep this terminal open.');
  } catch (err) {
    console.error('Error starting ngrok:', err);
  }
})();
