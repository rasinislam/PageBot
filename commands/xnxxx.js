const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'xnxxx', // Command name
  description: 'Fetches and sends a random video from the API.', // Description
  usage: 'randomXnxx', // Usage
  author: 'Ali', // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Notify user that the video is being fetched
    await sendMessage(senderId, { text: 'Fetching a random video... Please wait.' }, pageAccessToken);

    const apiUrl = 'https://api.kenliejugarap.com/xnxx-random/'; // API endpoint

    try {
      // Fetch random video data from the API
      const response = await axios.get(apiUrl);

      // Extract the video URL from the API response
      const videoUrl = response.data.url; // Ensure the API response contains a direct video URL

      if (!videoUrl) {
        // Notify the user if the video URL is missing
        await sendMessage(senderId, { text: 'No video URL found in the API response. Please try again later.' }, pageAccessToken);
        return;
      }

      // Send the video as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'video',
          payload: {
            url: videoUrl // URL of the video
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors
      console.error('Error fetching or sending video:', error);

      // Notify user of the error
      await sendMessage(senderId, {
        text: 'Sorry, an error occurred while fetching the video. Please try again later.'
      }, pageAccessToken);
    }
  }
};
