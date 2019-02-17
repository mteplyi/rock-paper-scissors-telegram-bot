const {
  gamesRef,
  getBatch,
  gamesCache,
} = require('../storage');

module.exports = (ctx) => {
  const gameKey = ctx.chosenInlineResult.inline_message_id;
  if (!gamesCache.has(gameKey)) {
    const gameCacheEntry = { players: [] };
    gamesCache.set(gameKey, gameCacheEntry);
    console.log({ gameKey });
    getBatch().set(gamesRef.doc(gameKey), { players: [] });
  }
};
