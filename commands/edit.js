const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "edit",
  aliases: ["editz"],
  description: "Edits an image using prompt and image URL",
  usage: "edit <prompt> (reply with image)",
  author: "Developer Rasin",
  category: "Image Generation",

  async execute(senderId, args, pageAccessToken, event) {
    const prompt = args.join(" ");
    if (!prompt) {
      return sendMessage(senderId, { text: "𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚙𝚛𝚘𝚖𝚙𝚝" }, pageAccessToken);
    }

    if (!event?.messageReply?.attachments?.length || event.messageReply.attachments[0].type !== "photo") {
      return sendMessage(senderId, { text: "𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚊𝚗 𝚒𝚖𝚊𝚐𝚎" }, pageAccessToken);
    }

    try {
      const imgUrl = event.messageReply.attachments[0].url;
      const apiUrl = `https://rasin-x-apis.onrender.com/api/rasin/edit?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(imgUrl)}`;

      const res = await axios.get(apiUrl);
      const imageUrl = res.data.img_url;

      if (!imageUrl) {
        return sendMessage(senderId, { text: "𝙽𝚘 𝚒𝚖𝚊𝚐𝚎 𝚛𝚎𝚝𝚞𝚛𝚗𝚎𝚍 😐" }, pageAccessToken);
      }

      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: { url: imageUrl }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error("Edit command error:", error.message);
      await sendMessage(senderId, { text: "𝙵𝚊𝚒𝚕𝚎𝚍 💔" }, pageAccessToken);
    }
  }
};
