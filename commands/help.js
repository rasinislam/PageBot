const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'help',
  description: 'Show available commands or details of one',
  category: 'system',
  author: 'Developer Rasin',
  execute(senderId, args, pageAccessToken) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    const allCommands = commandFiles.map(file => {
      const cmd = require(path.join(commandsDir, file));
      return {
        name: cmd.name,
        description: cmd.description || 'No description',
        category: cmd.category || '🙃',
        author: cmd.author || 'unknown',
        usage: cmd.usage || `${cmd.name}`
      };
    });

    const totalCommands = allCommands.length;

    // If specific command requested
    if (args[0] && args[0].toLowerCase() !== 'all') {
      const query = args[0].toLowerCase();
      const cmd = allCommands.find(c => c.name.toLowerCase() === query);

      if (!cmd) {
        return sendMessage(senderId, { text: `❌ No command found with name "${query}".` }, pageAccessToken);
      }

      const info = `𝗖𝗼𝗺𝗺𝗮𝗻𝗱: ${cmd.name}\n𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${cmd.description}\n𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${cmd.category}\n𝗔𝘂𝘁𝗵𝗼𝗿: ${cmd.author}\n𝗨𝘀𝗮𝗴𝗲: ${cmd.usage}`;
      return sendMessage(senderId, { text: info }, pageAccessToken);
    }

    // 🧠 Group commands by category
    const categories = {};
    for (const cmd of allCommands) {
      if (!categories[cmd.category]) {
        categories[cmd.category] = [];
      }
      categories[cmd.category].push(cmd.name);
    }

    // ✨ Emoji map
    const emojiMap = {
      'Ai': '🤖',
      'Fun': '🎉',
      'Image Gen': '🖼️',
      'Anime': '🌸',
      'Tools': '🛠️',
      'Music': '🎧',
      'Utilities': '📦',
      'Misc': '📁'
    };

    // 🧾 Build styled message
    let msg = `🛠️ 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀\n\n`;

    for (const [cat, cmds] of Object.entries(categories)) {
      const icon = emojiMap[cat] || '';
      msg += `╭─❍「 ${icon} ${cat} 」\n`;
      cmds.sort().forEach(cmd => {
        msg += `│ ➛ ${cmd}\n`;
      });
      msg += `╰─────────◊\n\n`;
    }

    msg += `» 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:〔 ${totalCommands} 〕\n`;
    msg += `» 𝖳𝗒𝗉𝖾 "help [name]" 𝗍𝗈 𝗌𝖾𝖾 𝗎𝗌𝖺𝗀𝖾.\n`;
    msg += `» 𝖥𝗈𝗋 𝖺𝗌𝗌𝗂𝗌𝗍𝖺𝗇𝖼𝖾, 𝗋𝖾𝖺𝖼𝗁 𝗈𝗎𝗍 𝗍𝗈 𝗱𝗲𝘃.`;

    return sendMessage(senderId, { text: msg }, pageAccessToken);
  }
};
