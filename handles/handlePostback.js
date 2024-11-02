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
            text: `✨ 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 !! 𝘁𝗼 𝗠𝗖𝘃2 𝗕𝗼𝘁 𝗣𝗮𝗴𝗲 🤖
━━━━━━━━━━━━━━━━━━
✨ 𝗡𝗶𝗰𝗲 𝘁𝗼 𝗺𝗲𝗲𝘁 𝘆𝗼𝘂 𝘁𝗵𝗮𝗻𝗸 𝘆𝗼𝘂
𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 𝗮𝗻𝗱 𝗲𝗻𝗷𝗼𝘆𝗶𝗻𝗴 𝗼𝘂𝗿 𝗯𝗼𝘁 𝗽𝗮𝗴𝗲.\n\n𝗚𝘂𝗶𝗱𝗲:➜ 𝘁𝘆𝗽𝗲 "𝗵𝗲𝗹𝗽" 𝘁𝗼 𝘀𝗲𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗮𝗻𝗱 𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻.
━━━━━━━━━━━━━━━━━━
📆 𝗗𝗮𝘁𝗲 : ${responseTime}`,
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