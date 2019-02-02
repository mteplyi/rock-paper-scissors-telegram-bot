/** @type {FirebaseFirestore.Firestore} */
const Firestore = require('@google-cloud/firestore');

// Firestore.setLogFunction(console.log);

const db = new Firestore();

const gamesRef = db.collection('games');

const putGamePlayer = async (gameKey, playerId, name, hand) => {
  console.time('putGamePlayer');
  const playersRef = gamesRef.doc(gameKey).collection('players');
  await playersRef.doc(playerId).set({
    name,
    hand,
  });
  const playersQuerySnapshot = await playersRef.get();
  console.timeEnd('putGamePlayer');
  return playersQuerySnapshot.docs.map(
    (doc) => ({
      id: doc.id,
      ...doc.data(),
    }),
  );
};

const endGame = async (gameKey) => {
  console.time('endGame');
  const gameRef = gamesRef.doc(gameKey);
  const players = gameRef.collection('players').get().then(
    (playersQuerySnapshot) => playersQuerySnapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      }),
    ),
  );
  await gameRef.delete();
  console.timeEnd('endGame');
  return players;
};

module.exports = {
  putGamePlayer,
  endGame,
};
