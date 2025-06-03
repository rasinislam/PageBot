const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'tempmail',
  description: 'Generate a temporary email or check inbox messages.',

  async execute(senderId, args, pageAccessToken) {
    try {
      const subCommand = args[0];
      const apiBase = 'https://smfahim.xyz/tempmail';

      if (subCommand === 'gen') {
        // Generate new temp email
        const { data } = await axios.get(apiBase);

        if (!data.email) {
          return sendMessage(senderId, {
            text: '𝗘𝗿𝗿𝗼𝗿: 𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗲 𝗲𝗺𝗮𝗶𝗹.'
          }, pageAccessToken);
        }

        const message = `📩 𝗘𝗺𝗮𝗶𝗹: ${data.email}\n\n🔎 𝗖𝗵𝗲𝗰𝗸 𝗶𝗻𝗯𝗼𝘅: temp inbox ${data.email}`;
        await sendMessage(senderId, { text: message }, pageAccessToken);

      } else if (subCommand === 'inbox') {
        const email = args[1];
        if (!email) {
          return sendMessage(senderId, {
            text: '𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮𝗻 𝗲𝗺𝗮𝗶𝗹 𝗮𝗱𝗱𝗿𝗲𝘀𝘀 𝘁𝗼 𝗰𝗵𝗲𝗰𝗸.'
          }, pageAccessToken);
        }

        const { data: messages } = await axios.get(`${apiBase}/inbox?email=${encodeURIComponent(email)}`);

        if (!messages || messages.length === 0) {
          return sendMessage(senderId, { text: '😢 𝗡𝗼 𝗺𝗲𝘀𝘀𝗮𝗴𝗲𝘀 𝗳𝗼𝘂𝗻𝗱 𝗳𝗼𝗿 𝘁𝗵𝗶𝘀 𝗲𝗺𝗮𝗶𝗹.' }, pageAccessToken);
        }

        let inboxText = '📬 𝗜𝗻𝗯𝗼𝘅:\n';
        messages.forEach((msg) => {
          inboxText += `\n📑 Title: ${msg.subject}\n✉️ Body: ${msg.body_text}\n----------------------------`;
        });

        await sendMessage(senderId, { text: inboxText }, pageAccessToken);

      } else {
        await sendMessage(senderId, {
          text: '𝗨𝘀𝗮𝗴𝗲:\n• temp gen\n• temp inbox <email>'
        }, pageAccessToken);
      }

    } catch (error) {
      console.error('Temp command error:', error.message);
      await sendMessage(senderId, {
        text: '𝗘𝗿𝗿𝗼𝗿: 𝗖𝗮𝗻’𝘁 𝗰𝗼𝗻𝗻𝗲𝗰𝘁 𝘁𝗼 𝗧𝗲𝗺𝗽𝗺𝗮𝗶𝗹 𝗔𝗣𝗜.'
      }, pageAccessToken);
    }
  }
};