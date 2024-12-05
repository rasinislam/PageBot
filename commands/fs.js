const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "fs",
  description: "AI-powered face swap tool",
  author: "developer",
  usage: "Send two pictures, reply to the base image with 'faceswap'",

  async execute(senderId, args, pageAccessToken, baseImageUrl, swapImageUrl) {
    // Check if both baseImageUrl and swapImageUrl are provided
    if (!baseImageUrl || !swapImageUrl) {
      return sendMessage(senderId, {
        text: `❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗯𝗼𝘁𝗵 𝗯𝗮𝘀𝗲 𝗮𝗻𝗱 𝘀𝘄𝗮𝗽 𝗶𝗺𝗮𝗴𝗲𝘀, 𝗮𝗻𝗱 𝗿𝗲𝗽𝗹𝘆 "𝗳𝗮𝗰𝗲𝘀𝘄𝗮𝗽" 𝘁𝗼 𝘁𝗵𝗲 𝗯𝗮𝘀𝗲 𝗶𝗺𝗮𝗴𝗲.`
      }, pageAccessToken);
    }

    // Notify the user that the face swap is in progress
    sendMessage(senderId, { text: "⌛ 𝗙𝗮𝗰𝗲 𝘀𝘄𝗮𝗽 𝗶𝗻 𝗽𝗿𝗼𝗴𝗿𝗲𝘀𝘀, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...." }, pageAccessToken);

    try {
      // Fetch the swapped image from the API
      const response = await axios.get(
        `https://kaiz-apis.gleeze.com/api/faceswap?baseUrl=${encodeURIComponent(baseImageUrl)}&swapUrl=${encodeURIComponent(swapImageUrl)}`
      );
      
      const swappedImageURL = response.data.response;

      // Send the swapped image URL back to the user
      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: swappedImageURL
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error("❌ Error during face swap:", error);
      await sendMessage(senderId, {
        text: `❌ An error occurred during the face swap. Please try again later.`
      }, pageAccessToken);
    }
  }
};
