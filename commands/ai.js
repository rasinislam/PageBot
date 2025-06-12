const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");
const fs = require("fs");
const token = fs.readFileSync("token.txt", "utf8");

const fontMapping = {
  'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
  'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
  'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
  'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
  'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
  'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
  'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
  'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇'
};

function convertToBold(text) {
  return text.replace(/\*\*(.*?)\*\*/g, (_, boldText) =>
    [...boldText].map(char => fontMapping[char] || char).join('')
  );
}

module.exports = {
  name: "ai",
  description: "Chat with GPT-4  API",
  category: 'AI',
  author: "Developer Rasin",

  async execute(senderId, args) {
    const pageAccessToken = token;
    const userPrompt = (args.join(" ") || "").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: "𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗾𝘂𝗲𝗿𝘆" },
        pageAccessToken
      );
    }

    await handleRapidoChat(senderId, userPrompt, pageAccessToken);
  },
};

const handleRapidoChat = async (senderId, input, pageAccessToken) => {
  const apiUrl = `https://rasin-x-apis.onrender.com/api/rasin/gpt4.1?message=${encodeURIComponent(input)}`;

  try {
    const { data } = await axios.get(apiUrl);
    const responseText = data?.message || "𝗡𝗼 𝗿𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗳𝗿𝗼𝗺 𝗚𝗣𝗧-𝟰";

    const formattedText = convertToBold(`🤭 | GPT-4.1\n─────────────\n${responseText}\n─────────────`);
    await sendConcatenatedMessage(senderId, formattedText, pageAccessToken);

  } catch (error) {
    console.error("Error in gptt command:", error.message);
    await sendError(senderId, "❌ 𝗘𝗿𝗿𝗼𝗿: 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗿𝗲𝗮𝗰𝗵 𝘁𝗵𝗲 𝗚𝗣𝗧-𝟰 𝗔𝗣𝗜.", pageAccessToken);
  }
};

const sendConcatenatedMessage = async (senderId, text, pageAccessToken) => {
  const maxMessageLength = 2000;

  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);

    for (const message of messages) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text }, pageAccessToken);
  }
};

const splitMessageIntoChunks = (message, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};
