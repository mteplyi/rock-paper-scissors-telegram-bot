require('dotenv/config');
const Telegraf = require('telegraf');

const {
  ROCK_CODE,
  PAPER_CODE,
  SCISSORS_CODE,
  STOP_CODE,
} = require('./constants');
const handlePlayCommand = require('./handlers/handlePlayCommand');
const handleHand = require('./handlers/handleHand');
const handleStop = require('./handlers/handleStop');
const handleInlineQuery = require('./handlers/handleInlineQuery');

console.log(process.env);

const {
  BOT_TOKEN,
  PORT = 3040,
  WEBHOOK_ORIGIN,
  WEBHOOK_PATHNAME = '/',
} = process.env;
if (!BOT_TOKEN) {
  throw new Error('Undefined BOT_TOKEN variable!');
}
if (!WEBHOOK_ORIGIN) {
  throw new Error('Undefined WEBHOOK_ORIGIN variable!');
}
if (WEBHOOK_PATHNAME[0] !== '/') {
  throw new Error('WEBHOOK_PATHNAME should begin with \'/\'');
}

const bot = new Telegraf(BOT_TOKEN);
bot.options.username = 'rpsgbot';

bot
// .use((ctx, next) => {
//   next();
// })
  .on('inline_query', handleInlineQuery)
  .command('play', handlePlayCommand)
  .action([ROCK_CODE, PAPER_CODE, SCISSORS_CODE], handleHand)
  .action(STOP_CODE, handleStop)
  .startWebhook(WEBHOOK_PATHNAME, null, PORT);

const webhookUrl = WEBHOOK_ORIGIN + WEBHOOK_PATHNAME;
bot.telegram.setWebhook(webhookUrl, null, 100)
  .catch((e) => {
    console.error(e);
  });
