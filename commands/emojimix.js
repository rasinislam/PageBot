const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  // Metadata for the command
  name: 'emojimix',  // Command name
  description: 'Generate a mixed emoji image.', 
  usage: 'emojimix <emoji1> <emoji2>',
  author: 'Jessie Eradchenko', 

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if two emojis are provided
    if (!args || args.length < 2) {
      // Send message requesting two emojis if missing
      await sendMessage(senderId, {
        text: '❌ Please provide two emojis to mix. Example usage: emojimix 🐱 🐶'
      }, pageAccessToken);
      return;  
    }

    // Extract the two emojis
    const [emoji1, emoji2] = args;
    const apiUrl = `https://ccprojectapis.ddns.net/api/emojimix?one=${encodeURIComponent(emoji1)}&two=${encodeURIComponent(emoji2)}`;

    
    await sendMessage(senderId, { text: '⌛ Generating mixed emoji image... Please wait.' }, pageAccessToken);

    try {
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl 
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors during image generation
      console.error('Error generating EmojiMix image:', error);

      await sendMessage(senderId, {
        text: 'Sorry, something went wrong while generating the EmojiMix image. Please try again later.'
      }, pageAccessToken);
    }
  }
};
