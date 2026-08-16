const os = require('os');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const noNegativeNamesRule = require('../rules/no-negative-names');
const noRelativeParentImportsRule = require('../rules/no-relative-parent-imports');
const noSpecificPathsRule = require('../rules/no-specific-paths');
const requireRelativeChildImportsRule = require('../rules/require-relative-child-imports');
const validateUseParamFromUrlRule = require('../rules/validate-use-param-from-url');
const {
  applyFix,
  instantiateRule,
  rangeOf,
} = require('./helpers/rule-test-utils');

test('no-negative-names reports and fixes negative identifiers', () => {
  const sourceText = 'const isNotReady = true;';
  const { listeners, reports } = instantiateRule(noNegativeNamesRule, {
    sourceText,
  });
  const identifier = {
    name: 'isNotReady',
    range: rangeOf(sourceText, 'isNotReady'),
  };

  listeners.VariableDeclarator({ id: identifier });

  assert.equal(reports.length, 1);
  assert.equal(reports[0].messageId, 'noNegativeVarName');
  assert.equal(reports[0].data.suggestion, 'isReady');
  assert.equal(applyFix(reports[0].fix, sourceText), 'const isReady = true;');
});

test('no-negative-names checks assignments and function nodes', () => {
  const { listeners, reports } = instantiateRule(noNegativeNamesRule);

  listeners.AssignmentExpression({
    left: { type: 'Identifier', name: 'doNotRun', range: [0, 8] },
  });
  listeners.FunctionDeclaration({
    id: { name: 'disallowFeature', range: [0, 15] },
  });
  listeners.FunctionExpression({
    id: { name: 'NoValue', range: [0, 7] },
  });
  listeners.ArrowFunctionExpression({
    id: { name: 'disableToggle', range: [0, 13] },
  });
  listeners.AssignmentExpression({
    left: { type: 'MemberExpression', name: 'ignoreMe', range: [0, 8] },
  });
  listeners.FunctionDeclaration({
    id: { name: 'allowFeature', range: [0, 12] },
  });

  assert.equal(reports.length, 4);
  assert.deepStrictEqual(
    reports.map((report) => report.data.suggestion),
    ['doRun', 'allowFeature', 'Value', 'enableToggle']
  );
});

test('no-relative-parent-imports rewrites parent imports to @ alias', () => {
  const cwd = path.join(os.tmpdir(), 'airdev-eslint');
  const filename = path.join(cwd, 'src', 'components', 'sample.js');
  const sourceText = "import shared from '../shared/item';\n";
  const { listeners, reports } = instantiateRule(noRelativeParentImportsRule, {
    cwd,
    filename,
    sourceText,
  });
  const literal = {
    value: '../shared/item',
    range: rangeOf(sourceText, "'../shared/item'"),
  };

  listeners.ImportDeclaration({ source: literal });

  assert.equal(reports.length, 1);
  assert.equal(
    applyFix(reports[0].fix, sourceText),
    "import shared from '@/shared/item';\n"
  );
});

test('no-relative-parent-imports ignores non-parent imports', () => {
  const { listeners, reports } = instantiateRule(noRelativeParentImportsRule);

  listeners.ImportDeclaration({
    source: { value: './local-item', range: [0, 13] },
  });

  assert.equal(reports.length, 0);
});

test('require-relative-child-imports rewrites same-directory and child imports', () => {
  const cwd = 'C:\\repo';
  const sameDirectoryFile = path.join(cwd, 'src', 'components', 'sample.js');
  const childFile = path.join(cwd, 'src', 'components', 'sample.js');

  const sameDirectorySource = "import Button from '@/components/button';\n";
  const sameDirectoryHarness = instantiateRule(
    requireRelativeChildImportsRule,
    {
      cwd,
      filename: sameDirectoryFile,
      sourceText: sameDirectorySource,
    }
  );
  sameDirectoryHarness.listeners.ImportDeclaration({
    source: {
      value: '@/components/button',
      range: rangeOf(sameDirectorySource, "'@/components/button'"),
    },
  });

  const childSource = "import Button from '@/components/child/button';\n";
  const childHarness = instantiateRule(requireRelativeChildImportsRule, {
    cwd,
    filename: childFile,
    sourceText: childSource,
  });
  childHarness.listeners.ImportDeclaration({
    source: {
      value: '@/components/child/button',
      range: rangeOf(childSource, "'@/components/child/button'"),
    },
  });

  assert.equal(sameDirectoryHarness.reports.length, 1);
  assert.equal(
    applyFix(sameDirectoryHarness.reports[0].fix, sameDirectorySource),
    "import Button from './button';\n"
  );
  assert.equal(childHarness.reports.length, 1);
  assert.equal(
    applyFix(childHarness.reports[0].fix, childSource),
    "import Button from './child/button';\n"
  );
});

test('require-relative-child-imports ignores parent and non-alias imports', () => {
  const cwd = 'C:\\repo';
  const filename = path.join(cwd, 'src', 'components', 'child', 'sample.js');
  const { listeners, reports } = instantiateRule(
    requireRelativeChildImportsRule,
    {
      cwd,
      filename,
    }
  );

  listeners.ImportDeclaration({
    source: { value: '@/components/button', range: [0, 20] },
  });
  listeners.ImportDeclaration({
    source: { value: './button', range: [0, 10] },
  });

  assert.equal(reports.length, 0);
});

test('no-specific-paths reports files under disallowed paths', () => {
  const disallowedPath = path.resolve('C:\\repo\\src\\generated');
  const { reports } = instantiateRule(noSpecificPathsRule, {
    filename: path.join(disallowedPath, 'file.js'),
    options: [[disallowedPath]],
  });

  assert.equal(reports.length, 1);
  assert.equal(
    reports[0].message,
    `Adding code to the paths ${disallowedPath} is not allowed.`
  );
});

test('no-specific-paths ignores empty options and allowed paths', () => {
  const emptyOptionsHarness = instantiateRule(noSpecificPathsRule, {
    options: [],
  });
  const allowedHarness = instantiateRule(noSpecificPathsRule, {
    filename: 'C:\\repo\\src\\feature\\file.js',
    options: [['C:\\repo\\src\\generated']],
  });

  assert.deepStrictEqual(emptyOptionsHarness.listeners, {});
  assert.equal(emptyOptionsHarness.reports.length, 0);
  assert.equal(allowedHarness.reports.length, 0);
});

test('validate-use-param-from-url reports files without route params', () => {
  const filename = path.join('C:\\repo', 'src', 'app', 'users', 'page.tsx');
  const { listeners, reports } = instantiateRule(validateUseParamFromUrlRule, {
    cwd: 'C:\\repo',
    filename,
  });

  listeners.CallExpression({
    callee: { name: 'useParamFromUrl' },
    arguments: [{ type: 'Literal', value: 'id', range: [0, 4] }],
  });

  assert.equal(reports.length, 1);
  assert.match(reports[0].message, /does not contain any param keys/);
});

test('validate-use-param-from-url fixes invalid route params and ignores valid calls', () => {
  const sourceText = "useParamFromUrl('slug');";
  const filename = path.join(
    'C:\\repo',
    'src',
    'app',
    'users',
    '[id]',
    'page.tsx'
  );
  const invalidHarness = instantiateRule(validateUseParamFromUrlRule, {
    cwd: 'C:\\repo',
    filename,
    sourceText,
  });
  const firstArgument = {
    type: 'Literal',
    value: 'slug',
    range: rangeOf(sourceText, "'slug'"),
  };

  invalidHarness.listeners.CallExpression({
    callee: { name: 'useParamFromUrl' },
    arguments: [firstArgument],
  });

  const validHarness = instantiateRule(validateUseParamFromUrlRule, {
    cwd: 'C:\\repo',
    filename,
  });
  validHarness.listeners.CallExpression({
    callee: { name: 'useParamFromUrl' },
    arguments: [{ type: 'Literal', value: 'id', range: [0, 4] }],
  });
  validHarness.listeners.CallExpression({
    callee: { name: 'someOtherHook' },
    arguments: [{ type: 'Literal', value: 'id', range: [0, 4] }],
  });

  assert.equal(invalidHarness.reports.length, 1);
  assert.equal(
    applyFix(invalidHarness.reports[0].fix, sourceText),
    "useParamFromUrl('id');"
  );
  assert.equal(validHarness.reports.length, 0);
});
