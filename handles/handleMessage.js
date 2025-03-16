const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Added axios for HTTP requests
const { sendMessage } = require('./sendMessage');

const commands = new Map();
const lastImageByUser = new Map(); // Store the last image sent by each user
const lastVideoByUser = new Map(); // Store the last video sent by each user
const prefix = '-';

const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  commands.set(command.name.toLowerCase(), command);
}

async function handleMessage(event, pageAccessToken) {
  if (!event || !event.sender || !event.sender.id) {
    console.error('Invalid event object');
    return;
  }

  const senderId = event.sender.id;

  if (event.message && event.message.attachments) {
    const imageAttachment = event.message.attachments.find(att => att.type === 'image');
    const videoAttachment = event.message.attachments.find(att => att.type === 'video');

    if (imageAttachment) {
      lastImageByUser.set(senderId, imageAttachment.payload.url);
    }
    if (videoAttachment) {
      lastVideoByUser.set(senderId, videoAttachment.payload.url);
    }
  }

  if (event.message && event.message.text) {
    const messageText = event.message.text.trim().toLowerCase();

    

    // Handling "gemini" command
if (messageText.startsWith('cici')) {
  const lastImage = lastImageByUser.get(senderId); // Retrieve the last image sent by the user
  const args = messageText.split(/\s+/).slice(1); // Extract arguments from the command

  try {
    // Execute the "cici" command
    await commands.get('cici').execute(senderId, args, pageAccessToken, event, lastImage);

    // Clear the stored image after processing
    lastImageByUser.delete(senderId);
  } catch (error) {
    console.error('Error while processing the Gemini command:', error);
    // Send error feedback to the user
    await sendMessage(
      senderId, 
      { text: '❌ An error occurred while processing your Gemini request. Please try again later.' }, 
      pageAccessToken
    );
  }
  return;
}

    // Other command processing logic....    let commandName, args;
    if (messageText.startsWith(prefix)) {
      const argsArray = messageText.slice(prefix.length).split(' ');
      commandName = argsArray.shift().toLowerCase();
      args = argsArray;
    } else {
      const words = messageText.split(' ');
      commandName = words.shift().toLowerCase();
      args = words;
    }

    if (commands.has(commandName)) {
      const command = commands.get(commandName);
      try {
        await command.execute(senderId, args, pageAccessToken, sendMessage);
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        sendMessage(senderId, { text: `There was an error executing the command "${commandName}". Please try again later.` }, pageAccessToken);
      }
      return;
    }

    const aiCommand = commands.get('ai');
    if (aiCommand) {
      try {
        await aiCommand.execute(senderId, [messageText], pageAccessToken);
      } catch (error) {
        console.error('Error executing Ai command:', error);
        sendMessage(senderId, { text: 'There was an error processing your request.' }, pageAccessToken);
      }
    }
  } else if (event.message) {
    console.log('Received message without text');
  } else {
    console.log('Received event without message');
  }
}

module.exports = { handleMessage };

