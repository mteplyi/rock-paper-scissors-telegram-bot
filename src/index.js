require('dotenv/config');
const Telegraf = require('telegraf');
const Koa = require('koa');
const koaBody = require('koa-body');

const {
  HAND_CODES,
  STOP_CODE,
} = require('./constants');
const handleInlineQuery = require('./handlers/handleInlineQuery');
const handleChosenInlineResult = require('./handlers/handleChosenInlineResult');
const handleHandAction = require('./handlers/handleHandAction');
const handleStopAction = require('./handlers/handleStopAction');

const {
  NODE_ENV = 'development',
  BOT_TOKEN,
  PORT = 3040,
  WEBHOOK_ORIGIN,
  WEBHOOK_PATHNAME = '/',
} = process.env;

const bot = new Telegraf(BOT_TOKEN);
bot.options.username = 'rpsgbot';

if (NODE_ENV === 'development') {
  bot.use((ctx, next) => {
    console.log(ctx);
    return next();
  });
}
bot.on('inline_query', handleInlineQuery);
bot.on('chosen_inline_result', handleChosenInlineResult);
bot.action(HAND_CODES, handleHandAction);
bot.action(STOP_CODE, handleStopAction);
// bot.startWebhook(WEBHOOK_PATHNAME, null, PORT);

const app = new Koa();
app.use(koaBody());
app.use((ctx, next) => {
  console.log(ctx);
  if (ctx.method === 'POST' || ctx.url === WEBHOOK_PATHNAME) {
    return bot.handleUpdate(ctx.request.body, ctx.response);
  }
  if (ctx.method === 'GET' || ctx.url === '/_ah/warmup') {
    const webhookUrl = WEBHOOK_ORIGIN + WEBHOOK_PATHNAME;
    return bot.telegram.setWebhook(webhookUrl, null, 100);
  }
  return next();
});
app.listen(PORT);
