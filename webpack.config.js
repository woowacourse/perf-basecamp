const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ImageResizePlugin = require("webpack-image-resize-plugin");

module.exports = {
  entry: {
    main: "./src/index.js",
  },
  resolve: { extensions: [".js", ".jsx"] },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "/dist"),
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new Dotenv(),
    new CleanWebpackPlugin(),
    new ImageResizePlugin({
      gifInfo: {
        scale: 0.3,
      },
      imgInfo: {
        width: 1600,
        height: 900,
        quality: 50,
      },
    }),
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
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|gif)$/i,
        loader: "file-loader",
        options: {
          name: "static/[name].[ext]",
        },
      },
      {
        test: /\.(png|jpg|webp)$/i,
        loader: "file-loader",
        options: {
          name: "static/[name].webp",
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    concatenateModules: true,
    runtimeChunk: true,
    splitChunks: {
      chunks: "all",
    },
  },
};
