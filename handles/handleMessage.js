const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage');

// Load command modules
const commands = new Map();
const prefix = '-';

// Directory for storing image URLs
const imageFilePath = path.join(__dirname, '../data/image.json');

// Ensure the image.json file exists
if (!fs.existsSync(imageFilePath)) {
  fs.writeFileSync(imageFilePath, JSON.stringify({}), 'utf8');
}

fs.readdirSync(path.join(__dirname, '../commands'))
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const command = require(`../commands/${file}`);
    commands.set(command.name.toLowerCase(), command);
  });

/**
 * Handles incoming messages and stores image URLs if an image is sent.
 * @param {Object} event - The event object from the messaging platform.
 * @param {string} pageAccessToken - The page access token for sending messages.
 */
async function handleMessage(event, pageAccessToken) {
  const senderId = event?.sender?.id;
  if (!senderId) return console.error('Invalid event object');

  const messageText = event?.message?.text?.trim();
  const messageAttachments = event?.message?.attachments;

  if (!messageText && !messageAttachments) return console.log('Received event without message text or attachments');

  // Check if an image is included in the message
  if (messageAttachments && Array.isArray(messageAttachments)) {
    messageAttachments.forEach(attachment => {
      if (attachment.type === 'image' && attachment.payload && attachment.payload.url) {
        const imageUrl = attachment.payload.url;

        // Read the current data from image.json
        const imageData = JSON.parse(fs.readFileSync(imageFilePath, 'utf8')) || {};

        // Store the image URL with the sender ID as the key
        imageData[senderId] = imageUrl;

        // Write the updated data back to image.json
        fs.writeFileSync(imageFilePath, JSON.stringify(imageData, null, 2), 'utf8');

        console.log(`Stored image URL for user ${senderId}: ${imageUrl}`);
      }
    });
  }

  try {
    const [commandName, ...args] = messageText.startsWith(prefix)
      ? messageText.slice(prefix.length).split(' ')
      : messageText.split(' ');

    if (commands.has(commandName.toLowerCase())) {
      await commands.get(commandName.toLowerCase()).execute(senderId, args, pageAccessToken, sendMessage);
    } else {
      await commands.get('ai').execute(senderId, [messageText], pageAccessToken);
    }
  } catch (error) {
    console.error(`Error processing message:`, error);
    await sendMessage(senderId, { text: error.message || 'There was an error processing your request.' }, pageAccessToken);
  }
}

module.exports = { handleMessage };
