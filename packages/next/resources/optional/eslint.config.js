/* "@airdev/next": "seeded" */

const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const unusedImports = require('eslint-plugin-unused-imports');
const airdevPlugin = require('@airdev/eslint');
const airdevManagedPlugin = require('./plugins/eslint');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  {
    ignores: [
      '.next/**',
      'coverage/**',
      'dist/**',
      '*.js',
      '*.mjs',
      'vitest.config.mts',
      'plugins/**/*.js',
      'scripts/**/*.js',
      'src/generated/**/*.ts',
      'src/generated/**/*.tsx',
      'src/app/api/data/**/*.ts',
      'src/app/api/debug/**/*.ts',
      'src/app/api/inngest/route.ts',
      'src/app/api/jobs/**/*.ts',
      'src/app/api/webhooks/**/*.ts',
      'test/**/*.ts',
      'test/**/*.tsx',
    ],
  },
  ...require('eslint-config-next/core-web-vitals'),
  ...compat.extends('plugin:prettier/recommended'),
  {
    plugins: {
      'unused-imports': unusedImports,
      airdev: airdevPlugin,
      'airdev-managed': airdevManagedPlugin,
    },
    rules: {
      '@next/next/no-img-element': 'off',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/globals': 'error',
      'react-hooks/immutability': 'error',
      'react-hooks/incompatible-library': 'error',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      curly: 'error',

      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never', propElementValues: 'always' },
      ],

      'airdev/airent-no-raw-response': 'error',
      'airdev/no-negative-names': 'error',
      'airdev/no-relative-parent-imports': 'error',
      'airdev/require-relative-child-imports': 'error',
      'airdev/no-specific-paths': ['error', ['src/app/api']],
      'airdev/next-require-export-default-function': 'error',
      'airdev/no-specific-string': [
        'error',
        [
          {
            name: "from '@/app/",
            description: 'Disallow importing from outside of src/airdev',
            includedFiles: ['src/airdev/**/*.ts', 'src/airdev/**/*.tsx'],
          },
          {
            name: "from '@/backend/",
            description: 'Disallow importing from outside of src/airdev',
            includedFiles: ['src/airdev/**/*.ts', 'src/airdev/**/*.tsx'],
            excludedFiles: [
              'src/airdev/backend/services/data/user-base.ts',
              'src/airdev/backend/services/data/user-search.ts',
            ],
          },
          {
            name: "from '@/common/",
            description: 'Disallow importing from outside of src/airdev',
            includedFiles: ['src/airdev/**/*.ts', 'src/airdev/**/*.tsx'],
          },
          {
            name: "from '@/config/",
            notFollowedBy: 'component',
            description:
              'Disallow importing from outside of src/airdev, except for component config',
            includedFiles: ['src/airdev/**/*.ts', 'src/airdev/**/*.tsx'],
            excludedFiles: [
              'src/airdev/config/edge.ts',
              'src/airdev/config/private.ts',
              'src/airdev/config/public.ts',
            ],
          },
          {
            name: "from '@/frontend/",
            description: 'Disallow importing from outside of src/airdev',
            includedFiles: ['src/airdev/**/*.ts', 'src/airdev/**/*.tsx'],
          },
          { name: ' == ', description: '', replacement: ' === ' },
          { name: ' != ', description: '', replacement: ' !== ' },
          {
            name: 'process.env',
            description:
              'Move it to a config file and import the variable from there.',
            excludedFiles: [
              'src/config/public.ts',
              'src/config/private.ts',
              'src/config/edge.ts',
            ],
          },
          {
            name: 'process.env.',
            notFollowedBy: 'NEXT_PUBLIC_',
            description: 'It must be followed by NEXT_PUBLIC here.',
            includedFiles: ['src/config/public.ts'],
          },
          {
            name: 'process.env.NEXT_PUBLIC_',
            description: 'Move it to src/config/public.ts.',
            includedFiles: ['src/config/private.ts', 'src/config/edge.ts'],
          },
          {
            name: 'prisma.',
            description: 'Replace it with corresponding Airent entity.',
          },
          {
            name: 'console.debug',
            description: 'Replace it with logDebug.',
            replacement: 'logDebug',
            includedFiles: ['src/**/*.ts', 'src/**/*.tsx'],
          },
          {
            name: 'console.log',
            description: 'Replace it with logInfo.',
            includedFiles: ['src/**/*.ts', 'src/**/*.tsx'],
          },
          {
            name: 'console.info',
            description: 'Replace it with logInfo.',
            replacement: 'logInfo',
            includedFiles: ['src/**/*.ts', 'src/**/*.tsx'],
          },
          {
            name: 'console.warn',
            description: 'Replace it with logWarn.',
            replacement: 'logWarn',
            includedFiles: ['src/**/*.ts', 'src/**/*.tsx'],
          },
          {
            name: 'console.error',
            description: 'Replace it with logError.',
            replacement: 'logError',
            includedFiles: ['src/**/*.ts', 'src/**/*.tsx'],
          },
          {
            name: 'new Error',
            description: 'Replace it with createHttpError.',
            replacement: 'createHttpError.InternalServerError',
            includedFiles: [
              'src/app/api/**/*.ts',
              'src/backend/**/*.ts',
              'src/edge/**/*.ts',
            ],
            excludedFiles: [
              'src/airdev/common/**/*.ts',
              'src/airdev/common/**/*.tsx',
              'src/airdev/frontend/**/*.ts',
              'src/airdev/frontend/**/*.tsx',
              'src/common/**/*.ts',
              'src/common/**/*.tsx',
              'src/frontend/**/*.ts',
              'src/frontend/**/*.tsx',
            ],
          },
          {
            name: 'new Date()',
            description: 'Replace it with context.time.',
            replacement: 'context.time',
            includedFiles: [
              'src/backend/**/*.ts',
              'src/common/**/*.ts',
              'src/edge/**/*.ts',
            ],
            excludedFiles: ['src/airdev/**/*.ts'],
          },
        ],
      ],
      'airdev/require-await': 'error',
      'airdev-managed/require-airdev-next-managed': [
        'error',
        { includedFiles: ['src/airdev/**/*.ts', 'src/airdev/**/*.tsx'] },
      ],
    },
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'module',
      parser: require('@typescript-eslint/parser'),
      parserOptions: { project: './tsconfig.json' },
    },
  },
  {
    files: [
      'src/app/api/auth/**/*.ts',
      'src/app/api/edge/**/*.ts',
      'src/app/api/json/**/*.ts',
      'src/app/api/stream/**/*.ts',
      'src/app/api/form/**/*.ts',
    ],
    rules: { 'airdev/no-specific-paths': 'off' },
  },
  {
    files: ['src/**/*.tsx'],
    rules: {
      // 'airdev/next-require-next-props': 'error',
      'airdev/next-validate-use-param-from-url': 'error',
    },
  },
  {
    files: [
      'prisma/seed.ts',
      'src/config/**/*.ts',
      'src/airdev/frontend/components/auth/SignInLayout.tsx',
    ],
    rules: { 'airdev/no-relative-parent-imports': 'off' },
  },
  {
    files: [
      'src/app/**/*.ts',
      'src/app/**/*.tsx',
      'src/backend/**/*.ts',
      'src/backend/**/*.tsx',
      'src/common/**/*.ts',
      'src/common/**/*.tsx',
      'src/config/**/*.ts',
      'src/config/**/*.tsx',
      'src/frontend/**/*.ts',
      'src/frontend/**/*.tsx',
      'prisma/**/*.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/airdev/config/public',
              message: 'Use "@/config/public" in code.',
            },
            {
              name: '@/airdev/config/private',
              message: 'Use "@/config/private" in code.',
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      'src/airdev/backend/**/*.ts',
      'src/airdev/common/**/*.ts',
      'src/airdev/edge/**/*.ts',
      'src/airdev/emails/**/*.ts',
      'src/airdev/emails/**/*.tsx',
      'src/airdev/framework/**/*.ts',
      'src/airdev/frontend/**/*.ts',
      'src/airdev/frontend/**/*.tsx',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/config/public',
              message: 'Use "@/airdev/config/public" in code.',
            },
            {
              name: '@/config/private',
              message: 'Use "@/airdev/config/private" in code.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/airdev/frontend/components/shell/NotFound.tsx'],
    rules: { 'airdev/no-negative-names': 'off' },
  },
  {
    files: [
      './**/*.ts',
      './**/*.cts',
      './**/*.mts',
      './**/*.js',
      './**/*.cjs',
      './**/*.mjs',
      'src/**/error.tsx',
      'src/**/layout.tsx',
      'src/**/loading.tsx',
      'src/**/not-found.tsx',
      'src/**/page.tsx',
      'src/**/hooks/**/*.tsx',
      'src/**/context/**/*.tsx',
      'src/**/components/**/*.tsx',
      'src/config/component.tsx',
    ],
    rules: { 'airdev/next-require-export-default-function': 'off' },
  },
];
