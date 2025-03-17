const axios = require('axios');

module.exports = {
  name: "pinterest",
  description: "searching pics from pinterest",
  author: "developer",

  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      // Validate input: must include a dash separator between search term and number.
      if (args.length === 0) {
        return sendMessage(senderId, {
          text: "🖼️•Invalid format! Use the command like this:\n\npinterest [search term] - [number of images]\nExample: pinterest Llama - 10"
        }, pageAccessToken);
      }

      // Combine the args into one string and split by " - "
      const [searchTerm, count] = args.join(" ").split(" - ");

      if (!searchTerm || !count) {
        return sendMessage(senderId, {
          text: "🖼️•Invalid format! Use the command like this:\n\npinterest [search term] - [number of images]\nExample: pinterest Llama - 10"
        }, pageAccessToken);
      }

      // Parse the number of images and check that it’s within a valid range (1-10)
      const numOfImages = parseInt(count) || 5;
      if (isNaN(numOfImages) || numOfImages < 1 || numOfImages > 10) {
        return sendMessage(senderId, {
          text: "🖼️•Invalid number! Please enter a number of images between 1 and 10."
        }, pageAccessToken);
      }

      // Call the API – note that this uses the original endpoint.
      // If you prefer the new endpoint from the example, replace the URL accordingly.
      const apiUrl = `https://ccprojectapis.ddns.net/api/pin?title=${encodeURIComponent(searchTerm)}&count=${numOfImages}`;
      console.log(`Fetching data from API: ${apiUrl}`);
      const response = await axios.get(apiUrl);

      const data = response.data.data;
      if (!data || data.length === 0) {
        return sendMessage(senderId, { text: `No results found for "${searchTerm}".` }, pageAccessToken);
      }

      // Use the first numOfImages URLs provided by the API
      const imageUrls = data.slice(0, numOfImages);
      if (imageUrls.length === 0) {
        return sendMessage(senderId, { text: `No available images for "${searchTerm}".` }, pageAccessToken);
      }

      // Send each image URL as an attachment
      for (const url of imageUrls) {
        await sendMessage(senderId, {
          attachment: {
            type: "image",
            payload: { url }
          }
        }, pageAccessToken);
      }

    } catch (error) {
      console.error("Failed to retrieve images from Pinterest:", error);
      sendMessage(senderId, { text: `❌ Failed to retrieve images from Pinterest. Error: ${error.message || error}` }, pageAccessToken);
    }
  }
};