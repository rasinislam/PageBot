const axios = require('axios');

module.exports = {
  name: 'vision',
  description: 'Interact with the Gemini AI using image and text inputs',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userInput = args.join(' ').trim();
    const imageUrl = 'https://files.catbox.moe/km22ta.jpg'; // Replace with the actual image URL you want to use

    if (!userInput) {
      return sendMessage(senderId, { text: '❌ Please provide your questions\n\nExample: What is this image about?' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⌛ Gemini is processing your request, please wait...' }, pageAccessToken);

    try {
      const response = await axios.get('https://appjonellccapis.zapto.org/api/gemini', {
        params: { ask: userInput, imgurl: imageUrl }
      });
      const data = response.data;
      const responseString = data.result ? data.result : 'No result found.';

      const formattedResponse = `
📦 Gemini AI Response
━━━━━━━━━━━━━━━━━━
${responseString}
━━━━━━━━━━━━━━━━━━
      `;

      sendMessage(senderId, { text: formattedResponse.trim() }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: 'An error occurred while processing your request.' }, pageAccessToken);
    }
  }
};
