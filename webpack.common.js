const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  entry: {
    index: "./src/index.js",
    Home: "./src/pages/Home/Home.jsx",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  output: {
    filename: "[name].[contenthash].bundle.js",
    path: path.join(__dirname, "/dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "./public", to: "./public" }],
    }),
    new Dotenv(),
    new BundleAnalyzerPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|avif|webp)$/i,
        loader: "file-loader",
        options: {
          name: "static/[name].[ext]",
        },
      },
    ],
  },
};
