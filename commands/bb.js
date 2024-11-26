const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'blackbox',
  description: 'Interact Free GPT - OpenAI.',
  author: 'Arn',// api by kenlie

  async execute(senderId, args) {
    const pageAccessToken = token;
    const query = args.join(" ").toLowerCase();
    if (!query) {
      return await sendMessage(senderId, { text: "How can I help you?" }, pageAccessToken);
    }

    if (query === "hello" || query === "hi") {
      return await sendMessage(senderId, { text: "Hello! How can I help you?" }, pageAccessToken);
    }

    await handleChatResponse(senderId, query, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const apiUrl = "https://api.kenliejugarap.com/blackbox-gpt4o/?";

  try {
    const { data } = await axios.get(apiUrl, { params: { text: input } });
    let response = data.response;

    sendMessage(senderId, { text: 'Answering your question...' }, pageAccessToken);

    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
    const formattedResponse = `${response}`;

    await sendConcatenatedMessage(senderId, formattedResponse, pageAccessToken);
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