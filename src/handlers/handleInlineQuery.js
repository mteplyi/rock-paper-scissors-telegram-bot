const { inlineQueryResultsTemplate } = require('../templates');

module.exports = async (ctx) => {
  const [results, extra] = inlineQueryResultsTemplate();
  await ctx.answerInlineQuery(results, extra);
};
