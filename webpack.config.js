const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env) => ({
  entry: "./src/index.jsx",
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
  devtool: "source-map",
  mode: env.production ? "production" : "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.[contenthash].html",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "./public", to: "./public" }],
    }),
    new Dotenv(),
    env.production &&
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash].css",
      }),
  ].filter(Boolean),
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
        use: [
          env.production ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webm|mp4|webp)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/[name].[hash][ext]",
        },
      },
    ],
  },
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  target: "web",
});
