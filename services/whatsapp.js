const venom = require('venom-bot');

let client = null;

function initWhatsApp() {
  return new Promise((resolve, reject) => {
    venom
      .create(
        'shadowcast-session',
        (base64Qrimg, asciiQR, attempts, urlCode) => {
          console.log('🟡 Scan this QR to login to WhatsApp:');
          console.log(asciiQR);
        },
        (statusSession, session) => {
          console.log('📡 Status:', statusSession);
        },
        {
          headless: true, // ✅ Needed for server (Railway, VPS, etc)
          devtools: false,
          useChrome: true,
          debug: false,
          logQR: true,
          browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'], // ✅ Safe for sandboxed containers
        }
      )
      .then((_client) => {
        client = _client;
        console.log('✅ WhatsApp client initialized');
        resolve(client);
      })
      .catch((err) => {
        console.error('❌ Error initializing WhatsApp:', err);
        reject(err);
      });
  });
}

function getClient() {
  return client;
}

module.exports = { initWhatsApp, getClient };
