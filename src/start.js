const createWebpackConfig = require('./webpack/create-webpack-config');
const createWebpackDevServer = require('./webpack/create-webpack-dev-server');

module.exports = function start(entryPath) {
  const config = createWebpackConfig({
    entry: entryPath,
  });

  const app = createWebpackDevServer(config);
  return app;
}