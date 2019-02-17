const {
  ROCK_CODE,
  PAPER_CODE,
  SCISSORS_CODE,
  STOP_CODE,
} = require('./constants');

const emojis = {
  [ROCK_CODE]: '\u{270A}',
  [PAPER_CODE]: '\u{270B}',
  [SCISSORS_CODE]: '\u{270C}',
  [STOP_CODE]: '\u{1F3C1}',
};

const gameReplyMarkup = {
  inline_keyboard: [
    [
      {
        text: emojis[ROCK_CODE],
        callback_data: ROCK_CODE,
      },
      {
        text: emojis[PAPER_CODE],
        callback_data: PAPER_CODE,
      },
      {
        text: emojis[SCISSORS_CODE],
        callback_data: SCISSORS_CODE,
      },
      {
        text: emojis[STOP_CODE],
        callback_data: STOP_CODE,
      },
    ],
  ],
};

const inlineQueryResults = [
  [
    {
      type: 'article',
      id: 0,
      title: 'Play',
      description: 'The Game',
      thumb_url: 'https://storage.googleapis.com/rgp/rps.jpg',
      input_message_content: { message_text: 'What`s your hand?' },
      reply_markup: gameReplyMarkup,
    },
  ],
  {
    // TODO: adjust cache_time before release
    cache_time: '0',
  },
];

const renderPlayers = (players, withFog) => players.map(
  withFog ? ({ id, name }) => `<b>?</b> <a href="tg://user?id=${id}">${name}</a>`
    : ({ id, name, hand }) => `${emojis[hand]} <a href="tg://user?id=${id}">${name}</a>`,
).join('\n');

const renderPendingGame = (players) => {
  let message = 'What`s your hand?';
  message += `\n${renderPlayers(players, true)}`;
  return [
    message,
    {
      parse_mode: 'HTML',
      reply_markup: gameReplyMarkup,
    },
  ];
};

const renderFinishedGame = (players) => {
  const usedHands = {};
  players.forEach(({ hand }) => { usedHands[hand] = true; });

  let message;
  if (Object.keys(usedHands).length === 2) {
    let winnerHand;
    let loserHand;
    if (usedHands[ROCK_CODE]) {
      if (usedHands[PAPER_CODE]) {
        winnerHand = PAPER_CODE;
        loserHand = ROCK_CODE;
      } else {
        winnerHand = ROCK_CODE;
        loserHand = SCISSORS_CODE;
      }
    } else {
      winnerHand = SCISSORS_CODE;
      loserHand = PAPER_CODE;
    }

    const winners = players.filter(({ hand }) => hand === winnerHand);
    const losers = players.filter(({ hand }) => hand === loserHand);

    message = `${winners.length === 1 ? 'Winner!' : 'Winners!'}\n`
      + `${renderPlayers(winners, false)}\n`
      + `${losers.length === 1 ? 'Loser...' : 'Losers...'}\n`
      + `${renderPlayers(losers, false)}`;
  } else {
    message = 'It`s a draw.';
    if (players.length) {
      message += `\n${renderPlayers(players)}`;
    }
  }

  return [message, { parse_mode: 'HTML' }];
};

module.exports = {
  rendered: {
    inlineQueryResults,
  },
  renderPendingGame,
  renderFinishedGame,
};
