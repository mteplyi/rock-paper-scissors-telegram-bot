const db = require('../db');
const { finishedGameTemplate } = require('../templates');

module.exports = async (ctx) => {
  const {
    callbackQuery: { inline_message_id: inlineMessageId },
  } = ctx;
  const gameKey = inlineMessageId || `${ctx.chat.id}-${ctx.callbackQuery.message.message_id}`;
  const players = await db.endGame(gameKey);
  const [text, extra] = finishedGameTemplate(players);
  await ctx.editMessageText(text, extra);
};
