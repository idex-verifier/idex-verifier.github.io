"use strict";

var join = require('path').join,
  webpack = require('webpack'),
  HTMLWebpackPlugin = require('html-webpack-plugin');

var entry = join(__dirname, 'assets', 'main.js');

module.exports = {
  entry: process.env.NODE_ENV === 'development' ? [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    entry
  ] : entry,
  output: {
    path: __dirname,
    filename: 'bundle-[hash].js'
  },
  devtool: 'source-map',
  devServer: {
    port: 3000
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new HTMLWebpackPlugin({
      template: join(__dirname, 'assets', 'index.ejs')
    })
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'stage-2', 'react'],
        plugins: ['add-module-exports']
      }
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.gif/,
      loader: 'url-loader?limit=10000&mimetype=image/gif'
    }, {
      test: /\.jpe?g/i,
      loader: 'url-loader?limit=340000&mimetype=image/jpg'
    }, {
      test: /\.png/i,
      loader: 'url-loader?limit=340000&mimetype=image/png'
    }, {
      test: /\.woff|woff2$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.ttf$/,
      loader: 'url-loader?limit=200000&mimetype=application/octet-stream'
    }, {
      test: /(?:\.(?:eot))(\?.*$|$)/,
      loader: 'file-loader'
    }, {
      test: /\.svg$/,
      loader: 'svg-url-loader?limit=8000000'
    }]
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json']
  }
};
