## Browserify patch server
Because we need HMR an analog for webpack's `webpack-dev-server`

## Requirements
`node` > 0.10 or `io.js` > 2.0 installed

## Install
```bash
npm install browserify-patch-server --save-dev
```

## Getting started
Start `browserify-dev-server`:
```bash
node_modules/.bin/bfps bundles/file.js
```
or
```bash
node_modules/.bin/browserify-patch-server bundles/file.js
```

Now you need to have a client which will connect to `localhost:8081`. After establishing connection you'll start receiving messages:

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

## Configuration
By default, `browserify-patch-server` use port `8081` for websocket server. If you want to change this port you need to specify `-p` or `--port` parameter:
```bash
node_modules/.bin/browserify-patch-server bundles/file.js -p 8888
```
