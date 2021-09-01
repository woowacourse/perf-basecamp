const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CompressionPlugin = require("compression-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const zlib = require("zlib");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new CompressionPlugin({
      filename: "[path][base].br",
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: ["...", new CssMinimizerPlugin(), new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        react: {
          chunks: "all",
          name: "react",
          test: /(?<!node_modules.*)[\/]node_modules[\/](react|react-dom|react-router-dom)[\/]/,
          priority: 40,
        },
        duplicates: {
          name: "duplicates",
          minChunks: 2,
          priority: 30,
        },
        async: {
          chunks: "async",
          priority: 20,
        },
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "node_vendors",
          chunks: "all",
          priority: 10,
        },
        default: {
          reuseExistingChunk: true,
          minChunks: 2,
          priority: -10,
        },
      },
    },
  },
});
