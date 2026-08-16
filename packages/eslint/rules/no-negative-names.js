const { toKebabCase } = require('../utils/case');

function formatWords(words, template) {
  if (template.includes('-')) {
    return words.join('-');
  }

  if (template.includes('_')) {
    return words.join('_');
  }

  if (template[0] && template[0] === template[0].toUpperCase()) {
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  return words
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
}

const noNegativeNamesRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow negative variable and function names and suggest positive replacements',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noNegativeVarName:
        'Avoid using negative name "{{ name }}". Consider using "{{ suggestion }}" instead.',
    },
  },
  create: function (context) {
    const negativeMap = {
      disallow: 'allow',
      disable: 'enable',
      no: '',
      not: '',
    };

    const getPositiveName = (name) =>
      formatWords(
        toKebabCase(name)
          .split('-')
          .map((segment) => negativeMap[segment] ?? segment)
          .filter(Boolean),
        name
      );

    const isNegativeSubstringPresent = (name) =>
      toKebabCase(name)
        .split('-')
        .map((s) => s.toLowerCase())
        .some((s) => Object.keys(negativeMap).includes(s));

    const checkNode = (node, name) => {
      if (name !== undefined && isNegativeSubstringPresent(name)) {
        const positiveName = getPositiveName(name);
        context.report({
          node: node,
          messageId: 'noNegativeVarName',
          data: { name: name, suggestion: positiveName },
          fix: (fixer) => fixer.replaceText(node, positiveName),
        });
      }
    };

    return {
      VariableDeclarator(node) {
        const varName = node.id.name;
        checkNode(node.id, varName);
      },
      AssignmentExpression(node) {
        if (node.left.type === 'Identifier') {
          const varName = node.left.name;
          checkNode(node.left, varName);
        }
      },
      FunctionDeclaration(node) {
        if (node.id && node.id.name) {
          const funcName = node.id.name;
          checkNode(node.id, funcName);
        }
      },
      FunctionExpression(node) {
        if (node.id && node.id.name) {
          const funcName = node.id.name;
          checkNode(node.id, funcName);
        }
      },
      ArrowFunctionExpression(node) {
        if (node.id && node.id.name) {
          const funcName = node.id.name;
          checkNode(node.id, funcName);
        }
      },
    };
  },
};

module.exports = noNegativeNamesRule;
