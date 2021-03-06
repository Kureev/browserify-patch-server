const fs = require('fs');
const compose = require('./compose');
const check = require('syntax-error');
const babel = require('babel');

const WebSocketServer = require('ws').Server;
const Logdown = require('logdown');
const chalk = require('chalk');
const moment = require('moment');
const logger = new Logdown({ prefix: '[BDS:SYSTEM]', });
const error = new Logdown({ prefix: '[BDS:ERROR]', });

function makeBuildPatchMessage(file) {
  return function buildPatchMessage(patch) {
    return {
      file: file,
      patch: patch,
    };
  };
}

function makeUpdateSourceContent(sources) {
  return function updateSourceContent(path, content) {
    sources.forEach(function iterateFiles(source) {
      if (source.file === path) {
        source.content = content;
      }
    });
  };
}

function checkPatch(patch) {
  if (patch) {
    return patch;
  }
}

function getTimestamp() {
  return '['+ moment().format('HH:mm:ss') + ']';
}

module.exports = function runServer(files, options) {
  const pjsonConfigPort = process.env
    .npm_package_browserify_patch_server_port;

  const port = options.port || pjsonConfigPort || 8081;

  const sources = files.map(function iterateFiles(file) {
    var buffer;
    try {
      const stats = fs.lstatSync(file);
      if (stats.isFile()) {
        buffer = babel.transformFileSync(file, { stage: 0, });
        return {
          file: file,
          content: buffer.code,
        };
      }
    } catch (e) {
      throw e;
    }
  }).filter(function filterValidSources(source) {
    return source;
  });

  const updateSourceContent = makeUpdateSourceContent(sources);

  const wss = new WebSocketServer({ port: port, });
  const broadcast = require('./notify')(wss);
  const patch = require('./makePatch')(sources);
  const watcher = require('./makeWatcher')(files);

  wss.on('connection', function connection(ws) {
    ws.send(
      JSON.stringify({
        message: 'Connected to browserify-patch-server',
        sources: sources,
      })
    );
  });

  watcher.on('change', function onChange(path) {
    const patchMessage = makeBuildPatchMessage(path);
    const timestamp = getTimestamp();
    /**
     * Get latest content of the watched path
     */
    babel.transformFile(path, { stage: 0, }, function processFile(readError, res) {
      if (readError) {
        return broadcast({
          file: path,
          error: readError.codeFrame,
        });
      }

      const _content = res.code;

      /**
       * Check for syntax errors
       */
      const err = _content.match(/SyntaxError:/) ? _content : null;

      logger.info(timestamp + ' File *' + path + '* has been changed');

      if (err) {
        const errObj = err.match(/console.error\("(.+)"\)/)[1].split(': ');
        const errType = errObj[0];
        const errFile = errObj[1];
        const errMsg = errObj[2].match(/(.+) while parsing file/)[1];

        error.error(timestamp + ' Bundle *' + path + '* is corrupted:' +
          '\n\n ' + chalk.red(errFile + '\n') +
          chalk.yellow('\t ⚠ ' + errMsg) + '\n');

        broadcast({
          file: path,
          error: err,
        });
      } else {
        if (wss.clients.length) {
          compose(broadcast, patchMessage, patch)(path, _content);
          logger.info(timestamp + ' Broadcasted patch for *' +
            path + '* to ' + wss.clients.length + ' clients');
        }

        updateSourceContent(path, _content);
      }
    });
  });

  logger.info(getTimestamp() +
    ' *Patch server* has been started ' +
    'on port *' + port + '*'
  );
};
