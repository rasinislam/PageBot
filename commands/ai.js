const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'ai',
  description: 'ask to gpt4o assistant.',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    const prompt = args.join(" ").trim();
    if (!prompt) {
      return await sendMessage(senderId, { text: `❌ 𝗣𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻` }, pageAccessToken);
    }

    await handleChatResponse(senderId, prompt, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const apiUrl = "https://appjonellccapis.zapto.org/api/gpt4o-v2";

  try {
    const { data } = await axios.get(apiUrl, { params: { prompt: input } });
    const result = data.response;

    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
    const formattedResponse = `${result}`;

    if (result.includes('TOOL_CALL: generateImage')) {
      const imageUrlMatch = result.match(/\!\[.*?\]\((https:\/\/.*?)\)/);

      if (imageUrlMatch && imageUrlMatch[1]) {
        const imageUrl = imageUrlMatch[1];
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: { url: imageUrl }
          }
        }, pageAccessToken);
      } else {
        await sendConcatenatedMessage(senderId, formattedResponse, pageAccessToken);
      }
    } else {
      await sendConcatenatedMessage(senderId, formattedResponse, pageAccessToken);
    }
  } catch (error) {
    console.error('Error while processing AI response:', error.message);
    await sendError(senderId, '❌ Ahh sh1t error again.', pageAccessToken);
  }
};

const sendConcatenatedMessage = async (senderId, text, pageAccessToken) => {
  const maxMessageLength = 2000;

  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);
    for (const message of messages) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text }, pageAccessToken);
  }
};

const splitMessageIntoChunks = (message, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
  const formattedMessage = `${errorMessage}`;

  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};