const path = require('path');

const { getCwd, getFilename } = require('../utils/context');

const validateUseParamFromUrl = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure useParamFromUrl has valid param key',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
  },
  create: function (context) {
    return {
      CallExpression(node) {
        if (node.callee.name !== 'useParamFromUrl') {
          return;
        }
        const firstArgument = node.arguments[0];

        const relativeFilePath = path.relative(
          getCwd(context),
          getFilename(context)
        );
        const segments = relativeFilePath.split(path.sep);
        const paramKeys = segments
          .map((segment) => segment.match(/\[(.+)\]/)?.[1])
          .filter(Boolean);

        if (paramKeys.length === 0) {
          context.report({
            node: firstArgument,
            message: `The file path "${relativeFilePath}" does not contain any param keys.`,
          });
          return;
        }

        if (
          !firstArgument ||
          firstArgument.type !== 'Literal' ||
          !firstArgument.value ||
          !paramKeys.includes(firstArgument.value)
        ) {
          context.report({
            node: firstArgument,
            message: `The argument "${firstArgument.value}" is invalid. Replace it with one of the following: "${paramKeys.join('", "')}".`,
            fix: (fixer) => {
              if (paramKeys.length === 0) {
                return;
              }
              return fixer.replaceText(firstArgument, `'${paramKeys[0]}'`);
            },
          });
        }
      },
    };
  },
};

module.exports = validateUseParamFromUrl;
