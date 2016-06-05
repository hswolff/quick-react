const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const cssModules = require('./css-modules');

const babelLoaderQuery = require('../babel/babelrc.json');

const PROJECT_ROOT = process.cwd();

const BUILT_PATH = path.resolve(PROJECT_ROOT, './dist');

module.exports = function createWebpackConfig(options) {
  if (!options) {
    options = {}; // eslint-disable-line no-param-reassign
  }

  const host = options.host || process.env.HOST || 'localhost';
  const port = options.port || (+process.env.PORT) || 3000;
  const DEBUG = options.debug == null ?
    process.env.NODE_ENV !== 'production' :
    options.debug;
  options.debug = DEBUG;

  let config = {
    context: PROJECT_ROOT,
    target: 'web',
    progress: true,
    // Choose a developer tool to enhance debugging
    // http://webpack.github.io/docs/configuration.html#devtool
    devtool: DEBUG ?
      'cheap-module-eval-source-map' : // development
      'source-map', // production
    cache: DEBUG,
    debug: DEBUG,

    resolve: {
      // Behaves similar to process.env.NODE_PATH
      modulesDirectories: [
        // Add our local modules.
        path.join(__dirname, '../../', 'node_modules'),
      ],
    },

    resolveLoader: {
      modulesDirectories: [
        // Add our local modules.
        path.join(__dirname, '../../', 'node_modules'),
      ],
    },

    module: {
      // loaders defined below
    },

    eslint: {
      // Only emit issues as a warning so that builds are not prevented.
      emitWarning: true,
      // configFile: path.join(PROJECT_ROOT, '.eslintrc'),
    },
  };

  if (DEBUG) {
    config.entry = {
      'app': [
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://${host}:${port}`,
        'webpack/hot/only-dev-server',
        options.entry,
      ],
    };
  } else {
    config.entry = {
      'app': options.entry,
    };
  }

  if (DEBUG) {
    config.output = {
      path: BUILT_PATH,
      filename: '[name]-[hash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: `http://${host}:${port}/`,
    };
  } else {
    config.output = {
      path: BUILT_PATH,
      filename: '[name]-[hash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: '/',
    };
  }

  // Common Loaders
  config.module.loaders = [
    {
      test: /\.json$/,
      loader: 'json-loader',
    },
    {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff',
    },
    {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff',
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
    },
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
    },
  ];

  if (DEBUG) {
    config.module.loaders.unshift(
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          `babel-loader?${JSON.stringify(
            _.merge({}, babelLoaderQuery, {
              // https://github.com/babel/babel-loader#options
              // Cache babel transforms when in debug mode.
              cacheDirectory: DEBUG,
            })
          )}`,
          // 'eslint-loader',
        ],
      }
    );
  } else {
    config.module.loaders.unshift(
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          `babel-loader?${JSON.stringify(
            _.merge({}, babelLoaderQuery, {
              // https://github.com/babel/babel-loader#options
              // Cache babel transforms when in debug mode.
              cacheDirectory: DEBUG,
            })
          )}`,
        ],
      }
    );
  }

  if (DEBUG) {
    config.plugins = [
      new CleanPlugin([BUILT_PATH], { root: PROJECT_ROOT }),

      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"',
        },
      }),
      new HtmlWebpackPlugin({
        template: 'index.html',
        inject: 'body',
        alwaysWriteToDisk: true,
      }),
      new HtmlWebpackHarddiskPlugin(),
    ];
  } else {
    config.plugins = [
      new CleanPlugin([BUILT_PATH], { root: PROJECT_ROOT }),

      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
        },
      }),

      // optimizations
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),

      new HtmlWebpackPlugin({
        template: 'index.html',
        inject: 'body',
      }),
    ];
  }

  if (!options.cssModules) {
    config = cssModules(options, config);
  }

  return config;
}
