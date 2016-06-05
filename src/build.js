const createWebpackConfig = require('./webpack/create-webpack-config');
const webpack = require('webpack');

module.exports = function build(entryPath) {
  const config = createWebpackConfig({
    entry: entryPath,
    debug: false,
  });

  console.log('Building...');
  webpack(config).run((err, stats) => {
    console.log('done');
  });
}