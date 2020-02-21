const path = require('path');
const fs = require('fs');
/* eslint-disable import/no-extraneous-dependencies */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
/* eslint-enable import/no-extraneous-dependencies */

const includePaths = [
  fs.realpathSync(`${__dirname}/src`),
  /\/node_modules\/tuiomanager/,
];

const resolvePaths = [
  fs.realpathSync(`${__dirname}/node_modules/`),
];

const htmlWebpackPluginInstance = new HtmlWebpackPlugin({
  template: './index.ejs',
  filename: './index.html',
  showErrors: true,
});
const copyWebpackPluginInstance = new CopyWebpackPlugin(
  [
    { from: './assets', to: './assets' },
  ],
  {
    copyUnmodified: false,
    debug: 'debug',
  }
);

module.exports = () => (
  {
    mode: 'development',
    devServer: {
      inline: true,
      historyApiFallback: true,
      port: 3000,
      host: '192.168.1.16',
    },
    entry: './src/index.js',
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      filename: 'index.js',
    },
    resolve: {
      extensions: ['.js'],
      modules: resolvePaths,
      enforceExtension: false,
    },
    resolveLoader: {
      modules: resolvePaths,
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          use: [
            {
              loader: 'babel-loader',
              query: {
                babelrc: true,
              },
            },
            {
              loader: 'eslint-loader',
            },
          ],
          include: includePaths,
          exclude: /node_modules/,
        },
        {
          test: /\.json$/,
          loader: 'json',
        },
      ],
    },
    plugins: [
      htmlWebpackPluginInstance,
      copyWebpackPluginInstance
    ]
  }
);
