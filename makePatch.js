const jsdiff = require('diff');

module.exports = function scopeOriginal(sources) {
  return function calculateDiff(file, changedContent) {
    if (!changedContent.length) return false;

    const fileMatches = sources.filter(function filterSources(source) {
      return source.file === file;
    });

    if (!fileMatches.length) {
      throw Error('Directory pattern you specified to watch doesn\'t contain ' +
      'any files. Please, check the pattern you specified and try again.');
    }

    const originalContent = fileMatches[0].content;

    return jsdiff.createPatch(Date.now(), originalContent, changedContent);
  };
};
