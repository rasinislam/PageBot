const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

const SEARCH_URL = 'https://kaiz-apis.gleeze.com/api/ytsearch';
const DOWNLOAD_URL = 'https://api.zetsu.xyz/download/youtube';
const SEARCH_API_KEY = 'YOUR_APIKEY';
const DOWNLOAD_API_KEY = 'YOUR_APIKEY';

module.exports = {
    name: 'ytvideo',
    description: 'Searches for a YouTube video and provides download link.',
    usage: 'ytvideo <video name>',
    author: 'developer',

    async execute(senderId, args, pageAccessToken) {
        if (!args.length) {
            return sendMessage(senderId, { text: '❌ 𝗣𝗿𝗼𝘃𝗶𝗱𝗲 𝗾𝘂𝗲𝗿𝘆.' }, pageAccessToken);
        }

        await searchYouTubeVideo(senderId, args.join(' '), pageAccessToken);
    }
};

const searchYouTubeVideo = async (senderId, query, pageAccessToken) => {
    try {
        const searchRes = await axios.get(SEARCH_URL, {
            params: {
                q: query,
                apikey: SEARCH_API_KEY
            }
        });

        const video = searchRes.data?.items?.[0];
        if (!video) {
            return sendMessage(senderId, { text: '⚠️ No video found.' }, pageAccessToken);
        }

        const { title, url, thumbnail } = video;

        const downloadRes = await axios.get(DOWNLOAD_URL, {
            params: {
                url,
                apikey: DOWNLOAD_API_KEY
            }
        });

        const result = downloadRes.data?.result;
        const bestMedia = result?.medias?.find(m => m.ext === 'mp4') || result?.medias?.[0];

        if (!bestMedia?.url) {
            return sendMessage(senderId, { text: '⚠️ No valid video format found.' }, pageAccessToken);
        }

        // Send a template with video info
        await sendMessage(senderId, {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: [{
                        title: `🎬 ${result.title}`,
                        image_url: thumbnail,
                        subtitle: `Quality: ${bestMedia.label || 'Unknown'}\nDuration: ${result.duration || 'N/A'}`,
                        default_action: {
                            type: 'web_url',
                            url: url,
                            webview_height_ratio: 'tall'
                        }
                    }]
                }
            }
        }, pageAccessToken);

        // Send the actual video
        await sendMessage(senderId, {
            attachment: {
                type: 'video',
                payload: {
                    url: bestMedia.url,
                    is_reusable: true
                }
            }
        }, pageAccessToken);
    } catch (error) {
        console.error('Error fetching YouTube video:', error);
        sendMessage(senderId, { text: 'Error: Unexpected error occurred.' }, pageAccessToken);
    }
};