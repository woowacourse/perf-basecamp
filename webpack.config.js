const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInjectPreload = require("@principalstudio/html-webpack-inject-preload");
const Dotenv = require("dotenv-webpack");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  entry: "./src/index.js",
  resolve: { extensions: [".js", ".jsx"] },
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "/dist"),
    clean: true,
  },
  ...(!isProduction && {
    devServer: {
      hot: true,
      historyApiFallback: true,
    },
  }),
  devtool: isProduction ? false : "eval-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
    }),
    new HtmlWebpackInjectPreload({
      files: [
        {
          match: /.*\.jpg$/,
          attributes: { as: "image" },
        },
        {
          match: /.*\.mp4$/,
          attributes: { as: "video" },
        },
      ],
    }),
    new Dotenv(),
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
        test: /\.(mp4|eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
