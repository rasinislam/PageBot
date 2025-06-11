const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'help',
  description: 'Show all available commands',
  author: 'developer',
  execute(senderId, args, pageAccessToken) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    // Parse all commands with category
    const commands = commandFiles.map(file => {
      const command = require(path.join(commandsDir, file));
      return {
        name: command.name,
        description: command.description || '',
        category: command.category || 'Misc'
      };
    });

    // Group commands by category
    const grouped = {};
    for (const cmd of commands) {
      const category = cmd.category;
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(cmd.name);
    }

    const totalCommands = commands.length;

    // Format final string
    let output = `🛠️ 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀\n\n`;

    for (const category in grouped) {
      const list = grouped[category].map(cmd => `│ ➛ ${cmd}`).join('\n');
      output += `╭─❍「 ${category} 」\n${list}\n╰─────────◊\n\n`;
    }

    output += `» 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:〔 ${totalCommands} 〕\n» 𝖳𝗒𝗉𝖾 "𝗁𝖾𝗅𝗉 [𝖼𝗈𝗆𝗆𝖺𝗇𝖽]" 𝗍𝗈 𝗌𝖾𝖾 𝗎𝗌𝖺𝗀𝖾.\n» 𝖥𝗈𝗋 𝗌𝗎𝗉𝗉𝗈𝗋𝗍, 𝗍𝗮𝗅𝗄 𝗍𝗈 𝗍𝗁𝖾 𝗗𝗲𝘃.`;

    return sendMessage(senderId, { text: output }, pageAccessToken);
  }
};
