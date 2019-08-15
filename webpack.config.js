const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safeParser = require('postcss-safe-parser')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const config = require('@dtwave/oner-server/common/config')
const _ = require('lodash')
const pkg = require('./package.json')
const themeConfig = require(pkg.theme)
const theme = themeConfig()

let commonPlugins = []
const HOST = '0.0.0.0'
const PORT = config('client.port')
const clientIsDev = config('client.isDevelopment')

// entry
let entry = {}
const pathStr = `${__dirname}/src`
const files = fs.readdirSync(pathStr)
files.forEach(file => {
  const stat = fs.lstatSync(`${pathStr}/${file}`)
  if (stat.isDirectory() && file.includes('page-')) {
    entry[file.replace('page-', '')] = `./src/${file}`
  }
})

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  devServer: {
    contentBase: [path.join(__dirname, 'node_modules')],
    compress: true,
    inline: true,
    hot: true,
    port: PORT,
    host: HOST,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    noInfo: true,
  },
  entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    // 决定静态资源的url前缀，注意包括chunk，所以要同时把dev和pro环境都配对
    // publicPath: config('client.url.host') + config('client.url.staticPath'),
    publicPath: clientIsDev ? `//${config.get('server.ip')}:${PORT}/static/` : `//cdn.dtwave.com/${config('client.name')}/${config('client.version')}/`,
    pathinfo: false,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          test: /[\\/]node_modules[\\/] || src\//,
          chunks: 'all',
          name: 'common',
          minSize: 0,
          minChunks: 2,
          enforce: true,
        },
      },
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
          ecma: 5,
          mangle: true,
        },
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessorOptions: {
          parser: safeParser,
          discardComments: {
            removeAll: true,
          },
        },
      }),
    ],
  },
  resolve: {
    alias: {
      uikit: '@dtwave/uikit',
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader?cacheDirectory'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.styl$/,
        use: [
          clientIsDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'stylus-loader',
        ],
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          clientIsDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`,
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        exclude: [path.resolve(__dirname, './src/svg-icon')],
        use: [{
          loader: 'url-loader',
          query: {
            name: '[name].[hash:8].[ext]',
            limit: 1024 * 10,
          },
        }],
      },
      {
        test: /^((?!\.color).)*((?!\.color).)\.svg$/,
        include: [
          path.resolve(__dirname, './src/svg-icon'),
        ],
        use: [
          {loader: 'svg-sprite-loader'},
          {loader: 'svgo-loader', options: {
            plugins: [
              {removeTitle: true},
              {convertColors: {shorthex: true}},
              {convertPathData: true},
              {removeComments: true},
              {removeDesc: true},
              {removeUselessDefs: true},
              {removeEmptyAttrs: true},
              {removeHiddenElems: true},
              {removeEmptyText: true},
              {removeUselessStrokeAndFill: true},
              {moveElemsAttrsToGroup: true},
              {removeStyleElement: true},
              {cleanupEnableBackground: true},
              {removeAttrs: {attrs: '(stroke|fill)'}},
            ],
          }},
        ],
      },
      {
        test: /[A-Za-z0-9-.]+\.color\.svg$/,
        include: [
          path.resolve(__dirname, './src/svg-icon'),
        ],
        use: [
          {loader: 'svg-sprite-loader'},
          {loader: 'svgo-loader', options: {
            plugins: [
              {removeTitle: true},
              {convertColors: {shorthex: true}},
              {convertPathData: true},
              {removeComments: true},
              {removeDesc: true},
              {removeUselessDefs: true},
              {removeEmptyAttrs: true},
              {removeHiddenElems: true},
              {removeEmptyText: true},
              {removeUselessStrokeAndFill: true},
              {moveElemsAttrsToGroup: true},
              {removeStyleElement: true},
              {cleanupEnableBackground: true},
            ],
          }},
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: clientIsDev,
      __PRO__: !clientIsDev,
    }),
    new webpack.ProvidePlugin({
      lodash: '_',
      moment: 'moment',
    }),
  ],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    mobx: 'mobx',
    'mobx-react': 'mobxReact',
    _: '_',
    antd: 'antd',
    moment: 'moment',
  },
}

if (!clientIsDev) {
  // 线上环境
  commonPlugins = [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
    }),
  ]
  // module.exports.devtool = 'source-map'
} else {
  // 开发环境
  commonPlugins = [
    new webpack.HotModuleReplacementPlugin(),
  ]
  module.exports.devtool = 'eval-cheap-module-source-map'
}

module.exports.plugins = module.exports.plugins.concat(commonPlugins)
