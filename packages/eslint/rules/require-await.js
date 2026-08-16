const requireAwait = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Detect a return statement that returns a promise without "await"',
      category: 'Possible Errors',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingAwait: 'Return statement is missing "await" for the promise.',
    },
  },
  create: function (context) {
    const parserServices = context.parserServices;
    if (
      !parserServices ||
      !parserServices.program ||
      !parserServices.esTreeNodeToTSNodeMap
    ) {
      return {};
    }

    const checker = parserServices.program.getTypeChecker();

    const isPromise = (node) => {
      const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
      const type = checker.getTypeAtLocation(tsNode);
      const typeString = checker.typeToString(type);
      return typeString === 'Promise' || typeString.startsWith('Promise<');
    };

    return {
      ReturnStatement(node) {
        const argument = node.argument;
        if (
          argument &&
          isPromise(argument) &&
          node.parent.type === 'BlockStatement'
        ) {
          const parentFunction = node.parent.parent;
          if (parentFunction.async) {
            context.report({
              node,
              messageId: 'missingAwait',
              fix: (fixer) => fixer.insertTextBefore(node.argument, 'await '),
            });
          }
        }
      },
    };
  },
};

module.exports = requireAwait;
