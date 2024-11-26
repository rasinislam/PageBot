const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'xnxxx',
  description: 'fetch a random video link',
  usage: 'RandomVideo',
  author: 'developer',

  execute: async (senderId) => {
    const pageAccessToken = token;
    const apiUrl = 'https://api.kenliejugarap.com/xnxx-random/';

    try {
      const { data } = await axios.get(apiUrl);

      if (data.status && data.url) {
        const videoMessage = {
          text: `Here is a random video link: ${data.url}`
        };

        sendMessage(senderId, videoMessage, pageAccessToken);
      } else {
        sendError(senderId, 'Error: Unable to fetch video.', pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      sendError(senderId, 'Error: Unexpected error occurred.', pageAccessToken);
    }
  },
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};
