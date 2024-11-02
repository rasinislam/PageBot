const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'gemini',
  description: 'Interact with Gemini 1.5 Flash Vision',
  author: 'developer',

  async execute(senderId, args, event, imageUrl) {
    const pageAccessToken = token;
    const userPrompt = args.join(" ");

    if (!userPrompt && !imageUrl) {
      return sendMessage(senderId, { 
        text: `❌ 𝗣𝗿𝗼𝘃𝗶𝗱𝗲𝗱 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻 𝗼𝗿 𝗶𝗺𝗮𝗴𝗲 𝗮𝗻𝗱 𝘁𝘆𝗽𝗲 𝘆𝗼𝘂𝗿 𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻 𝘁𝗼 𝗿𝗲𝗰𝗼𝗴𝗻𝗶𝘇𝗲...` 
      }, pageAccessToken);
    }

    await handleGeminiResponse(senderId, userPrompt, pageAccessToken, event, imageUrl);
  },
};

const handleGeminiResponse = async (senderId, userPrompt, pageAccessToken, event, imageUrl) => {
  sendMessage(senderId, { text: "⌛ 𝗔𝗻𝘀𝘄𝗲𝗿𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 𝗮 𝗺𝗼𝗺𝗲𝗻𝘁.." }, pageAccessToken);

  try {
    if (!imageUrl) {
      imageUrl = await fetchImageUrl(event, pageAccessToken);
    }

    const apiUrlGemini = `https://joshweb.click/gemini`;
    const apiUrlGpt4o = `https://appjonellccapis.zapto.org/api/gpt4o-v2`;

    const responseGemini = await handleImageRecognition(apiUrlGemini, userPrompt, imageUrl);
    const responseGpt4o = await handleImageRecognition(apiUrlGpt4o, userPrompt, imageUrl);

    const result = responseGpt4o.gemini || responseGemini.gemini;

    if (result.includes('TOOL_CALL: generateImage')) {
      const generatedImageUrl = extractImageUrl(result);
      if (generatedImageUrl) {
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: { url: generatedImageUrl }
          }
        }, pageAccessToken);
      }
    }

    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
    const message = formatGeminiMessage(result, responseTime);

    await sendConcatenatedMessage(senderId, message, pageAccessToken);

  } catch (error) {
    console.error("Error in Gemini command:", error);
    await sendError(senderId, `Error: ${error.message || "Something went wrong."}`, pageAccessToken);
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

const fetchImageUrl = async (event, pageAccessToken) => {
  if (event && event.message) {
    if (event.message.reply_to && event.message.reply_to.mid) {
      return await getRepliedImage(event.message.reply_to.mid, pageAccessToken);
    } else if (event.message.attachments && event.message.attachments[0]?.type === 'image') {
      return event.message.attachments[0].payload.url;
    }
  }
  return "";
};

const getRepliedImage = async (mid, pageAccessToken) => {
  const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
    params: { access_token: pageAccessToken }
  });

  return data?.data[0]?.image_data?.url || "";
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

const extractImageUrl = (result) => {
  const imageUrlMatch = result.match(/\!\[.*?\]\((https:\/\/.*?)\)/);
  return imageUrlMatch ? imageUrlMatch[1] : null;
};

const formatGeminiMessage = (result, responseTime) => (
  `𝗚𝗲𝗺𝗶𝗻𝗶 1.5 𝗙𝗹𝗮𝘀𝗵 𝗩𝗶𝘀𝗶𝗼𝗻 ♊\n━━━━━━━━━━━━━━━━━━
${result}━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${responseTime}`
);

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};
