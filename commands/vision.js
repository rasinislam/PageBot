const axios = require('axios');

module.exports = {
  name: 'pixtral',
  description: 'Interact with Pixtral AI for image analysis',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const imageUrl = args.join(' ').trim();

    if (!imageUrl) {
      return sendMessage(senderId, { text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗶𝗺𝗮𝗴𝗲 𝗨𝗥𝗟.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 𝗵𝘁𝘁𝗽𝘀://𝗲𝘅𝗮𝗺𝗽𝗹𝗲.𝗰𝗼𝗺/𝗶𝗺𝗮𝗴𝗲.𝗷𝗽𝗴' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⌛ 𝗣𝗶𝘅𝘁𝗿𝗮𝗹 𝗔𝗜 𝗮𝗻𝗮𝗹𝘆𝘇𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗶𝗺𝗮𝗴𝗲, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const response = await axios.get('https://api.kenliejugarap.com/pixtral-paid/', {
        params: {
          question: 'what is this image that i give',
          image_url: imageUrl
        }
      });

      const result = response.data;
      const responseString = result.answer ? result.answer : 'No analysis result found.';

      const formattedResponse = `
📷 𝗣𝗶𝘅𝘁𝗿𝗮𝗹 𝗔𝗜 𝗜𝗺𝗮𝗴𝗲 𝗔𝗻𝗮𝗹𝘆𝘀𝗶𝘀
━━━━━━━━━━━━━━━━━━
${responseString}
━━━━━━━━━━━━━━━━━━
      `;

      sendMessage(senderId, { text: formattedResponse.trim() }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: 'An error occurred while analyzing the image.' }, pageAccessToken);
    }
  }
};
