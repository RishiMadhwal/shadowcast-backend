const express = require('express');
const router = express.Router();
const { getClient } = require('../services/whatsapp');

router.get('/sync', async (req, res) => {
  try {
    const client = getClient();
    if (!client) return res.status(500).json({ message: 'WhatsApp client not ready' });

    const chats = await client.getAllChats();
    const groups = chats.filter(chat => chat.isGroup);

    res.json({ groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

module.exports = router;
