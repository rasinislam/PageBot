const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'jigsaw',
  description: 'Interact with Gemini by replying to a photo with a prompt.',
  usage: 'gemini <your prompt>',
  author: 'gemini',

  async execute(senderId, args, event) {
    const pageAccessToken = token;
    const prompt = args.join(" ").trim();

    // Check if a prompt is provided
    if (!prompt) {
      return sendError(senderId, 'Please provide a prompt when using this command.', pageAccessToken);
    }

    // Check if the message is a reply to a photo
    if (event.type !== "message_reply" || !event.messageReply.attachments[0] || event.messageReply.attachments[0].type !== "photo") {
      return sendError(senderId, 'Please reply to a photo with this command.', pageAccessToken);
    }

    // Get the image URL from the replied-to photo
    const url = encodeURIComponent(event.messageReply.attachments[0].url);
    
    // Process the Gemini API request
    await handleGeminiResponse(senderId, prompt, url, pageAccessToken);
  },
};

const handleGeminiResponse = async (senderId, prompt, url, pageAccessToken) => {
  const apiUrl = `https://joshweb.click/gemini?prompt=${encodeURIComponent(prompt)}&url=${url}`;

  try {
    const { data } = await axios.get(apiUrl);
    const responseText = data.gemini || 'No response from Gemini.';
    const formattedMessage = `👽 GEMINI\n━━━━━━━━━━━━━━━━━━\n${responseText}\n━━━━━━━━━━━━━━━━━━`;

    await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
  } catch (error) {
    console.error('Error reaching the Gemini API:', error);
    await sendError(senderId, 'An error occurred while processing your request.', pageAccessToken);
  }
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  const formattedMessage = `👽 GEMINI\n━━━━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━━━━`;
  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};
