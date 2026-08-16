const path = require('path');
const ts = require('typescript');

const {
  getCwd,
  getFilename,
  getSourceCode,
} = require('../utils/context');

function parseTypeParameter(typeText) {
  const sourceFile = ts.createSourceFile(
    'temp.ts',
    `type Temp = ${typeText};`,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  );

  const result = {};

  const visit = (node) => {
    if (ts.isTypeLiteralNode(node)) {
      node.members.forEach((member) => {
        if (
          ts.isPropertySignature(member) &&
          member.name &&
          ts.isIdentifier(member.name)
        ) {
          const key = member.name.text;
          const typeNode = member.type;
          const type = typeNode
            ? typeNode.getFullText(sourceFile).trim()
            : 'unknown';
          result[key] = type;
        }
      });
    }
    ts.forEachChild(node, visit);
  };

  ts.forEachChild(sourceFile.statements[0], visit);

  return result;
}

const requireNextPropsRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ensure Next.js files have export default function with proper argument type',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingDefaultExportFunction:
        'The file should have an export default function or export default async function.',
      invalidNextPagePropsArgumentType:
        'The function argument type should be NextPageProps with proper type params.',
      invalidNextLayoutPropsArgumentType:
        'The function argument type should be NextLayoutProps with proper type params.',
      invalidNextErrorPropsArgumentType:
        'The function argument type should be NextErrorProps with proper type params.',
      invalidArgumentType:
        'The function argument type is invalid for this Next.js file.',
      invalidNumberOfArguments:
        'The function should have either 0 or exactly 1 argument.',
    },
  },
  create: function (context) {
    return {
      Program(node) {
        const fileName = getFilename(context);
        const isNextPage = fileName.endsWith('page.tsx');
        const isNextLayout = fileName.endsWith('layout.tsx');
        const isNextError = fileName.endsWith('error.tsx');
        if (!isNextPage && !isNextLayout && !isNextError) {
          return;
        }

        const defaultExportFunctionStatementNode = node.body.find(
          (statement) =>
            statement.type === 'ExportDefaultDeclaration' &&
            (statement.declaration.type === 'FunctionDeclaration' ||
              (statement.declaration.type === 'FunctionExpression' &&
                statement.declaration.async))
        );

        if (!defaultExportFunctionStatementNode) {
          context.report({ node, messageId: 'missingDefaultExportFunction' });
          return;
        }

        const defaultFunctionDeclarationParamNodes =
          defaultExportFunctionStatementNode.declaration.params;
        if (defaultFunctionDeclarationParamNodes.length === 0) {
          return;
        }

        if (defaultFunctionDeclarationParamNodes.length !== 1) {
          context.report({
            node: defaultFunctionDeclarationParamNodes[1],
            messageId: 'invalidNumberOfArguments',
            fix: (fixer) => {
              const extraArgsRange = [
                defaultFunctionDeclarationParamNodes[1].range[0],
                defaultFunctionDeclarationParamNodes[
                  defaultFunctionDeclarationParamNodes.length - 1
                ].range[1],
              ];
              return fixer.removeRange(extraArgsRange);
            },
          });
          return;
        }

        const firstParamNode = defaultFunctionDeclarationParamNodes[0];
        const paramType = firstParamNode.typeAnnotation?.typeAnnotation;
        if (!paramType) {
          context.report({
            node: firstParamNode,
            messageId: 'invalidArgumentType',
          });
          return;
        }

        const typeAliases = node.body
          .filter((statement) => statement.type === 'TSTypeAliasDeclaration')
          .reduce((acc, statement) => {
            acc[statement.id.name] = statement.typeAnnotation;
            return acc;
          }, {});
        const resolveType = (type) => {
          if (
            type.type === 'TSTypeReference' &&
            type.typeName.name in typeAliases
          ) {
            return resolveType(typeAliases[type.typeName.name]);
          }
          return type;
        };
        const resolvedType = resolveType(paramType);

        const relativeFilePath = path.relative(
          getCwd(context),
          getFilename(context)
        );
        const segments = relativeFilePath.split(path.sep);
        const paramKeys = segments
          .map((segment) => segment.match(/\[(.+)\]/)?.[1])
          .filter(Boolean);
        const typeParamBody = paramKeys
          .map((key) => `${key}: string`)
          .join('; ');

        const messageId = isNextPage
          ? 'invalidNextPagePropsArgumentType'
          : isNextLayout
            ? 'invalidNextLayoutPropsArgumentType'
            : 'invalidNextErrorPropsArgumentType';
        const typeNameName = isNextPage
          ? 'NextPageProps'
          : isNextLayout
            ? 'NextLayoutProps'
            : 'NextErrorProps';
        const isParamTypeCorrect =
          resolvedType.type === 'TSTypeReference' &&
          resolvedType.typeName.name === typeNameName;

        const isTypeParamsExpected = !isNextError && paramKeys.length > 0;
        const actualTypeParamCount =
          resolvedType.typeParameters?.params.length ?? 0;
        const isTypeParamsCountCorrect = isNextPage
          ? actualTypeParamCount <= 2 &&
            (!isTypeParamsExpected || actualTypeParamCount > 0)
          : isNextLayout
            ? isTypeParamsExpected
              ? actualTypeParamCount === 1
              : actualTypeParamCount === 0
            : actualTypeParamCount === 0;

        const expectedParamType = isTypeParamsExpected
          ? `${typeNameName}<{ ${typeParamBody} }>`
          : typeNameName;

        const report = () => {
          context.report({
            node: firstParamNode,
            messageId,
            fix: (fixer) => fixer.replaceText(paramType, expectedParamType),
          });
        };

        if (!isParamTypeCorrect || !isTypeParamsCountCorrect) {
          report();
        } else if (isTypeParamsExpected) {
          const actualTypeParamNode = resolvedType.typeParameters.params[0];
          const actualTypeParamText =
            getSourceCode(context).getText(actualTypeParamNode);
          const actualTypeParamJson = parseTypeParameter(actualTypeParamText);
          const isKeyMatch =
            paramKeys.every((key) => key in actualTypeParamJson) &&
            Object.keys(actualTypeParamJson).every((key) =>
              paramKeys.includes(key)
            );
          const isKeyString = Object.keys(actualTypeParamJson).every(
            (key) => actualTypeParamJson[key] === 'string'
          );
          if (!isKeyMatch || !isKeyString) {
            report();
          }
        } else if (isNextPage && actualTypeParamCount > 0) {
          if (actualTypeParamCount === 1) {
            report();
          } else {
            const actualTypeParamNode = resolvedType.typeParameters.params[0];
            const actualTypeParamText =
              getSourceCode(context).getText(actualTypeParamNode);
            const actualTypeParamJson = parseTypeParameter(actualTypeParamText);
            if (Object.keys(actualTypeParamJson).length > 0) {
              context.report({
                node: actualTypeParamNode,
                messageId,
                fix: (fixer) => fixer.replaceText(actualTypeParamNode, '{}'),
              });
            }
          }
        }
      },
    };
  },
};

module.exports = requireNextPropsRule;
