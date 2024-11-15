const axios = require('axios');

module.exports = {
  name: 'tokengetter',
  description: 'tokengetter email | password',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const input = args.join(" ");
    const [username, password] = input.split(" | ");

    if (!username || !password) {
      return sendMessage(senderId, { text: "Usage: tokengetter <username> | <password>" }, pageAccessToken);
    }

    try {
      const apiUrl = `https://markdevs-last-api-2epw.onrender.com/api/token&cookie?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
      const response = await axios.get(apiUrl);

      const { access_token_eaad6v7, access_token, cookies } = response.data.data;

      const message = `
(⁠☆⁠▽⁠☆⁠) Generated Tokens and Cookie 🍪:

EAAD6V7 TOKEN: 
➜ ${access_token_eaad6v7}

EAAAAU TOKEN:
➜ ${access_token}

COOKIES:
➜ ${cookies}
`;

      sendMessage(senderId, { text: message }, pageAccessToken);

    } catch (error) {
      console.error('Error fetching tokens:', error);
      sendMessage(senderId, { text: "An error occurred while getting the token and cookie🍪\n\nnot all accounts can get tokens and cookies (new account recommended)" }, pageAccessToken);
    }
  }
};