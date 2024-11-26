const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'ra', // Command name
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

      // Extract the relevant details from the API response
      const { status, response: videoData } = response.data;

      if (!status || !videoData || !videoData.video_link) {
        // Notify the user if the response is invalid
        await sendMessage(senderId, { text: 'Failed to fetch video. Please try again later.' }, pageAccessToken);
        return;
      }

      const {
        title,
        duration,
        video_link: videoUrl,
        image,
        source,
      } = videoData;

      // Send the video along with details
      await sendMessage(senderId, {
        attachment: {
          type: 'video',
          payload: {
            url: videoUrl // URL of the video
          }
        }
      }, pageAccessToken);

      // Send additional details about the video
      await sendMessage(senderId, {
        text: `🎥 *Title*: ${title}\n⏱ *Duration*: ${duration}\n🔗 [Watch on Source](${source})`,
        messaging_type: 'RESPONSE'
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
