const db = require('../db');
const { pendingGameTemplate } = require('../templates');

module.exports = async (ctx) => {
  const {
    callbackQuery: {
      data: hand,
      inline_message_id: inlineMessageId,
    },
    from: {
      id: userId,
      username,
      first_name: firstName,
      last_name: lastName,
    },
  } = ctx;
  const gameKey = inlineMessageId || `${ctx.chat.id}-${ctx.callbackQuery.message.message_id}`;
  const name = username || lastName ? `${firstName} ${lastName}` : firstName;
  const players = await db.putGamePlayer(gameKey, userId.toString(), name, hand);
  const [text, extra] = pendingGameTemplate(players);
  await ctx.editMessageText(text, extra);
};
