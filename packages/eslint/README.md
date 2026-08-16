# @airdev/eslint

Shared ESLint rules for Airdev projects.

## Usage

```js
const airdevPlugin = require('@airdev/eslint');

module.exports = [
  {
    plugins: {
      airdev: airdevPlugin,
    },
    rules: {
      'airdev/no-negative-names': 'error',
      'airdev/no-specific-string': 'error',
      'airdev/next-require-export-default-function': 'error',
      'airdev/airent-no-raw-response': 'error',
    },
  },
];
```