const path = require('path');
const helpers = require('./helpers');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const baseConfig = {
  entry: {
    'bundle': helpers.root('/src/main.ts'),
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: helpers.root('dist')
  },
  resolve: {
    extensions: [
      '.ts', '.js', '.vue',
    ],
    alias: {
      '@components': helpers.root('src/components/components/index.ts'),
      '@components': helpers.root('src/components/components'),
      '@views': helpers.root('src/components/views/index.ts'),
      '@views': helpers.root('src/components/views'),
      '@src': helpers.root('src'),
      '@icons': helpers.root('src/assets/icons'),
      '@images': helpers.root('src/assets/images'),
      '@classes': helpers.root('src/classes/index.ts'),
      '@fonts': helpers.root('src/assets/fonts'),
      '@utils': helpers.root('src/utils/index.ts'),
      '@utils': helpers.root('src/utils'),
      '@css': helpers.root('src/styles/variables.scss'),
      '@router': helpers.root('src/router/index.ts'),
      '@validators': helpers.root('src/utils/validators.ts'),
      '@methods': helpers.root('src/utils/methods.ts'),
      '@filters': helpers.root('src/utils/filters.ts'),
      '@types': helpers.root('src/typings/index.ts'),
      '@store': helpers.root('src/store/index.ts'),
      '@modules': helpers.root('src/store/Modules/index.ts'),
    }
  },
  module: {
    rules: [{
      test: /\.vue$/,
      use: {
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: ['vue-style-loader', 'css-loader', 'postcss-loader', 'sass-loader', {
              loader: 'sass-resources-loader',
              options: {
                resources: helpers.root('src/styles/variables.scss'),
                esModule: true
              }
            }],
            ts: 'ts-loader',
          }
        }
      }
    }, {
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: 'ts-loader',
      options: {
        appendTsSuffixTo: [/\.vue$/]
      }
    }, {
      test: /\.(jpe?g|png|ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
    },{
      test: /\.(svg)(\?[a-z0-9=&.]+)?$/,
      use: 'base64-inline-loader?limit=4000&name=[name].[ext]'
    }
  ]
  },
  plugins: [
    new FaviconsWebpackPlugin({
      logo: helpers.root('src/assets/images/logo_M.png'),
      persistentCache: true,
      inject: true,
      background: '#fff',
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    }),
    new CopyWebpackPlugin([{
      from: helpers.root('src/assets')
    }])
  ],
};

module.exports = baseConfig;