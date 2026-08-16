function getFilename(context) {
  return context.filename ?? context.getFilename();
}

function getCwd(context) {
  return context.cwd ?? context.getCwd();
}

function getSourceCode(context) {
  return context.sourceCode ?? context.getSourceCode();
}

module.exports = {
  getFilename,
  getCwd,
  getSourceCode,
};
