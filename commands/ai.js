const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");
const fs = require("fs");

const token = fs.readFileSync("token.txt", "utf8");

module.exports = {
  name: "ai",
  description: "Interact with GPT-4 via CCProject API",
  author: "developer",

  async execute(senderId, args) {
    const pageAccessToken = token;
    const userPrompt = (args.join(" ") || "Hello").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: "Please provide a message for Cici Ai." },
        pageAccessToken
      );
    }

    await handleChatResponse(senderId, userPrompt, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const systemRole = "You are Cici Ai, an AI assistant.";
  const prompt = `${systemRole}\n${input}`;
  const apiUrl = `https://ccprojectapis.ddns.net/api/gpt4?ask=${encodeURIComponent(prompt)}&id=${encodeURIComponent(senderId)}`;

  try {
    const { data } = await axios.get(apiUrl);
    const responseText = data || "No response from the AI.";

    await sendConcatenatedMessage(senderId, responseText, pageAccessToken);
  } catch (error) {
    console.error("Error in GPT-4 CCProject command:", error);
    await sendError(senderId, "❌ Error: Something went wrong.", pageAccessToken);
  }
};

const sendConcatenatedMessage = async (senderId, text, pageAccessToken) => {
  const maxMessageLength = 2000;

  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);

    for (const message of messages) {
      await new Promise((resolve) => setTimeout(resolve, 500));
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
