const chokidar = require('chokidar');
const fs = require('fs');

const Logdown = require('logdown');
const moment = require('moment');
const logger = new Logdown({ prefix: '[BDS:SYSTEM]', });

module.exports = function makeWatcher(path) {
  return chokidar.watch(path)
    .on('error', function processError(err) {
      logger.error('Oops, an error has been occured: ' + err);
    });
};
