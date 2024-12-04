const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'emojimix',  // Command name
  description: 'Generate a mixed emoji image.',  // Description
  usage: 'emojimix <emoji1> <emoji2>',  // Usage instructions
  author: 'Ali',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if two emojis are provided
    if (!args || args.length < 2) {
      // Send message requesting two emojis if missing
      await sendMessage(senderId, {
        text: 'Please provide two emojis to mix. Example usage: emojimix 🐱 🐶'
      }, pageAccessToken);
      return;  // Exit the function if insufficient arguments are provided
    }

    // Extract the two emojis
    const [emoji1, emoji2] = args;
    const apiUrl = `https://ccprojectapis.ddns.net/api/emojimix?one=${encodeURIComponent(emoji1)}&two=${encodeURIComponent(emoji2)}`;

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: 'Generating mixed emoji image... Please wait.' }, pageAccessToken);

    try {
      // Send the generated image to the user as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl  // URL of the generated image
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors during image generation
      console.error('Error generating EmojiMix image:', error);

      // Notify user of the error
      await sendMessage(senderId, {
        text: 'Sorry, something went wrong while generating the EmojiMix image. Please try again later.'
      }, pageAccessToken);
    }
  }
};
