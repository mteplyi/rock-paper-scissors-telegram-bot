const {
  gamesRef,
  getBatch,
  gamesCache,
} = require('../storage');
const templates = require('../templates');

module.exports = async (ctx) => {
  const {
    callbackQuery: {
      data: playerHand,
    },
    from: {
      id: playerId,
      username,
      first_name: firstName,
      last_name: lastName,
    },
  } = ctx;
  const gameKey = ctx.callbackQuery.inline_message_id
    || `${ctx.chat.id}-${ctx.callbackQuery.message.message_id}`;
  const playerName = username || (lastName ? `${firstName} ${lastName}` : firstName);

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

  // if (gamesCacheEntry.players.some(({ id }) => id === playerId)) {
  //   // TODO: adjust cache_time before release
  //   return ctx.answerCbQuery('You\'ve already Played This Game', false, { cache_time: 0 });
  // }

  gamesCacheEntry.players.push({
    id: playerId,
    name: playerName,
    hand: playerHand,
  });
  getBatch().set(gamesRef.doc(gameKey), { players: gamesCacheEntry.players });

  await ctx.editMessageText(...templates.renderPendingGame(gamesCacheEntry.players));
  return ctx.answerCbQuery();
};
