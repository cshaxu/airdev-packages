const path = require('path');

const { getCwd, getFilename } = require('../utils/context');

function isCurrentOrChildPath(relativePath) {
  return (
    relativePath !== '' &&
    !relativePath.startsWith('..') &&
    !path.isAbsolute(relativePath)
  );
}

function toRelativeImportPath(relativePath) {
  const normalizedPath = relativePath.replace(/\\/g, '/');
  if (normalizedPath.startsWith('./') || normalizedPath.startsWith('../')) {
    return normalizedPath;
  }
  return `./${normalizedPath}`;
}

const requireRelativeChildImportsRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Imports to files in the current or child directory must use relative paths',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
  },
  create: function (context) {
    const srcRootPath = path.resolve(getCwd(context), './src');
    const currentDirectory = path.dirname(getFilename(context));

    return {
      ImportDeclaration(node) {
        if (
          typeof node.source.value !== 'string' ||
          !node.source.value.startsWith('@/')
        ) {
          return;
        }

        const absoluteImportPath = path.resolve(
          srcRootPath,
          node.source.value.slice(2)
        );
        const relativeImportPath = path.relative(
          currentDirectory,
          absoluteImportPath
        );

        if (!isCurrentOrChildPath(relativeImportPath)) {
          return;
        }

        context.report({
          node,
          message:
            'Imports to files in the current or child directory must use relative paths',
          fix: (fixer) =>
            fixer.replaceText(
              node.source,
              `'${toRelativeImportPath(relativeImportPath)}'`
            ),
        });
      },
    };
  },
};

module.exports = requireRelativeChildImportsRule;
