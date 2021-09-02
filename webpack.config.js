const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const  CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: process.env.NODE_ENV,
  resolve: { extensions: [".js", ".jsx"] },
  output: {
    filename: "[name].[contenthash].js",
    chunkFilename: "[id].[contenthash].js",
    path: path.join(__dirname, "/dist"),
    clean: true,
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
    new CopyWebpackPlugin({
      patterns: [{ from: "./public", to: "./public" }]
    }),
    new Dotenv(),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "docs/report.html",
      openAnalyzer: false,
    }),
    new CompressionPlugin({
      test: /\.(js|js\.map)?$/i
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|jpeg|gif|webp)$/i,
        loader: "file-loader",
        options: {
          name: "static/[name].[ext]"
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        defaultVendors: false,
        react: {
          chunks: "all",
          name: "react",
          test: /(?<!node_modules.*)[\/]node_modules[\/](react|react-dom|react-router-dom)[\/]/,
          priority: 40,
        },
        asyncComponents: {
          chunks: "async",
          priority: 20,
        },
        duplicates: {
          name: "duplicates",
          minChunks: 2,
          priority: 30,
        },
        commonVendors: {
          chunks: "all",
          name: 'commonVendors',
          test: /[\/]node_modules[\/]/,
          minChunks: 1,
          priority: 10,
        }
      }
    }
  }
};
