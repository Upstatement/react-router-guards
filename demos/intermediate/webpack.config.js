'use strict';

const path = require('path');
const chalk = require('chalk');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const SRC_DIR = path.join(__dirname, 'src');
const PUBLIC_DIR = path.join(__dirname, 'public');
const DIST_DIR = path.join(__dirname, 'dist');

const PORT = 3001;

module.exports = () => ({
  entry: ['@babel/polyfill', path.join(SRC_DIR, 'index.tsx')],
  output: {
    path: DIST_DIR,
    filename: 'app.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /\.tsx$/,
        loader: 'babel-loader!ts-loader',
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
    before() {
      console.clear();
    },
    contentBase: SRC_DIR,
    historyApiFallback: true,
    host: '0.0.0.0',
    port: PORT,
    public: `localhost:${PORT}`,
    publicPath: '/',
    quiet: true,
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(PUBLIC_DIR, 'img'),
        to: 'img',
        toType: 'dir',
      },
    ]),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`The demo is accessible at ${chalk.blue(`http://localhost:${PORT}`)}`],
        notes: [
          `Note that the development build is not optimized`,
          `To create a production build, use ${chalk.blue('npm run build')}.`,
        ],
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(PUBLIC_DIR, 'index.html'),
      favicon: path.join(PUBLIC_DIR, 'favicon.ico'),
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
      }),
    ],
  },
});
