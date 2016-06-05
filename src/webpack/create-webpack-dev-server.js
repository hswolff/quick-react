const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');

module.exports = function createWebpackDevServer(webpackConfig) {
  const host = (process.env.HOST || 'localhost');
  const port = (+process.env.PORT) || 3000;

  const compiler = webpack(webpackConfig);

  const wds = new WebpackDevServer(compiler, {
    contentBase: path.join(process.cwd(), 'dist'),
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true,
      cached: false,
      cachedAssets: false,
      chunks: false,
      version: true,
    }
  }).listen(port, host, function (err, result) {
    if (err) {
      return console.log(err);
    }

    console.log(`Listening at http://${host}:${port}/`);
  });

  return wds;
}
