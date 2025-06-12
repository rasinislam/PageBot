const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'edit',
  description: 'Edit an image using AI with a text prompt.',
  author: 'Rasin',
  usage: 'reply to an image with "edit [your prompt]"',
  async execute(senderId, args, pageAccessToken, imageUrl) {
    const prompt = args.join(" ");
    
    if (!prompt) {
      return sendMessage(senderId, {
        text: '𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚙𝚛𝚘𝚖𝚙𝚝 𝚏𝚘𝚛 𝚎𝚍𝚒𝚝𝚒𝚗𝚐 𝚝𝚑𝚎 𝚒𝚖𝚊𝚐𝚎.\n\nExample: edit make it more colorful'
      }, pageAccessToken);
    }

    if (!imageUrl) {
      return sendMessage(senderId, {
        text: '𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊𝚗 𝚒𝚖𝚊𝚐𝚎 𝚠𝚒𝚝𝚑 𝚢𝚘𝚞𝚛 𝚎𝚍𝚒𝚝 𝚙𝚛𝚘𝚖𝚙𝚝.'
      }, pageAccessToken);
    }

    await sendMessage(senderId, {
      text: '⏳ 𝙴𝚍𝚒𝚝𝚒𝚗𝚐 𝚢𝚘𝚞𝚛 𝚒𝚖𝚊𝚐𝚎, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...'
    }, pageAccessToken);

    try {
      const apiUrl = `https://rasin-x-apis.onrender.com/api/rasin/edit?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(imageUrl)}`;
      
      const response = await axios.get(apiUrl, {
        validateStatus: function (status) {
          return status < 600; // Accept any status code less than 600
        }
      });
      
      console.log('API Response:', response.data);
      console.log('Status Code:', response.status);
      
      const editedImageUrl = response?.data?.img_url;

      if (!editedImageUrl) {
        throw new Error('𝙽𝚘 𝚒𝚖𝚊𝚐𝚎 𝚛𝚎𝚝𝚞𝚛𝚗𝚎𝚍 😐');
      }

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: editedImageUrl,
            is_reusable: true
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('❌ Error editing image:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '𝙵𝚊𝚒𝚕𝚎𝚍 💔 An error occurred while editing the image. Please try again later.'
      }, pageAccessToken);
    }
  }
};
