const minimatch = require('minimatch');
const path = require('path');

const {
  getCwd,
  getFilename,
  getSourceCode,
} = require('../utils/context');

function getAllIndexes(sourceString, subString) {
  const indexes = [];
  let currentIndex = sourceString.indexOf(subString);

  while (currentIndex !== -1) {
    indexes.push(currentIndex);
    currentIndex = sourceString.indexOf(subString, currentIndex + 1);
  }

  return indexes;
}

const noSpecificStringsRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow specific strings',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            notFollowedBy: { type: 'string' },
            description: { type: 'string' },
            replacement: { type: 'string' },
            includedFiles: { type: 'array', items: { type: 'string' } },
            excludedFiles: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
      },
    ],
  },
  create: function (context) {
    const basePath = getCwd(context);
    const currentFilePath = path.resolve(getFilename(context));
    const relativeFilePath = path.relative(basePath, currentFilePath);

    const options = context.options[0] ?? [];

    return {
      Program(node) {
        const sourceCode = getSourceCode(context).getText();
        options.forEach((option) => {
          const disallowedString = option.name;
          const indexes = getAllIndexes(sourceCode, disallowedString);
          if (indexes.length === 0) {
            return;
          }

          const excludedFiles = option.excludedFiles ?? [];
          const isExcluded = excludedFiles.some(
            (pattern) => minimatch.match([relativeFilePath], pattern).length > 0
          );
          if (isExcluded) {
            return;
          }

          const includedFiles = option.includedFiles ?? [];
          const isIncluded =
            includedFiles.length === 0 ||
            includedFiles.some(
              (pattern) =>
                minimatch.match([relativeFilePath], pattern).length > 0
            );
          if (!isIncluded) {
            return;
          }

          for (const index of indexes) {
            if (option.notFollowedBy) {
              const followedBy = sourceCode.slice(
                index + disallowedString.length,
                index + disallowedString.length + option.notFollowedBy.length
              );
              if (followedBy === option.notFollowedBy) {
                continue;
              }
            }

            context.report({
              node,
              message: `String "${disallowedString}" disallowed.${option.description ? ` ${option.description}` : ''}`,
              loc: getSourceCode(context).getLocFromIndex(index),
              fix: option.replacement
                ? (fixer) =>
                    fixer.replaceTextRange(
                      [index, index + disallowedString.length],
                      option.replacement
                    )
                : undefined,
            });
          }
        });
      },
    };
  },
};

module.exports = noSpecificStringsRule;
