const {
  gamesRef,
  getBatch,
  gamesCache,
} = require('../storage');
const { renderFinishedGame } = require('../templates');

module.exports = async (ctx) => {
  const gameKey = ctx.callbackQuery.inline_message_id
    || `${ctx.chat.id}-${ctx.callbackQuery.message.message_id}`;

  let gamesCacheEntry = gamesCache.get(gameKey);

  if (!gamesCacheEntry) {
    const loading = gamesRef.doc(gameKey).get().then((gameSnapshot) => {
      gamesCacheEntry.players = gameSnapshot.exists && gameSnapshot.data().players || [];
      delete gamesCacheEntry.loading;
    });
    gamesCacheEntry = { loading };
    gamesCache.set(gameKey, gamesCacheEntry);
  }

  if (gamesCacheEntry.loading) {
    await gamesCacheEntry.loading;
  } else if (!gamesCacheEntry.players) {
    // TODO: adjust cache_time before release
    return ctx.answerCbQuery('This Game is Over', false, { cache_time: 0 });
  }

  getBatch().delete(gamesRef.doc(gameKey));

  await ctx.editMessageText(...renderFinishedGame(gamesCacheEntry.players));
  return ctx.answerCbQuery();
};
