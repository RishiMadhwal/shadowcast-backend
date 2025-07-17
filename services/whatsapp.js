const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');

const authFolder = path.join(__dirname, '..', 'tokens');
const authFile = path.join(authFolder, 'auth_info.json');

if (!fs.existsSync(authFolder)) {
  fs.mkdirSync(authFolder);
}

const { state, saveState } = useSingleFileAuthState(authFile);

let sock = null;

async function initWhatsApp() {
  return new Promise((resolve, reject) => {
    try {
      sock = makeWASocket({
        auth: state,
        printQRInTerminal: true, // auto print QR if login needed
      });

      sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          console.log('🟡 Scan this QR code to connect WhatsApp:');
          qrcode.generate(qr, { small: true });
        }

        if (connection === 'open') {
          console.log('✅ WhatsApp connection established');
          resolve(sock);
        }

        if (connection === 'close') {
          const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
          console.log('❌ Connection closed. Reconnect?', shouldReconnect);

          if (shouldReconnect) {
            initWhatsApp(); // try reconnecting
          } else {
            reject('User logged out from WhatsApp');
          }
        }
      });

      sock.ev.on('creds.update', saveState);
    } catch (error) {
      console.error('❌ Error in WhatsApp initialization:', error);
      reject(error);
    }
  });
}

function getClient() {
  return sock;
}

module.exports = { initWhatsApp, getClient };
