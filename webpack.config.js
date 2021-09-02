const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  resolve: { extensions: [".js", ".jsx"] },
  output: {
    filename: "[name].[chunkhash].bundle.js",
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
    new Dotenv(),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "esbuild-loader",
        exclude: /node_modules/,
        options: {
          loader: "jsx",
          target: "es2015",
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|mp4)$/i,
        loader: "file-loader",
        options: {
          name: "static/[name].[ext]",
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 1,
        },
        reactBundle: {
          name: "reactBundle",
          test: /[\\/]node_modules[\\/](react|react-dom)/,
          chunks: "all",
          priority: 10,
        },
      },
    },
  },
};
