webpackConfig = require('./webpack.config.base'),
  helpers = require('./helpers'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  DefinePlugin = require('webpack/lib/DefinePlugin'),
  autoprefixer = require('autoprefixer'),
  env = require('../environment/dev.env');
const path = require('path');

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
})
];

module.exports = webpackConfig;