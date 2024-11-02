const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'gemini',
  description: 'interact with Gemini 1.5 Flash Vision',
  author: 'developer',

  async execute(senderId, args, event) {
    const pageAccessToken = token;
    const userPrompt = args.join(" ").trim();
    let imageUrl = '';

    if (!userPrompt && !event.message?.attachments) {
      return await sendMessage(senderId, { 
        text: `❌ 𝗣𝗿𝗼𝘃𝗶𝗱𝗲𝗱 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻 𝗼𝗿 𝗶𝗺𝗮𝗴𝗲 𝗮𝗻𝗱 𝘁𝘆𝗽𝗲 𝘆𝗼𝘂𝗿 𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻 𝘁𝗼 𝗿𝗲𝗰𝗼𝗴𝗻𝗶𝘇𝗲...` 
      }, pageAccessToken);
    }

    try {
      if (!imageUrl) {
        if (event.message.reply_to && event.message.reply_to.mid) {
          imageUrl = await getRepliedImage(event.message.reply_to.mid, pageAccessToken);
        } else if (event.message?.attachments && event.message.attachments[0]?.type === 'image') {
          imageUrl = event.message.attachments[0].payload.url;
        }
      }

      const apiUrl = `https://joshweb.click/gemini`;
      const response = await handleImageRecognition(apiUrl, userPrompt, imageUrl);
      const result = response.gemini;

      const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
      const message = `━━━━━━━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${responseTime}`;

      await sendConcatenatedMessage(senderId, message, pageAccessToken);

    } catch (error) {
      console.error("❌ Error sorry user", error);
      await sendError(senderId, error.message || "Something went wrong.", pageAccessToken);
    }
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

  return data?.data?.[0]?.image_data?.url || "";
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
  const formattedMessage = `━━━━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};

