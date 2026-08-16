const test = require('node:test');
const assert = require('node:assert/strict');

const plugin = require('../index');

test('plugin exports all rules', () => {
  assert.deepStrictEqual(
    Object.keys(plugin.rules).sort(),
    [
      'airent-no-raw-response',
      'next-require-export-default-function',
      'next-require-next-props',
      'next-validate-use-param-from-url',
      'no-negative-names',
      'no-relative-parent-imports',
      'no-specific-paths',
      'no-specific-string',
      'require-await',
      'require-relative-child-imports',
    ].sort()
  );
});
