const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const isProduction = process.env.NODE_ENV === "prodcution";

module.exports = {
  entry: "./src/index.js",
  resolve: { extensions: [".js", ".jsx"] },
  output: {
    filename: "[name].[contenthash].js",
    path: path.join(__dirname, "/dist"),
    clean: true,
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "./public", to: "./public" }],
    }),
    new CompressionPlugin({
      deleteOriginalAssets: false,
      filename: "[path][base].gz",
    }),
    new Dotenv(),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [["webp", { quality: 1 }], ["gifsicle"]],
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g)$/i,
        loader: "file-loader",
        options: {
          name: "static/[name].webp",
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|gif|webm)$/i,
        loader: "file-loader",
        options: {
          name: "static/[name].[ext]",
        },
      },
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: "all",
    },
  },
};
