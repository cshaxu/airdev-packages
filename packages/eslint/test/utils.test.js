const test = require('node:test');
const assert = require('node:assert/strict');

const { toKebabCase, toPascalCase } = require('../utils/case');
const {
  getCwd,
  getFilename,
  getSourceCode,
} = require('../utils/context');

test('toKebabCase normalizes different naming styles', () => {
  assert.equal(toKebabCase('useParamFromUrl'), 'use-param-from-url');
  assert.equal(toKebabCase('already_snake case'), 'already-snake-case');
  assert.equal(toKebabCase('Multi--DashValue'), 'multi-dash-value');
});

test('toPascalCase normalizes different naming styles', () => {
  assert.equal(toPascalCase('user-profile'), 'UserProfile');
  assert.equal(toPascalCase('user_profile value'), 'UserProfileValue');
  assert.equal(toPascalCase('userProfileValue'), 'UserProfileValue');
});

test('context helpers prefer direct properties', () => {
  const sourceCode = { getText() {} };
  const context = {
    cwd: 'C:\\repo',
    filename: 'C:\\repo\\src\\file.js',
    sourceCode,
    getCwd() {
      throw new Error('should not call getCwd');
    },
    getFilename() {
      throw new Error('should not call getFilename');
    },
    getSourceCode() {
      throw new Error('should not call getSourceCode');
    },
  };

  assert.equal(getCwd(context), 'C:\\repo');
  assert.equal(getFilename(context), 'C:\\repo\\src\\file.js');
  assert.equal(getSourceCode(context), sourceCode);
});

test('context helpers fall back to methods', () => {
  const sourceCode = { getText() {} };
  const context = {
    getCwd() {
      return 'C:\\repo';
    },
    getFilename() {
      return 'C:\\repo\\src\\file.js';
    },
    getSourceCode() {
      return sourceCode;
    },
  };

  assert.equal(getCwd(context), 'C:\\repo');
  assert.equal(getFilename(context), 'C:\\repo\\src\\file.js');
  assert.equal(getSourceCode(context), sourceCode);
});
