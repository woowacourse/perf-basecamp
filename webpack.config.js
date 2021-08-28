const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = () => {
  const isDevelopment = process.env.NODE_ENV !== "production";

  return {
    mode: isDevelopment ? "development" : "production",
    devtool: isDevelopment ? "eval-source-map" : "source-map",
    entry: "./src/index.js",
    resolve: { extensions: [".js", ".jsx"] },
    output: {
      filename: "bundle.js",
      assetModuleFilename: "images/[hash][ext][query]",
      path: path.join(__dirname, "/dist"),
      clean: true,
    },
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true,
    },
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
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html",

        minify: {
          collapseWhitespace: true,
          removeComments: true,
        },
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: "./public", to: "./public" }],
      }),
      new Dotenv(),
      new MiniCssExtractPlugin(),
    ],
  };
};
