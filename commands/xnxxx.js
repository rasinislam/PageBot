const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'randomXnxx',
  description: 'Fetch and send a random video.',
  usage: 'ra',
  author: 'Ali',

  execute: async (senderId) => {
    const pageAccessToken = token;
    const apiUrl = 'https://api.kenliejugarap.com/xnxx-random/';

    try {
      const { data } = await axios.get(apiUrl);

      if (data.status && data.response && data.response.video_link) {
        const { title, duration, video_link: videoUrl, source } = data.response;

        // Send video
        const videoMessage = {
          attachment: {
            type: 'video',
            payload: { url: videoUrl }
          }
        };

        await sendMessage(senderId, videoMessage, pageAccessToken);

        // Send additional video details
        const detailsMessage = {
          text: `🎥 *Title*: ${title}\n⏱ *Duration*: ${duration}\n🔗 [Watch on Source](${source})`
        };

        await sendMessage(senderId, detailsMessage, pageAccessToken);
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
