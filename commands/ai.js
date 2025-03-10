const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "ai",
  description: "interact with gemini ai for text-based conversations.",
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const userMessage = args.join(" ").trim();

    if (!userMessage) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide a question for Gemini AI." },
        pageAccessToken
      );
    }

    try {


      const API_KEY = "AIzaSyCRgVWxdX2sY9b4NdnXGn5P91vDwSWdpQM"; // Replace with your actual API key
      const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

      // Send request to the API
      const response = await axios.post(API_URL, {
        contents: [{ role: "user", parts: [{ text: userMessage }] }]
      });

      const data = response.data;
      if (!response.data || !data.candidates || !data.candidates[0].content.parts[0].text) {
        throw new Error("No response from Gemini AI.");
      }

      // Extract response and format text
      let aiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1");

      // Send AI-generated response
      await sendConcatenatedMessage(senderId, aiResponse, pageAccessToken);
    } catch (error) {
      console.error("❌ Error in Gemini command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

// Helper function to send long messages in chunks
async function sendConcatenatedMessage(senderId, text, pageAccessToken) {
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
}

// Helper function to split long messages
function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}