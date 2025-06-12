const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Helper to split long messages into chunks
function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = {
  name: 'aigf',
  description: 'Chat with Ai Girlfriend',
  usage: 'aigf <message>',
category: 'AI',

  author: 'Developer Rasin',

  async execute(senderId, args, pageAccessToken) {
    const query = args.join(' ');

    if (!query) {
      return sendMessage(senderId, {
        text: '𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗺𝗲𝘀𝘀𝗮𝗴𝗲'
      }, pageAccessToken);
    }

    try {
      const apiUrl = `https://rasin-x-apis.onrender.com/api/rasin/jeba-ai?message=${encodeURIComponent(query)}`;
      const { data } = await axios.get(apiUrl);

      if (!data.message) {
        return sendMessage(senderId, {
          text: '𝗡𝗼 𝗿𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗳𝗿𝗼𝗺 𝗔𝗜.'
        }, pageAccessToken);
      }

      const maxMessageLength = 2000;
      const messages = splitMessageIntoChunks(data.response, maxMessageLength);

      for (let i = 0; i < messages.length; i++) {
        await sendMessage(senderId, {
          text: i === 0 ? `${messages[i]}` : messages[i]
        }, pageAccessToken);
      }

    } catch (error) {
      console.error('aigf command error:', error.message);
      await sendMessage(senderId, {
        text: '𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗿𝗲𝗮𝗰𝗵 𝗔𝗣𝗜.'
      }, pageAccessToken);
    }
  }
};
