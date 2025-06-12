const fs = require('fs');
const path = require('path');

module.exports = {
  name: "file",
  description: "Send source code of all commands",
  category: "system",
  async execute(senderId, args, pageAccessToken, event, sendMessage) {
    const commandDir = path.join(__dirname);

    try {
      const files = fs.readdirSync(commandDir).filter(file => file.endsWith('.js'));

      for (const file of files) {
        const filePath = path.join(commandDir, file);
        const code = fs.readFileSync(filePath, 'utf-8');

        // Limit to 2000 characters per message due to Messenger limits
        const chunks = splitByLength(code, 1800);
        for (const chunk of chunks) {
          await sendMessage(senderId, {
            text: `*${file}*\n\n` + '```js\n' + chunk + '\n```',
          }, pageAccessToken);
        }
      }
    } catch (err) {
      console.error("Meta command error:", err);
      await sendMessage(senderId, {
        text: "Failed to read commands.",
      }, pageAccessToken);
    }
  }
};

// Helper to split long code
function splitByLength(str, length) {
  const result = [];
  for (let i = 0; i < str.length; i += length) {
    result.push(str.slice(i, i + length));
  }
  return result;
}
