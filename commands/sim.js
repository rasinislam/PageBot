const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'jeba',
  description: 'Chat with Jeba',
  category: 'Simsimi',
author: 'Developer Rasin',

  async execute(senderId, args, pageAccessToken, event, sendMessage) {
    const msg = args.join(' ').trim();

    try {
      // If just "jeba" no args, reply custom message
      if (!msg) {
        return sendMessage(senderId, { text: 'Hae babe bolo 🥹' }, pageAccessToken);
      }
      
      if (/^teach\s+.+=>.+/i.test(msg)) {
        const [, ask, reply] = msg.match(/^teach\s+(.+?)\s*=>\s*(.+)/i) || [];
        if (!ask || !reply) {
          return sendMessage(senderId, { text: 'Usage: jeba teach <ask> => <reply1, reply2, ...>' }, pageAccessToken);
        }

        const res = await axios.get('https://rasin-x-apis-main.onrender.com/api/rasin/jeba', {
          params: { ask, reply }
        });

        return sendMessage(senderId, { text: res.data.message || '' }, pageAccessToken);
      }

      if (/^list$/i.test(msg)) {
        const res = await axios.get('https://rasin-x-apis-main.onrender.com/api/rasin/jeba', {
          params: { count: true }
        });

        return sendMessage(senderId, { text: res.data.message || '' }, pageAccessToken);
      }

      const res = await axios.get('https://rasin-x-apis-main.onrender.com/api/rasin/jeba', {
        params: { msg }
      });

      return sendMessage(senderId, { text: res.data.response || '' }, pageAccessToken);
    } catch (err) {
      console.error('Jeba error:', err);
      return sendMessage(senderId, { text: 'Error occurred.' }, pageAccessToken);
    }
  }
};
