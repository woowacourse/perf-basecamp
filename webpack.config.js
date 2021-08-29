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
        width: 100,
        height: 100,
      },
      imgInfo: {
        width: 1920,
        height: 1080,
        quality: 100,
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
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp)$/i,
        loader: "file-loader",
        options: {
          name: "static/[name].[ext]",
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
