const { sendMessage } = require('./sendMessage');

const handlePostback = (event, pageAccessToken) => {
  const sana = event.sender?.id;
  const allbobo = event.postback?.payload;

  // Get the current response time in Manila timezone
  const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

  if (sana && allbobo) {
    if (allbobo === 'GET_STARTED_PAYLOAD') {
      const combinedMessage = {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: `
🌟Hello, Welcome to Tool Bot Page 🤖🛠️\n

Here avail tool commands & usage:\n

🛠️ • nglspam - username message amount\n
      ex:       malik    hi      10
🛠️ • pinterest - cat - 10\n

🛠️ ° remini - send image first and type remini\n

🛠️ • tokengetter - email | password
     (new acc)\n

🛠️ • tempmail create (to generate email)
🛠️ • tempmail inbox your_email (to get code)

━━━━━━━━━━━━━━━━━━
📆 𝗗𝗮𝘁𝗲 : ${responseTime}
━━━━━━━━━━━━━━━━━━
`,
            buttons: [
              {
                type: "web_url",
                url: "ch4nyyy.vercel.app",
                title: "PRIVACY POLICY"
              }
            ]
          }
        },
        quick_replies: [
          {
            content_type: "text",
            title: "Help",
            payload: "HELP_PAYLOAD"
          }
        ]
      };

      sendMessage(sana, combinedMessage, pageAccessToken);

    } else {
      sendMessage(sana, { text: `You sent a postback with payload: ${allbobo}` }, pageAccessToken);
    }
  } else {
    console.error('Invalid postback event data');
  }
};

module.exports = { handlePostback };



