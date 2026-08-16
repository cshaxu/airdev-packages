const path = require('path');

const { toPascalCase } = require('../utils/case');
const {
  getFilename,
  getSourceCode,
} = require('../utils/context');

const getIsDefaultExportFunction = (statement) =>
  statement.type === 'ExportDefaultDeclaration' &&
  (statement.declaration.type === 'FunctionDeclaration' ||
    (statement.declaration.type === 'FunctionExpression' &&
      statement.declaration.async));

const requireExportDefaultFunctionRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require export default function or export default async function, and the function name must match the file name exactly (including case)',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingDefaultExportFunction:
        'The file should have an export default function or export default async function.',
      functionNameMismatch:
        'The default export function name must match the file name exactly (including case).',
    },
  },
  create: function (context) {
    return {
      Program(node) {
        const fileName = path.parse(getFilename(context)).name;
        const expectedFunctionName = toPascalCase(fileName);

        const defaultExportFunction = node.body.find(
          getIsDefaultExportFunction
        );

        if (!defaultExportFunction) {
          const exportNameNodes = node.body.filter(
            (statement) =>
              statement.type === 'ExportNamedDeclaration' &&
              statement.declaration?.type === 'FunctionDeclaration'
          );

          const functionNodes = node.body.filter(
            (statement) => statement.type === 'FunctionDeclaration'
          );

          if (exportNameNodes.length === 1) {
            const exportNameNode = exportNameNodes[0];
            context.report({
              node: exportNameNode,
              messageId: 'missingDefaultExportFunction',
              fix: (fixer) => {
                const functionDeclaration = getSourceCode(context).getText(
                  exportNameNode.declaration
                );
                const exportDefaultText = `export default ${functionDeclaration}`;
                return [
                  fixer.remove(exportNameNode),
                  fixer.insertTextAfter(exportNameNode, exportDefaultText),
                ];
              },
            });
          } else if (functionNodes.length === 1) {
            const functionNode = functionNodes[0];
            context.report({
              node: functionNode,
              messageId: 'missingDefaultExportFunction',
              fix: (fixer) =>
                fixer.replaceTextRange(
                  [functionNode.range[0], functionNode.range[0]],
                  'export default '
                ),
            });
          } else {
            context.report({
              node,
              messageId: 'missingDefaultExportFunction',
              fix: (fixer) => {
                const exportStatement = `export default function ${expectedFunctionName}() {}`;
                return fixer.insertTextAfter(node, `\n${exportStatement}\n`);
              },
            });
          }
          return;
        }

        const functionName = defaultExportFunction.declaration.id?.name;
        if (
          functionName &&
          functionName.toLowerCase() !== expectedFunctionName.toLowerCase()
        ) {
          context.report({
            node: defaultExportFunction,
            messageId: 'functionNameMismatch',
            fix: (fixer) => {
              const sourceCode = getSourceCode(context);
              const functionText = sourceCode.getText(
                defaultExportFunction.declaration
              );
              const newFunctionText = functionText.replace(
                new RegExp(`function\\s+${functionName}\\b`),
                `function ${expectedFunctionName}`
              );
              return fixer.replaceText(
                defaultExportFunction.declaration,
                newFunctionText
              );
            },
          });
        }
      },
    };
  },
};

module.exports = requireExportDefaultFunctionRule;
