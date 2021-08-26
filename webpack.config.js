const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const isProduction = process.env.NODE_ENV;

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
      open: true,
      historyApiFallback: true,
    },
  }),
  devtool: isProduction ? false : "eval-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
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
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
