module.exports = {
  rules: {
    'no-negative-names': require('./rules/no-negative-names'),
    'no-relative-parent-imports': require('./rules/no-relative-parent-imports'),
    'no-specific-paths': require('./rules/no-specific-paths'),
    'no-specific-string': require('./rules/no-specific-strings'),
    'require-relative-child-imports': require('./rules/require-relative-child-imports'),
    'require-await': require('./rules/require-await'),
    'next-require-export-default-function': require('./rules/require-export-default-function'),
    'next-require-next-props': require('./rules/require-next-props'),
    'next-validate-use-param-from-url': require('./rules/validate-use-param-from-url'),
    'airent-no-raw-response': require('./rules/no-airent-raw-response'),
  },
};
