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
          headless: true, // ✅ Required for deployment
          devtools: false,
          useChrome: false, // ✅ Force bundled Chromium (important)
          debug: false,
          logQR: true,
          browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'], // ✅ Safe for Railway
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
