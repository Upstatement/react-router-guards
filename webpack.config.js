'use strict';

const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC_DIR = path.join(__dirname, 'src');
const PUBLIC_DIR = path.join(__dirname, 'public');
const DIST_DIR = path.join(__dirname, 'dist');

module.exports = () => ({
  entry: ['@babel/polyfill', path.join(SRC_DIR, 'index.js')],
  output: {
    path: DIST_DIR,
    filename: 'app.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              camelCase: true,
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              data: `@import "abstracts";`,
              includePaths: [path.resolve(__dirname, 'src/style')],
            },
          },
        ],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf)$/,
        loader: 'url-loader',
      },
    ],
  },
  devServer: {
    host: 'localhost',
    port: 3000,
    historyApiFallback: true,
    publicPath: '/',
    contentBase: SRC_DIR,
    open: true,
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(SRC_DIR, 'static'),
        to: 'static',
        toType: 'dir',
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.join(PUBLIC_DIR, 'index.html'),
      favicon: path.join(PUBLIC_DIR, 'favicon.ico'),
    }),
  ],
  resolve: {
    extensions: ['*', '.js', '.json'],
  },
});
