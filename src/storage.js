require('dotenv/config');
/** @type {FirebaseFirestore.Firestore} */
const Firestore = require('@google-cloud/firestore');

const {
  GAE_APPLICATION,
  GOOGLE_APPLICATION_CREDENTIALS,
  GOOGLE_CLOUD_PROJECT,
} = process.env;

// Firestore.setLogFunction(console.log);
const firestore = GAE_APPLICATION
  ? new Firestore()
  : new Firestore({
    keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
    projectId: GOOGLE_CLOUD_PROJECT,
  });
const gamesRef = firestore.collection('games');

let batch = null;
/**
 * @returns {FirebaseFirestore.WriteBatch}
 */
const getBatch = () => {
  if (batch) {
    return batch;
  }
  batch = firestore.batch();
  // TODO: adjust timeout before release
  setTimeout(() => {
    batch.commit().then(console.log);
    batch = null;
  }, 1000);
  return batch;
};

const gamesCache = new Map();

module.exports = {
  gamesRef,
  getBatch,
  gamesCache,
};
