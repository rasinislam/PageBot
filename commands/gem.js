const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: "cici",
  description: "cici command",
  author: "developer",

  async execute(senderId, args, pageAccessToken, event, imageUrl) {
    const userPrompt = args.join(" ");
    const repliedMessage = event.message.reply_to?.message || "";
    const finalPrompt = repliedMessage ? `${repliedMessage} ${userPrompt}`.trim() : userPrompt;

    if (!finalPrompt) {
      return sendMessage(senderId, { 
        text: "Please enter your question or reply with an image to analyze." 
      }, pageAccessToken);
    }

    try {
      // If imageUrl isn't provided, try to extract it from the event
      if (!imageUrl) {
        if (event.message.reply_to && event.message.reply_to.mid) {
          imageUrl = await getRepliedImage(event.message.reply_to.mid, pageAccessToken);
        } else if (event.message?.attachments && event.message.attachments[0]?.type === 'image') {
          imageUrl = event.message.attachments[0].payload.url;
        }
      }

      if (imageUrl) {
        const apiUrl = `https://kaiz-apis.gleeze.com/api/gemini-vision`;
        const response = await handleImageRecognition(apiUrl, finalPrompt, imageUrl, senderId);
        const result = response.response;
        const visionResponse = `${result}`;
        await sendConcatenatedMessage(senderId, visionResponse, pageAccessToken);
      } else {
        const apiUrl = `https://rest-api-french4.onrender.com/api/clarencev2`;
        const response = await axios.get(apiUrl, {
          params: {
            prompt: finalPrompt,
            uid: senderId
          }
        });
        const gptMessage = response.data.response;
        const gptResponse = `${gptMessage}`;
        await sendConcatenatedMessage(senderId, gptResponse, pageAccessToken);
      }
    } catch (error) {
      console.error("Error in AI command:", error);
      sendMessage(senderId, { text: `Error: ${error.message || "Something went wrong."}` }, pageAccessToken);
    }
  }
};

async function handleImageRecognition(apiUrl, prompt, imageUrl, senderId) {
  try {
    const { data } = await axios.get(apiUrl, {
      params: {
        q: prompt,
        uid: senderId,
        imageUrl: imageUrl || ""
      }
    });
    return data;
  } catch (error) {
    throw new Error("Failed to connect to the Gemini Vision API.");
  }
}

async function getRepliedImage(mid, pageAccessToken) {
  try {
    const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
      params: { access_token: pageAccessToken }
    });
    return data?.data[0]?.image_data?.url || "";
  } catch (error) {
    throw new Error("Failed to retrieve replied image.");
  }
}

async function sendConcatenatedMessage(senderId, text, pageAccessToken) {
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
}

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}