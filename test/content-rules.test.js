const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const noAirentRawResponseRule = require('../rules/no-airent-raw-response');
const noSpecificStringsRule = require('../rules/no-specific-strings');
const requireExportDefaultFunctionRule = require('../rules/require-export-default-function');
const {
  applyFix,
  instantiateRule,
  rangeOf,
} = require('./helpers/rule-test-utils');

test('no-specific-strings reports multiple matches and applies replacements', () => {
  const sourceText = 'target ok targetBar target';
  const filename = path.join('C:\\repo', 'src', 'example.js');
  const { listeners, reports } = instantiateRule(noSpecificStringsRule, {
    cwd: 'C:\\repo',
    filename,
    sourceText,
    options: [
      [
        {
          name: 'target',
          notFollowedBy: 'Bar',
          description: 'Use value instead.',
          replacement: 'value',
          includedFiles: ['src/**/*.js'],
        },
      ],
    ],
  });

  listeners.Program({ type: 'Program' });

  assert.equal(reports.length, 2);
  assert.equal(
    reports[0].message,
    'String "target" disallowed. Use value instead.'
  );
  assert.equal(applyFix(reports[0].fix, sourceText), 'value ok targetBar target');
  assert.deepStrictEqual(reports[0].loc, { line: 1, column: 0 });
});

test('no-specific-strings respects excluded and included file filters', () => {
  const sourceText = 'target';
  const excludedHarness = instantiateRule(noSpecificStringsRule, {
    cwd: 'C:\\repo',
    filename: path.join('C:\\repo', 'src', 'ignored.js'),
    sourceText,
    options: [
      [
        {
          name: 'target',
          excludedFiles: ['src/**/*.js'],
        },
      ],
    ],
  });
  const notIncludedHarness = instantiateRule(noSpecificStringsRule, {
    cwd: 'C:\\repo',
    filename: path.join('C:\\repo', 'src', 'ignored.js'),
    sourceText,
    options: [
      [
        {
          name: 'target',
          includedFiles: ['src/**/*.ts'],
        },
      ],
    ],
  });

  excludedHarness.listeners.Program({ type: 'Program' });
  notIncludedHarness.listeners.Program({ type: 'Program' });

  assert.equal(excludedHarness.reports.length, 0);
  assert.equal(notIncludedHarness.reports.length, 0);
});

test('no-specific-strings can report without a fixer', () => {
  const sourceText = 'target';
  const { listeners, reports } = instantiateRule(noSpecificStringsRule, {
    cwd: 'C:\\repo',
    filename: path.join('C:\\repo', 'src', 'example.js'),
    sourceText,
    options: [[{ name: 'target' }]],
  });

  listeners.Program({ type: 'Program' });

  assert.equal(reports.length, 1);
  assert.equal(reports[0].fix, undefined);
});

test('no-airent-raw-response returns no listeners without config or schema files', () => {
  const originalCwd = process.cwd();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'airdev-eslint-no-airent-'));

  process.chdir(tmpDir);

  try {
    const noConfigHarness = instantiateRule(noAirentRawResponseRule);
    assert.deepStrictEqual(noConfigHarness.listeners, {});

    fs.writeFileSync(
      path.join(tmpDir, 'airent.config.json'),
      JSON.stringify({ schemaPath: './missing-schema' }),
      'utf8'
    );

    const missingSchemaHarness = instantiateRule(noAirentRawResponseRule);
    assert.deepStrictEqual(missingSchemaHarness.listeners, {});
  } finally {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('no-airent-raw-response reports imports that match generated response types', () => {
  const originalCwd = process.cwd();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'airdev-eslint-airent-'));
  const schemaDir = path.join(tmpDir, 'schema');
  const sourceText =
    "import { UserProfileResponse, SafeType } from './types';\n";

  fs.mkdirSync(schemaDir, { recursive: true });
  fs.writeFileSync(
    path.join(tmpDir, 'airent.config.json'),
    JSON.stringify({ schemaPath: './schema' }),
    'utf8'
  );
  fs.writeFileSync(path.join(schemaDir, 'user-profile.ts'), 'export {};', 'utf8');

  process.chdir(tmpDir);

  try {
    const { listeners, reports } = instantiateRule(noAirentRawResponseRule, {
      sourceText,
    });
    const importedNode = {
      name: 'UserProfileResponse',
      range: rangeOf(sourceText, 'UserProfileResponse'),
    };

    listeners.ImportDeclaration({
      specifiers: [
        { imported: importedNode },
        {
          imported: { name: 'SafeType', range: rangeOf(sourceText, 'SafeType') },
        },
      ],
    });

    assert.equal(reports.length, 1);
    assert.equal(
      applyFix(reports[0].fix, sourceText),
      "import { SelectedUserProfileResponse, SafeType } from './types';\n"
    );
  } finally {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('require-export-default-function rewrites a named export function', () => {
  const sourceText = 'export function Sample() {}\n';
  const functionDeclaration = {
    type: 'FunctionDeclaration',
    text: 'function Sample() {}',
  };
  const exportNamedDeclaration = {
    type: 'ExportNamedDeclaration',
    declaration: functionDeclaration,
    range: [0, sourceText.length - 1],
  };
  const programNode = {
    type: 'Program',
    body: [exportNamedDeclaration],
    range: [0, sourceText.length],
  };
  const { listeners, reports } = instantiateRule(
    requireExportDefaultFunctionRule,
    {
      filename: 'C:\\repo\\src\\sample.js',
      sourceText,
    }
  );

  listeners.Program(programNode);

  assert.equal(reports.length, 1);
  assert.equal(
    applyFix(reports[0].fix, sourceText),
    'export default function Sample() {}\n'
  );
});

test('require-export-default-function can prefix a local function or insert a stub', () => {
  const functionSource = 'function Sample() {}\n';
  const functionNode = {
    type: 'FunctionDeclaration',
    range: [0, functionSource.length - 1],
  };
  const functionProgram = {
    type: 'Program',
    body: [functionNode],
    range: [0, functionSource.length],
  };
  const functionHarness = instantiateRule(requireExportDefaultFunctionRule, {
    filename: 'C:\\repo\\src\\sample.js',
    sourceText: functionSource,
  });

  functionHarness.listeners.Program(functionProgram);

  assert.equal(
    applyFix(functionHarness.reports[0].fix, functionSource),
    'export default function Sample() {}\n'
  );

  const stubSource = 'const value = 1;\n';
  const stubProgram = {
    type: 'Program',
    body: [{ type: 'VariableDeclaration', range: [0, stubSource.length - 1] }],
    range: [0, stubSource.length],
  };
  const stubHarness = instantiateRule(requireExportDefaultFunctionRule, {
    filename: 'C:\\repo\\src\\my-widget.js',
    sourceText: stubSource,
  });

  stubHarness.listeners.Program(stubProgram);

  assert.equal(
    applyFix(stubHarness.reports[0].fix, stubSource),
    'const value = 1;\n\nexport default function MyWidget() {}\n'
  );
});

test('require-export-default-function renames mismatched default exports and ignores valid ones', () => {
  const sourceText = 'export default function WrongName() {}\n';
  const declaration = {
    type: 'FunctionDeclaration',
    id: { name: 'WrongName' },
    text: 'function WrongName() {}',
    range: rangeOf(sourceText, 'function WrongName() {}'),
  };
  const invalidProgram = {
    type: 'Program',
    body: [
      {
        type: 'ExportDefaultDeclaration',
        declaration,
        range: [0, sourceText.length - 1],
      },
    ],
    range: [0, sourceText.length],
  };
  const invalidHarness = instantiateRule(requireExportDefaultFunctionRule, {
    filename: 'C:\\repo\\src\\my-page.js',
    sourceText,
  });

  invalidHarness.listeners.Program(invalidProgram);

  assert.equal(invalidHarness.reports.length, 1);
  assert.equal(
    applyFix(invalidHarness.reports[0].fix, sourceText),
    'export default function MyPage() {}\n'
  );

  const validHarness = instantiateRule(requireExportDefaultFunctionRule, {
    filename: 'C:\\repo\\src\\my-page.js',
    sourceText: 'export default function MyPage() {}\n',
  });
  validHarness.listeners.Program({
    type: 'Program',
    body: [
      {
        type: 'ExportDefaultDeclaration',
        declaration: {
          type: 'FunctionDeclaration',
          id: { name: 'MyPage' },
          text: 'function MyPage() {}',
          range: [15, 34],
        },
      },
    ],
    range: [0, 35],
  });

  assert.equal(validHarness.reports.length, 0);
});
