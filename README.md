## Browserify patch server

[![Greenkeeper badge](https://badges.greenkeeper.io/Kureev/browserify-patch-server.svg)](https://greenkeeper.io/)
Because we need HMR an analog for webpack's [`webpack-dev-server`](http://webpack.github.io/docs/webpack-dev-server.html)

## Requirements
`node` > 0.10 or `io.js` > 2.0 installed

## Install
```bash
npm install browserify-patch-server --save-dev
```

## Getting started
Start `browserify-patch-server`:
```bash
node_modules/.bin/bfps bundles/file.js
```
or
```bash
node_modules/.bin/browserify-patch-server bundles/file.js
```
With `browserify-patch-server` you can also track multiple bundles:
```bash
node_modules/.bin/browserify-patch-server bundles/file.js bundles/file2.js
```

Now you need to have a client which will connect to `localhost:<port>`. After establishing connection you'll start receiving messages:

- Bundle has been **changed successfully**:
```
  {
    "bundle": BundleName <String>,
    "patch": Patch <String>
  }
```
- Bundle has **syntax error**:
```
  {
    "bundle": BundleName <String>,
    "error": Error <String>
  }
```
Also, once your client will connect to the server it'll receive an initial bundle(s) and message that connection has been established:
```
{
  "message": "Connected to browserify-patch-server",
  "sources": sources <Array>,
}
```

## Examples
- [Live patch for React.js](https://github.com/Kureev/browserify-react-live)

Feel free to submit your example!

## Configuration
By default, `browserify-patch-server` use port `8081` for websocket server. If you want to change this port you need to specify `-p` or `--port` parameter:
```bash
node_modules/.bin/browserify-patch-server bundles/file.js -p 8888
```
