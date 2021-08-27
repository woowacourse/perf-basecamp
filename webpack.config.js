const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  entry: "./src/index.js",
  resolve: { extensions: [".js", ".jsx"] },
  output: {
    filename: "[name].[hash].js",
    chunkFilename: "[id].[chunkhash].js",
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
    })
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
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
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