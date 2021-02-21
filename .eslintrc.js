// .eslintrc.js
module.exports = {
  "extends": ["@verypossible/eslint-config/node"],
  "rules": {
    "no-magic-numbers": ["error", { "ignoreArrayIndexes": true }],
  },
  "overrides": [
    {
      "files": ["*.js"],
      "rules": {
        "no-magic-numbers": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
      }
    }
  ]
};
