const path = require('path');

const { getCwd, getFilename } = require('../utils/context');

const noRelativeParentImportsRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Relative imports from parent directories are not allowed',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
  },
  create: function (context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value.startsWith('../')) {
          const srcRootPath = path.resolve(getCwd(context), './src');
          const absoluteImportPath = path.resolve(
            path.dirname(getFilename(context)),
            node.source.value
          );
          const relativeImportPath = path
            .relative(srcRootPath, absoluteImportPath)
            .replace(/\\/g, '/');
          context.report({
            node,
            message: 'Relative imports from parent directories are not allowed',
            fix: (fixer) =>
              fixer.replaceText(node.source, `'@/${relativeImportPath}'`),
          });
        }
      },
    };
  },
};

module.exports = noRelativeParentImportsRule;
