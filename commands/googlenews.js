const axios = require('axios');

module.exports = {
  name: 'googlenews',
  description: 'search for the latest news in the Philippines.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchQuery = args.join(" ") || 'latest news in philippines';

    try {
      const apiUrl = `https://rest-api.joshuaapostol.site/googlenews?q=${encodeURIComponent(searchQuery)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.articles || data.articles.length === 0) {
        return sendMessage(senderId, { text: `No news found for the query: ${searchQuery}` }, pageAccessToken);
      }

      let message = '📰 Latest News:\n\n';
      data.articles.forEach((article, index) => {
        const { title, description, url } = article;
        message += `🔹 News ${index + 1}:\n`;
        message += `📄 Title: ${title}\n`;
        message += `📝 Description: ${description}\n`;
        message += `🔗 Read more: ${url}\n\n`;
      });

      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching Google News data:', error);
      sendMessage(senderId, { text: "An error occurred while fetching Google News data." }, pageAccessToken);
    }
  }
};
