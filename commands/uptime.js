const os = require('os');

let botStartTime = Date.now();

module.exports = {
  name: 'uptime',
  description: 'Shows uptime and ping info',
  category: 'system',
  async execute(senderId, args, pageAccessToken, event, sendMessage) {
    const now = Date.now();
    const uptimeMs = now - botStartTime;
    const ping = now - event.timestamp;

    const seconds = Math.floor((uptimeMs / 1000) % 60);
    const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
    const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor((uptimeMs / (1000 * 60 * 60 * 24)) % 30);
    const months = Math.floor(uptimeMs / (1000 * 60 * 60 * 24 * 30));

    const msg = `
Bot Uptime:
${months} months, ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds

Ping: ${ping} ms
Platform: ${os.platform()}
Developer: Tasbiul Islam Rasin

✨ Stay connected with us ✨
`.trim();

    await sendMessage(senderId, { text: msg }, pageAccessToken);
  }
};
