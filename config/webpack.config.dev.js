const webpackBaseConfig = require('./webpack.config.base');
const env = require('../environment/dev.env');
const webpack = require('webpack')
const path = require('path');
const helpers = require('./helpers');
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const webpackDashboard = require('webpack-dashboard/plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const autoprefixer = require('autoprefixer');

const webpackDevConfig = {
  module: {
    rules: [{
      test: /\.s?css$/,
      use: [{
        loader: 'style-loader'
        }, {
        loader: 'css-loader',
        options: {
          minimize: false,
          sourceMap: true,
          importLoaders: 2
        }
        }, {
        loader: 'postcss-loader',
        options: {
          plugins: () => [autoprefixer],
          sourceMap: true
        }
        }, {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: true,
          sourceMapContents: true
        }
      }],
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: helpers.root('/src/index.html'),
      filename: 'index.html',
      favicon: helpers.root('/src/assets/images/logo_M.png')
    }),
    new DefinePlugin({
      'process.env': env
    }),
    new webpackDashboard(),
    new FriendlyErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 5000,
    historyApiFallback: true,
    disableHostCheck: true,
    host: "0.0.0.0",
    hot: true,
    quiet: true,
    inline: true,
    noInfo: true,
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: true,
      warnings: false,
      publicPath: false
    }
  },
  devtool: 'cheap-module-eval-source-map'
}

const devExport = merge(webpackBaseConfig, webpackDevConfig);

module.exports = devExport;