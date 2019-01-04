const {
  ROCK_CODE,
  PAPER_CODE,
  SCISSORS_CODE,
  STOP_CODE,
} = require('./constants');

const getEmoji = (code) => {
  switch (code) {
    case ROCK_CODE:
      return '\u{270A}';
    case PAPER_CODE:
      return '\u{270B}';
    case SCISSORS_CODE:
      return '\u{270C}';
    case STOP_CODE:
      return '\u{1F3C1}';
    default:
      return null;
  }
};

const replyMarkup = () => ({
  inline_keyboard: [
    [
      {
        text: getEmoji(ROCK_CODE),
        callback_data: ROCK_CODE,
      },
      {
        text: getEmoji(SCISSORS_CODE),
        callback_data: SCISSORS_CODE,
      },
      {
        text: getEmoji(PAPER_CODE),
        callback_data: PAPER_CODE,
      },
      {
        text: getEmoji(STOP_CODE),
        callback_data: STOP_CODE,
      },
    ],
  ],
});

const playerList = (players, withFog) => players.map(
  withFog
    ? ({ id, name }) => `? <a href="tg://user?id=${id}">${name}</a>`
    : ({ id, name, hand }) => `${getEmoji(hand)} <a href="tg://user?id=${id}">${name}</a>`,
).join('\n');

const inlineQueryResultsTemplate = () => [
  [
    {
      type: 'article',
      id: Math.random().toString(),
      title: 'title',
      description: 'description',
      input_message_content: { message_text: 'What`s your hand?' },
      reply_markup: replyMarkup(),
    },
  ],
  {
    cache_time: '0',
  },
];

const newGameTemplate = () => ['What`s your hand?', { reply_markup: replyMarkup() }];

const pendingGameTemplate = (players) => {
  let message = 'What`s your hand?';
  if (players.length) {
    message += `\n${playerList(players, false)}`;
  }
  return [
    message,
    {
      parse_mode: 'HTML',
      reply_markup: replyMarkup(),
    },
  ];
};

const finishedGameTemplate = (players) => {
  const involvedHands = {};
  players.forEach(({ hand }) => {
    involvedHands[hand] = true;
  });

  let message;
  if (Object.keys(involvedHands).length === 2) {
    let winners;
    let losers;
    if (involvedHands[ROCK_CODE]) {
      if (involvedHands[PAPER_CODE]) {
        winners = players.filter(({ hand }) => hand === PAPER_CODE);
        losers = players.filter(({ hand }) => hand === ROCK_CODE);
      } else {
        winners = players.filter(({ hand }) => hand === ROCK_CODE);
        losers = players.filter(({ hand }) => hand === SCISSORS_CODE);
      }
    } else {
      winners = players.filter(({ hand }) => hand === SCISSORS_CODE);
      losers = players.filter(({ hand }) => hand === PAPER_CODE);
    }

    message = `${winners.length === 1 ? 'Winner!' : 'Winners!'}\n`
      + `${playerList(winners, false)}\n`
      + `${losers.length === 1 ? 'Loser...' : 'Losers...'}\n`
      + `${playerList(losers, false)}`;
  } else {
    message = 'It`s a draw.';
    if (players.length) {
      message += `\n${playerList(players, false)}`;
    }
  }

  return [message, { parse_mode: 'HTML' }];
};

module.exports = {
  inlineQueryResultsTemplate,
  newGameTemplate,
  pendingGameTemplate,
  finishedGameTemplate,
};
