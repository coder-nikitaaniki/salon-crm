const localtunnel = require('localtunnel');
const fs = require('fs');

(async () => {
  console.log('Starting reliable tunnel...');
  try {
    const tunnel = await localtunnel({ port: 5000 });
    console.log('\n=============================================');
    console.log('Tunnel is LIVE at: ' + tunnel.url);
    console.log('DO NOT CLOSE THIS TERMINAL!');
    console.log('=============================================\n');

    const apiPath = '../mobile/api.js';
    let apiContent = fs.readFileSync(apiPath, 'utf8');
    
    // Replace the baseURL line
    apiContent = apiContent.replace(/baseURL:\s*'.*'/, `baseURL: '${tunnel.url}/api'`);
    
    // Ensure Bypass header is there
    if (!apiContent.includes('Bypass-Tunnel-Reminder')) {
       apiContent = apiContent.replace("});", "  headers: { 'Bypass-Tunnel-Reminder': 'true' }\n});");
    }
    
    fs.writeFileSync(apiPath, apiContent);
    console.log('✅ mobile/api.js has been automatically updated!');
    console.log('👉 Now go to your Expo terminal, press "r" to reload, and test the app!');
    
    tunnel.on('close', () => {
      console.log('Tunnel closed.');
    });
  } catch (err) {
    console.error('Error starting tunnel:', err);
  }
})();
