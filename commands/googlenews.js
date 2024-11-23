const axios = require('axios');

module.exports = {
  name: 'googlenews',
  description: 'Search for the latest news in the Philippines.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      return sendMessage(senderId, { text: "Please provide a search query for the latest news." }, pageAccessToken);
    }

    try {
      const apiUrl = `https://rest-api.joshuaapostol.site/googlenews?q=${encodeURIComponent(searchQuery)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.status || !data.result || data.result.length === 0) {
        return sendMessage(senderId, { text: `No news found for the given query.` }, pageAccessToken);
      }

      // Prepare the response message with multiple results
      let message = `📰 Latest News Search Results :\n\n`;

      // Iterate over the results
      data.result.forEach((item, index) => {
        message += `🗞️ ${index + 1}. *${item.title}*\n🕒 Published: ${item.published}\n🔗 [Read More](${item.link})\n\n`;
      });

      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching Google News data:', error);
      sendMessage(senderId, { text: "An error occurred while fetching Google News data." }, pageAccessToken);
    }
  }
};
