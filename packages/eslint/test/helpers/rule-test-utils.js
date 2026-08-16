function rangeOf(sourceText, searchText, fromIndex = 0) {
  const index = sourceText.indexOf(searchText, fromIndex);
  if (index === -1) {
    throw new Error(`Could not find "${searchText}" in source text.`);
  }
  return [index, index + searchText.length];
}

function createFixer() {
  return {
    replaceText(node, text) {
      return { start: node.range[0], end: node.range[1], text };
    },
    replaceTextRange(range, text) {
      return { start: range[0], end: range[1], text };
    },
    insertTextBefore(node, text) {
      return { start: node.range[0], end: node.range[0], text };
    },
    insertTextAfter(node, text) {
      return { start: node.range[1], end: node.range[1], text };
    },
    remove(node) {
      return { start: node.range[0], end: node.range[1], text: '' };
    },
    removeRange(range) {
      return { start: range[0], end: range[1], text: '' };
    },
  };
}

function getFixOperations(fix) {
  if (!fix) {
    return [];
  }
  const result = fix(createFixer());
  if (!result) {
    return [];
  }
  return (Array.isArray(result) ? result : [result]).filter(Boolean);
}

function applyFix(fix, sourceText) {
  const operations = getFixOperations(fix).sort(
    (left, right) => right.start - left.start || right.end - left.end
  );

  return operations.reduce(
    (text, operation) =>
      `${text.slice(0, operation.start)}${operation.text}${text.slice(operation.end)}`,
    sourceText
  );
}

function createSourceCode(sourceText, overrides = {}) {
  return {
    getText(node) {
      if (overrides.getText) {
        return overrides.getText(node);
      }
      if (!node) {
        return sourceText;
      }
      if (typeof node.text === 'string') {
        return node.text;
      }
      if (node.range) {
        return sourceText.slice(node.range[0], node.range[1]);
      }
      return sourceText;
    },
    getLocFromIndex(index) {
      if (overrides.getLocFromIndex) {
        return overrides.getLocFromIndex(index);
      }
      return { line: 1, column: index };
    },
  };
}

function createContext({
  cwd = 'C:\\repo',
  filename = 'C:\\repo\\src\\file.js',
  options = [],
  parserServices,
  sourceText = '',
  sourceCodeOverrides,
} = {}) {
  const reports = [];
  const sourceCode = createSourceCode(sourceText, sourceCodeOverrides);

  const context = {
    cwd,
    filename,
    options,
    parserServices,
    sourceCode,
    report(descriptor) {
      reports.push(descriptor);
    },
    getCwd() {
      return cwd;
    },
    getFilename() {
      return filename;
    },
    getSourceCode() {
      return sourceCode;
    },
  };

  return { context, reports, sourceCode };
}

function instantiateRule(rule, contextOptions) {
  const setup = createContext(contextOptions);
  return {
    ...setup,
    listeners: rule.create(setup.context),
  };
}

module.exports = {
  applyFix,
  createContext,
  getFixOperations,
  instantiateRule,
  rangeOf,
};
