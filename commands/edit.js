const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'edit',
  description: 'edit <prompt> (Reply to an image)',
  usage: 'edit <prompt>',
  author: 'The Bf of Nusrat',

  async execute(senderId, args, pageAccessToken, event) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, { text: '❌ Please provide a prompt to edit the image.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    // Log the whole event to check structure
    console.log(JSON.stringify(event, null, 2));

    const attachments = event?.message?.reply_to?.attachments;

    if (!attachments || attachments.length === 0 || attachments[0].type !== 'image') {
      await sendMessage(senderId, { text: '❌ Please reply to an image to edit it.' }, pageAccessToken);
      return;
    }

    const imageUrl = attachments[0].payload.url;

    const apiUrl = `https://rasin-x-apis.onrender.com/api/rasin/edit?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(imageUrl)}`;

    try {
      const response = await axios.get(apiUrl);
      const outputUrl = response.data?.img_url;

      if (!outputUrl) {
        await sendMessage(senderId, { text: '❌ Failed to generate edited image.' }, pageAccessToken);
        return;
      }

      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: { url: outputUrl }
        }
      }, pageAccessToken);

    } catch (err) {
      console.error('[EDIT CMD ERR]', err.message);
      await sendMessage(senderId, { text: '⚠️ Error: Something went wrong while editing the image.' }, pageAccessToken);
    }
  }
};
