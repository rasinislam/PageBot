const axios = require('axios');

module.exports = {
  name: 'bible',
  description: 'fetch a random Bible verse!',
  author: 'Ali',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "⚙ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗕𝗶𝗯𝗹𝗲 𝘃𝗲𝗿𝘀𝗲..." }, pageAccessToken);

    try {
      const response = await axios.get('https://c-v1.onrender.com/bible');
      const verseData = response.data;

      const book = verseData.book;
      const chapter = verseData.chapter;
      const verse = verseData.verse;
      const text = verseData.text;

      if (!text || !book || !chapter || !verse) {
        return sendMessage(senderId, { text: "🥺 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮 𝗕𝗶𝗯𝗹𝗲 𝘃𝗲𝗿𝘀𝗲." }, pageAccessToken);
      }

      sendMessage(senderId, { 
        text: `📖 𝗥𝗮𝗻𝗱𝗼𝗺 𝗕𝗶𝗯𝗹𝗲 𝗩𝗲𝗿𝘀𝗲\n\n🕊️: "${text}"\n\n📚: ${book} ${chapter}:${verse}` 
      }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};
