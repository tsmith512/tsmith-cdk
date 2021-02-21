// .eslintrc.js
module.exports = {
  "extends": ["@verypossible/eslint-config/node"],
  "rules": {
    "no-magic-numbers": ["error", { "ignoreArrayIndexes": true }],
  },
};
