// services/whatsapp.js
const venom = require('venom-bot');

let client = null;

function initWhatsApp() {
  return new Promise((resolve, reject) => {
    venom
      .create({
        session: 'shadowcast-session',
      })
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
