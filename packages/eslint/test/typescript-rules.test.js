const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const requireAwaitRule = require('../rules/require-await');
const requireNextPropsRule = require('../rules/require-next-props');
const {
  getFixOperations,
  instantiateRule,
} = require('./helpers/rule-test-utils');

function createTypeReference(name, params = [], text = name, range = [0, text.length]) {
  const node = {
    type: 'TSTypeReference',
    typeName: { name },
    text,
    range,
  };

  if (params.length > 0) {
    node.typeParameters = { params };
  }

  return node;
}

function createParam(name, paramType, range = [0, 5]) {
  return {
    type: 'Identifier',
    name,
    range,
    typeAnnotation: paramType
      ? {
          typeAnnotation: paramType,
        }
      : undefined,
  };
}

function createDefaultExportFunction({
  name = 'Page',
  params = [],
  async = false,
  declarationRange = [15, 40],
}) {
  return {
    type: 'ExportDefaultDeclaration',
    declaration: {
      type: 'FunctionDeclaration',
      id: { name },
      params,
      async,
      range: declarationRange,
      text: `function ${name}() {}`,
    },
    range: [0, declarationRange[1]],
  };
}

test('require-await returns no listeners without parser services', () => {
  const { listeners } = instantiateRule(requireAwaitRule);

  assert.deepStrictEqual(listeners, {});
});

test('require-await reports async returns that produce promises', () => {
  const promiseArgument = { type: 'CallExpression', range: [7, 14] };
  const parserServices = {
    program: {
      getTypeChecker() {
        return {
          getTypeAtLocation() {
            return 'Promise<string>';
          },
          typeToString(type) {
            return type;
          },
        };
      },
    },
    esTreeNodeToTSNodeMap: new Map([[promiseArgument, { kind: 'promise' }]]),
  };
  const { listeners, reports } = instantiateRule(requireAwaitRule, {
    parserServices,
  });
  const returnNode = {
    argument: promiseArgument,
    parent: {
      type: 'BlockStatement',
      parent: { async: true },
    },
  };

  listeners.ReturnStatement(returnNode);

  assert.equal(reports.length, 1);
  assert.deepStrictEqual(getFixOperations(reports[0].fix), [
    { start: 7, end: 7, text: 'await ' },
  ]);
});

test('require-await ignores non-promises and non-async functions', () => {
  const argument = { type: 'CallExpression', range: [7, 14] };
  const parserServices = {
    program: {
      getTypeChecker() {
        return {
          getTypeAtLocation() {
            return 'string';
          },
          typeToString(type) {
            return type;
          },
        };
      },
    },
    esTreeNodeToTSNodeMap: new Map([[argument, { kind: 'value' }]]),
  };
  const { listeners, reports } = instantiateRule(requireAwaitRule, {
    parserServices,
  });

  listeners.ReturnStatement({
    argument,
    parent: {
      type: 'BlockStatement',
      parent: { async: true },
    },
  });
  listeners.ReturnStatement({
    argument,
    parent: {
      type: 'BlockStatement',
      parent: { async: false },
    },
  });

  assert.equal(reports.length, 0);
});

test('require-next-props ignores non-next files and missing exports are reported', () => {
  const nonNextHarness = instantiateRule(requireNextPropsRule, {
    filename: 'C:\\repo\\src\\components\\widget.tsx',
  });
  nonNextHarness.listeners.Program({ type: 'Program', body: [] });

  assert.equal(nonNextHarness.reports.length, 0);

  const nextHarness = instantiateRule(requireNextPropsRule, {
    filename: 'C:\\repo\\src\\app\\page.tsx',
  });
  nextHarness.listeners.Program({ type: 'Program', body: [] });

  assert.equal(nextHarness.reports.length, 1);
  assert.equal(
    nextHarness.reports[0].messageId,
    'missingDefaultExportFunction'
  );
});

test('require-next-props allows zero-argument default exports', () => {
  const { listeners, reports } = instantiateRule(requireNextPropsRule, {
    filename: 'C:\\repo\\src\\app\\page.tsx',
  });
  const programNode = {
    type: 'Program',
    body: [createDefaultExportFunction({ params: [] })],
  };

  listeners.Program(programNode);

  assert.equal(reports.length, 0);
});

test('require-next-props removes extra arguments', () => {
  const params = [
    createParam('props', createTypeReference('NextPageProps')),
    createParam('extra', createTypeReference('string'), [20, 25]),
    createParam('another', createTypeReference('string'), [27, 34]),
  ];
  const { listeners, reports } = instantiateRule(requireNextPropsRule, {
    filename: 'C:\\repo\\src\\app\\page.tsx',
  });

  listeners.Program({
    type: 'Program',
    body: [createDefaultExportFunction({ params })],
  });

  assert.equal(reports.length, 1);
  assert.equal(reports[0].messageId, 'invalidNumberOfArguments');
  assert.deepStrictEqual(getFixOperations(reports[0].fix), [
    { start: 20, end: 34, text: '' },
  ]);
});

test('require-next-props reports missing argument types', () => {
  const { listeners, reports } = instantiateRule(requireNextPropsRule, {
    filename: 'C:\\repo\\src\\app\\page.tsx',
  });

  listeners.Program({
    type: 'Program',
    body: [createDefaultExportFunction({ params: [createParam('props')] })],
  });

  assert.equal(reports.length, 1);
  assert.equal(reports[0].messageId, 'invalidArgumentType');
});

test('require-next-props fixes invalid page prop type names', () => {
  const wrongType = createTypeReference('WrongProps', [], 'WrongProps', [9, 19]);
  const { listeners, reports } = instantiateRule(requireNextPropsRule, {
    cwd: 'C:\\repo',
    filename: path.join('C:\\repo', 'src', 'app', 'users', '[slug]', 'page.tsx'),
  });

  listeners.Program({
    type: 'Program',
    body: [
      createDefaultExportFunction({
        params: [createParam('props', wrongType, [0, 25])],
      }),
    ],
  });

  assert.equal(reports.length, 1);
  assert.equal(reports[0].messageId, 'invalidNextPagePropsArgumentType');
  assert.deepStrictEqual(getFixOperations(reports[0].fix), [
    { start: 9, end: 19, text: 'NextPageProps<{ slug: string }>' },
  ]);
});

test('require-next-props resolves type aliases for layouts', () => {
  const aliasType = createTypeReference('Props', [], 'Props', [9, 14]);
  const nextLayoutType = createTypeReference('NextLayoutProps');
  const { listeners, reports } = instantiateRule(requireNextPropsRule, {
    filename: 'C:\\repo\\src\\app\\layout.tsx',
  });

  listeners.Program({
    type: 'Program',
    body: [
      {
        type: 'TSTypeAliasDeclaration',
        id: { name: 'Props' },
        typeAnnotation: nextLayoutType,
      },
      createDefaultExportFunction({
        name: 'Layout',
        params: [createParam('props', aliasType, [0, 15])],
      }),
    ],
  });

  assert.equal(reports.length, 0);
});

test('require-next-props validates dynamic param object shapes', () => {
  const actualTypeParam = { text: '{ id: number }', range: [25, 39] };
  const pageType = createTypeReference(
    'NextPageProps',
    [actualTypeParam],
    'NextPageProps<{ id: number }>',
    [9, 39]
  );
  const { listeners, reports } = instantiateRule(requireNextPropsRule, {
    cwd: 'C:\\repo',
    filename: path.join('C:\\repo', 'src', 'app', 'users', '[id]', 'page.tsx'),
    sourceCodeOverrides: {
      getText(node) {
        return node.text;
      },
    },
  });

  listeners.Program({
    type: 'Program',
    body: [
      createDefaultExportFunction({
        params: [createParam('props', pageType, [0, 40])],
      }),
    ],
  });

  assert.equal(reports.length, 1);
  assert.equal(reports[0].messageId, 'invalidNextPagePropsArgumentType');
});

test('require-next-props fixes page props that should not declare route params', () => {
  const actualTypeParam = { text: '{ slug: string }', range: [20, 36] };
  const pageType = createTypeReference(
    'NextPageProps',
    [actualTypeParam],
    'NextPageProps<{ slug: string }>',
    [9, 37]
  );
  const { listeners, reports } = instantiateRule(requireNextPropsRule, {
    filename: 'C:\\repo\\src\\app\\page.tsx',
  });

  listeners.Program({
    type: 'Program',
    body: [
      createDefaultExportFunction({
        params: [createParam('props', pageType, [0, 40])],
      }),
    ],
  });

  assert.equal(reports.length, 1);
  assert.equal(reports[0].messageId, 'invalidNextPagePropsArgumentType');
  assert.deepStrictEqual(getFixOperations(reports[0].fix), [
    { start: 9, end: 37, text: 'NextPageProps' },
  ]);
});

test('require-next-props normalizes the first page type parameter when multiple are present', () => {
  const firstTypeParam = { text: '{ slug: string }', range: [20, 36] };
  const secondTypeParam = { text: 'SearchParams', range: [38, 50] };
  const pageType = createTypeReference(
    'NextPageProps',
    [firstTypeParam, secondTypeParam],
    'NextPageProps<{ slug: string }, SearchParams>',
    [9, 50]
  );
  const { listeners, reports } = instantiateRule(requireNextPropsRule, {
    filename: 'C:\\repo\\src\\app\\page.tsx',
    sourceCodeOverrides: {
      getText(node) {
        return node.text;
      },
    },
  });

  listeners.Program({
    type: 'Program',
    body: [
      createDefaultExportFunction({
        params: [createParam('props', pageType, [0, 51])],
      }),
    ],
  });

  assert.equal(reports.length, 1);
  assert.equal(reports[0].messageId, 'invalidNextPagePropsArgumentType');
  assert.deepStrictEqual(getFixOperations(reports[0].fix), [
    { start: 20, end: 36, text: '{}' },
  ]);
});

test('require-next-props uses layout and error-specific messages', () => {
  const invalidLayoutType = createTypeReference(
    'NextLayoutProps',
    [],
    'NextLayoutProps',
    [9, 24]
  );
  const layoutHarness = instantiateRule(requireNextPropsRule, {
    cwd: 'C:\\repo',
    filename: path.join('C:\\repo', 'src', 'app', '[teamId]', 'layout.tsx'),
  });
  layoutHarness.listeners.Program({
    type: 'Program',
    body: [
      createDefaultExportFunction({
        name: 'Layout',
        params: [createParam('props', invalidLayoutType, [0, 25])],
      }),
    ],
  });

  const errorHarness = instantiateRule(requireNextPropsRule, {
    filename: 'C:\\repo\\src\\app\\error.tsx',
  });
  errorHarness.listeners.Program({
    type: 'Program',
    body: [
      createDefaultExportFunction({
        name: 'Error',
        params: [
          createParam(
            'props',
            createTypeReference('NextPageProps', [], 'NextPageProps', [9, 22]),
            [0, 23]
          ),
        ],
      }),
    ],
  });

  assert.equal(layoutHarness.reports.length, 1);
  assert.equal(
    layoutHarness.reports[0].messageId,
    'invalidNextLayoutPropsArgumentType'
  );
  assert.equal(errorHarness.reports.length, 1);
  assert.equal(
    errorHarness.reports[0].messageId,
    'invalidNextErrorPropsArgumentType'
  );
});
