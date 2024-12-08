const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "faceswap",
  description: "Swap faces between two images",
  author: "developer",
  usage: "Reply to two images with 'faceswap' to swap their faces",

  async execute(senderId, args, pageAccessToken, images) {
    // Check if exactly two image URLs are provided
    if (!images || images.length !== 2) {
      return sendMessage(senderId, {
        text: `❌ Please send exactly two images first, then reply with 'faceswap' to swap their faces.`
      }, pageAccessToken);
    }

    const [targetImageUrl, sourceImageUrl] = images;

    // Notify the user that processing is in progress
    sendMessage(senderId, { text: "⌛ Swapping faces, please wait...." }, pageAccessToken);

    try {
      // Call the face swap API
      const response = await axios.get(
        `https://api.kenliejugarap.com/faceswap/?target=${encodeURIComponent(targetImageUrl)}&source=${encodeURIComponent(sourceImageUrl)}`
      );
      const processedImageURL = response.data.response;

      // Send the processed image back to the user
      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: processedImageURL
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error("❌ Error processing image:", error);
      await sendMessage(senderId, {
        text: `❌ An error occurred while processing the images. Please try again later.`
      }, pageAccessToken);
    }
  }
};
