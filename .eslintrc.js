module.exports = {
  extends: ['airbnb-base'],
  env: {
    es6: true,
    node: true,
  },
  rules: {
    'arrow-parens': ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    'newline-per-chained-call': 'off',
    'no-console': 'off',
    'no-plusplus': 'off',
  },
};
