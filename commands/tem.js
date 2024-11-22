const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

const domains = ["rteet.com", "1secmail.com", "1secmail.org", "1secmail.net"];

module.exports = {
  name: 'tempx',
  description: 'tempmail create (generate email) & tempmail inbox your_email (to get code)',
  usage: 'tempmail create (to generate email) tempnmail inbox your_email (to get code)',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const [cmd, email] = args;
    if (cmd === 'create') {
      const domain = domains[Math.floor(Math.random() * domains.length)];
      return sendMessage(senderId, { text: `generated email ✉️: ${Math.random().toString(36).slice(2, 10)}@${domain}\n\nto get code\nexample: tempmail inbox meow@1secmail.com` }, pageAccessToken);
    }

    if (cmd === 'inbox' && email && domains.some(d => email.endsWith(`@${d}`))) {
      try {
        const [username, domain] = email.split('@');
        const inbox = (await axios.get(`https://mekumi-rest-api.onrender.com/api/secmailgen?=getMessages&login=${username}&domain=${domain}`)).data;
        if (!inbox.length) return sendMessage(senderId, { text: '❌ Inbox is empty please resend your email.' }, pageAccessToken);

        const { id, from, subject, date } = inbox[0];
        const { textBody } = (await axios.get(`https://mekumi-rest-api.onrender.com/api/secmailbox?q=${username}&domain=${domain}&id=${id}`)).data;
        return sendMessage(senderId, { text: `📬 | Tool Bot Inbox:\nFrom: ${from}\nSubject: ${subject}\nDate: ${date}\n\nContent:\n${textBody}` }, pageAccessToken);
      } catch {
        return sendMessage(senderId, { text: 'Error: Unable to fetch inbox or email content.' }, pageAccessToken);
      }
    }

    sendMessage(senderId, { text: 'Invalid usage. Use tempnmail create (to generate email) tempmail inbox your_email (to get code)' }, pageAccessToken);
  },
};