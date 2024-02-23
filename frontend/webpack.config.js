const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
  entry: {
    app: path.join(__dirname, 'src/index.tsx')
  },
  output: {
    path: path.join(__dirname, 'dist')
  },
  devServer: {
    port: 3000,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ]
};
