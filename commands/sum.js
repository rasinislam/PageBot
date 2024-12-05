const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'summarize',
  description: 'Summarizes the given text',
  usage: 'Summarize [text here]',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const text = args.join(' ');
    if (!text) {
      return sendMessage(senderId, { text: "Usage: summarize Your text here" }, pageAccessToken);
    }

    try {
      const response = await axios.get(`https://kaiz-apis.gleeze.com/api/summarize?text=${encodeURIComponent(text)}`);
      const summary = response.data.summary;

      const parts = [];
      for (let i = 0; i < summary.length; i += 1999) {
        parts.push(summary.substring(i, i + 1999));
      }

      for (const part of parts) {
        await sendMessage(senderId, { text: part }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'There was an error summarizing the content. Please try again later.' }, pageAccessToken);
    }
  }
};
