const axios = require('axios');

module.exports = {
  name: 'poetry',
  description: 'Search for poems by title, author, or get a random poem.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // Extract the first argument as the type (title, author, or random)
    const type = args[0];
    // The remaining arguments are joined for the title or author
    const titleOrAuthor = args.slice(1).join(" ");

    if (!type || (type !== 'title' && type !== 'author' && type !== 'random')) {
      return sendMessage(senderId, { text: "Please provide a valid type: 'title', 'author', or 'random'." }, pageAccessToken);
    }

    if ((type === 'title' || type === 'author') && !titleOrAuthor) {
      return sendMessage(senderId, { text: `Please provide a ${type === 'title' ? 'title' : 'author'} to search for.` }, pageAccessToken);
    }

    try {
      // Construct the API URL based on the provided type
      const apiUrl = `https://jerome-web.onrender.com/service/api/poetry?type=${encodeURIComponent(type)}${titleOrAuthor ? `&titleorauthor=${encodeURIComponent(titleOrAuthor)}` : ''}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      // If there's an error or no data found
      if (data.error || !data.title) {
        return sendMessage(senderId, { text: `No poems found for the given ${type === 'random' ? 'request' : `${type}: ${titleOrAuthor}`}.` }, pageAccessToken);
      }

      // Construct the response message
      const { title, author, content } = data;
      const message = `📜 Poem\n\n📝 Title: ${title}\n\n👥 Author: ${author}\n\n📖 Content:\n${content}`;

      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching poetry data:', error);
      sendMessage(senderId, { text: "An error occurred while fetching poetry data." }, pageAccessToken);
    }
  }
};
