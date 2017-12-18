const webpackConfig = require('./webpack.config.base')
const helpers = require('./helpers')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const autoprefixer = require('autoprefixer')
const env = require('../environment/dev.env')
const path = require('path');
const FriendlyErrors = require('friendly-errors-webpack-plugin');


webpackConfig.module.rules = [...webpackConfig.module.rules,
  {
    test: /\.scss$/,
    use: [{
      loader: 'style-loader'
    },
    {
      loader: 'css-loader',
      options: {
        minimize: false,
        sourceMap: true,
        importLoaders: 2
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => [autoprefixer],
        sourceMap: true
      }
    },
    {
      loader: 'sass-loader',
      options: {
        outputStyle: 'expanded',
        sourceMap: true,
        sourceMapContents: true
      }
    }
    ],
  }, {
    test: /\.(jpe?g|png|ttf|eot|svg|ico|woff(2)?)(\?[a-z0-9=&.]+)?$/,
    use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
  }
];

webpackConfig.plugins = [...webpackConfig.plugins,
  new HtmlWebpackPlugin({
    inject: true,
    template: helpers.root('/src/index.html'),
    filename: 'index.html'
  }),
  new DefinePlugin({
    'process.env': env
  }),
  new FriendlyErrors(),
];

module.exports = webpackConfig;