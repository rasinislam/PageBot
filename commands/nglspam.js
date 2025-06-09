const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'nglspam',
  description: 'send spam messages to ngl usn',
  usage: 'nglspam <username> | <amount> | <message>',
  async execute(senderId, args, pageAccessToken) {
    const input = args.join(' ').split('|').map(x => x.trim());

    if (input.length < 3) {
      return sendMessage(senderId, {
        text: '𝗘𝗿𝗿𝗼𝗿: 𝗠𝗶𝘀𝘀𝗶𝗻𝗴 𝗽𝗮𝗿𝗮𝗺𝗲𝘁𝗲𝗿𝘀.\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: nglspam <username> | <amount> | <message>'
      }, pageAccessToken);
    }

    const [username, amount, message] = input;

    const apiUrl = `https://mademoiselle-rest-apis.onrender.com/api/nglspam?username=${encodeURIComponent(username)}&amount=${encodeURIComponent(amount)}&message=${encodeURIComponent(message)}`;

    try {
      const { data } = await axios.get(apiUrl);

      if (data.error) {
        return sendMessage(senderId, {
          text: `𝗘𝗿𝗿𝗼𝗿: ${data.message}`
        }, pageAccessToken);
      }

      await sendMessage(senderId, {
        text: `✅ ${data.message}`
      }, pageAccessToken);

    } catch (error) {
      console.error('nglspam command error:', error.message);
      await sendMessage(senderId, {
        text: '𝗘𝗿𝗿𝗼𝗿: 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝘀𝗲𝗻𝗱 𝗿𝗲𝗾𝘂𝗲𝘀𝘁 𝘁𝗼 𝗡𝗚𝗟 𝗔𝗣𝗜.'
      }, pageAccessToken);
    }
  }
};