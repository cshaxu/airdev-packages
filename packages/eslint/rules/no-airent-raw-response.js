const fs = require('fs');
const path = require('path');

const { toPascalCase } = require('../utils/case');

function getJsonFromPath(filePath) {
  try {
    const configContent = fs.readFileSync(path.resolve(filePath), 'utf-8');
    return JSON.parse(configContent);
  } catch (_err) {
    return null;
  }
}

function getFileNamesFromPath(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);
    return files.map((file) => path.basename(file, path.extname(file)));
  } catch (_err) {
    return [];
  }
}

const noAirentRawResponseRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Airent raw responses are not allowed',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: { typeName: { type: 'string' } },
        additionalProperties: false,
      },
    ],
  },
  create: function (_context) {
    const schemaPath = getJsonFromPath('airent.config.json')?.schemaPath;
    const disallowedAirentRawResponseTypes = schemaPath
      ? getFileNamesFromPath(path.resolve(schemaPath))
          .map(toPascalCase)
          .map((s) => `${s}Response`)
      : [];

    if (disallowedAirentRawResponseTypes.length === 0) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        node.specifiers.forEach((specifier) => {
          if (
            specifier.imported &&
            disallowedAirentRawResponseTypes.includes(specifier.imported.name)
          ) {
            _context.report({
              node: specifier,
              message: `Importing '${specifier.imported.name}' is not allowed`,
              fix: (fixer) =>
                fixer.replaceText(
                  specifier.imported,
                  `Selected${specifier.imported.name}`
                ),
            });
          }
        });
      },
    };
  },
};

module.exports = noAirentRawResponseRule;