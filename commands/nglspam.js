const axios = require('axios');

module.exports = {
  name: 'nglspam',
  description: 'nglspam <usn> <mess> <amount>.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const username = args[0];
    const amount = parseInt(args[args.length - 1], 10);
    const message = args.slice(1, args.length - 1).join(' ');

    if (!username || !message || isNaN(amount) || amount <= 0) {
      return sendMessage(senderId, { text: 'Usage: nglspam [username] [message] [amount]' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⚙️ Processing your request to send messages to NGL username...' }, pageAccessToken);

    for (let i = 0; i < amount; i++) {
      try {
        const response = await axios.get('https://rest-api.joshuaapostol.site/ngl-spam', {
          params: {
            username,
            message,
            deviceId: 'myDevice',
            amount: 1
          }
        });
        console.log('Response:', response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between requests
      }
    }

    sendMessage(senderId, { text: 'All messages successfully sent ✅.' }, pageAccessToken);
  }
};