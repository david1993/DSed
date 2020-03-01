const webpackCopy = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const outputDirectory = 'dist';

module.exports = {
  mode: "development",
  entry: [
    "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
    "./src/index.js"
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, outputDirectory),
    publicPath: "/",
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
    hotUpdateChunkFilename: ".hot/[id].[hash].hot-update.js",
    hotUpdateMainFilename: ".hot/[hash].hot-update.json"
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: "babel-loader",
        exclude: "/node_modules/"
      },
      {
        test: /\.vue?$/,
        loader: "vue-loader"
      },
      {
        test: /\.css$/,
        use: [
          "vue-style-loader",
          {
            loader: "css-loader",
            options: { importLoaders: 1 }
          },
          "postcss-loader"
        ]
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|ttf|eot|wav|mp3)$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      "typeof window": JSON.stringify("object")
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpackCopy([
      { from: "node_modules/vue/dist/vue.min.js", to: "extLib/vue.min.js" },
      { from: "node_modules/vuex/dist/vuex.min.js", to: "extLib/vuex.min.js" }
    ])
  ],
  externals: {
    vue: "Vue",
    vuex: "Vuex",
    config: JSON.stringify({
      apiUrl: "http://localhost:3000"
    })
  }
};
