const templates = require('../templates');

module.exports = (ctx) => {
  ctx.answerInlineQuery(...templates.rendered.inlineQueryResults);
};
