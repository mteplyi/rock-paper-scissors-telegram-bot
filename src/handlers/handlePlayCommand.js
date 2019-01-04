const { newGameTemplate } = require('../templates');

module.exports = async (ctx) => {
  const [text, extra] = newGameTemplate();
  await ctx.reply(text, extra);
};
