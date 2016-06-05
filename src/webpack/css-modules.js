const cssNext = require('postcss-cssnext');
const postcssNested = require('postcss-nested');
const postCssImport = require('postcss-import');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function addCssModules(options, config) {
  const newConfig = Object.assign({}, config);

  newConfig.postcss = (bundler) => {
    return [
      // Allows you to import css files from node_modules.
      postCssImport({
        addDependencyTo: bundler,
      }),
      // tomorrow's syntax, today! http://cssnext.io/
      cssNext(),
      postcssNested(),
    ];
  };

  if (options.debug) {
    newConfig.module.loaders.unshift(
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          `css-loader?${JSON.stringify({
            sourceMap: true,
            minimize: false,
            // CSS Modules https://github.com/css-modules/css-modules
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
            importLoaders: 2,
          })}`,
          'postcss-loader',
        ],
      }
    );
  } else {
    newConfig.module.loaders.unshift(
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract([
          `css-loader?${JSON.stringify({
            sourceMap: true,
            minimize: false,
            // CSS Modules https://github.com/css-modules/css-modules
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
            importLoaders: 2,
          })}`,
          'postcss-loader',
        ]),
      }
    );

    newConfig.plugins.unshift(
      // css files from the extract-text-plugin loader
      new ExtractTextPlugin('[name]-[chunkhash].css', { allChunks: true })
    );
  }

  return newConfig;
}