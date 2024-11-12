const axios = require('axios');

module.exports = {
  name: 'gpt4',
  description: 'Interact with GPT-4 based AI using the provided API',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userInput = args.join(' ').trim();

    if (!userInput) {
      return sendMessage(senderId, { text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 𝗪𝗵𝗮𝘁 𝗶𝘀 𝗮 𝗯𝗹𝗮𝗰𝗸 𝗵𝗼𝗹𝗲?' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⌛ 𝗔𝗜 𝗶𝘀 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗻𝗴 𝗮 𝗿𝗲𝘀𝗽𝗼𝗻𝘀𝗲, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const response = await axios.get('https://rest-api.joshuaapostol.site/gpt4o-v2', {
        params: { ask: userInput, id: '4' }
      });
      const resultData = response.data;
      const responseString = resultData.result ? resultData.result : 'No result found.';

      const formattedResponse = `
📦 𝗔𝗜 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲
━━━━━━━━━━━━━━━━━━
${responseString}
━━━━━━━━━━━━━━━━━━
      `;

      sendMessage(senderId, { text: formattedResponse.trim() }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: 'An error occurred while fetching the response.' }, pageAccessToken);
    }
  }
};
