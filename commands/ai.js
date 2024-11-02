const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: "ai",
  description: "interact to gemini 1.5 flash vision",
  author: "developer",

  async execute(senderId, args, event, imageUrl, pageAccessToken) {
    const userPrompt = (args.join(" ") || "Provide your question or description").trim();
    await handleGeminiResponse(senderId, userPrompt, pageAccessToken, event, imageUrl);
  },
};

const handleGeminiResponse = async (senderId, userPrompt, pageAccessToken, event, imageUrl) => {
  const apiUrl = `https://joshweb.click/gemini`;
  await sendMessage(senderId, { text: "⌛ Answering your question, please wait..." }, pageAccessToken);

  try {
    if (!imageUrl) {
      if (event.message.reply_to && event.message.reply_to.mid) {
        imageUrl = await getRepliedImage(event.message.reply_to.mid, pageAccessToken);
      } else if (event.message?.attachments && event.message.attachments[0]?.type === 'image') {
        imageUrl = event.message.attachments[0].payload.url;
      }
    }

    const response = await handleImageRecognition(apiUrl, userPrompt, imageUrl);
    const result = response.gemini;
    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
    const formattedMessage = `Gemini 1.5 Flash Vision ♊\n━━━━━━━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━━━━━━━\n⏰ Response Time: ${responseTime}`;

    await sendConcatenatedMessage(senderId, formattedMessage, pageAccessToken);
  } catch (error) {
    console.error("Error in Gemini command:", error);
    await sendError(senderId, error.message || "Something went wrong.", pageAccessToken);
  }
};

const handleImageRecognition = async (apiUrl, prompt, imageUrl) => {
  const { data } = await axios.get(apiUrl, {
    params: {
      prompt,
      url: imageUrl || ""
    }
  });
  return data;
};

const getRepliedImage = async (mid, pageAccessToken) => {
  const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
    params: { access_token: pageAccessToken }
  });

  if (data && data.data.length > 0 && data.data[0].image_data) {
    return data.data[0].image_data.url;
  } else {
    return "";
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
  const formattedMessage = `⁠(◍•ᴗ•◍) | Mocha Ai\n・───────────・\n${errorMessage}\n・──── >ᴗ< ─────・`;
  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};
