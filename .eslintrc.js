module.exports = {
  extends: ['airbnb-base'],
  env: {
    es6: true,
    node: true,
  },
  rules: {
    'arrow-parens': ['error', 'always'],
    'newline-per-chained-call': 'off',
    'no-console': 'off',
    'no-extra-parens': ['error', 'all'],
    'no-mixed-operators': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
  },
};
