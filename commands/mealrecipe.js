const axios = require('axios');

module.exports = {
  name: 'mealrecipe',
  description: 'Search for meal recipes.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      return sendMessage(senderId, { text: "Please provide a search query for a meal recipe." }, pageAccessToken);
    }

    try {
      const apiUrl = `https://jerome-web.onrender.com/service/api/meal-recipe?s=${encodeURIComponent(searchQuery)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.success) {
        return sendMessage(senderId, { text: `No recipes found for the query: ${searchQuery}` }, pageAccessToken);
      }

      const { title, ingredients, instructions } = data;
      const message = `🍽️ Meal Recipe\n\n🍴 Recipe: ${title}\n\n📋 Ingredients: ${ingredients.join(', ')}\n\n📝 Instructions: ${instructions}`;

      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching meal recipe data:', error);
      sendMessage(senderId, { text: "An error occurred while fetching meal recipe data." }, pageAccessToken);
    }
  }
};
