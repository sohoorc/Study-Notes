const path = require('path');
// 打包HTML文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// webpack4 中推荐使用 mini-css-extract-plugin 代替 extract-text-webpack-plugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 判断是否属于开发模式
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  // 模式
  mode: devMode ? 'development' : 'production',
  // 入口
  entry: './src/index.tsx',
  devtool: devMode ? 'cheap-module-eval-source-map' : 'source-map',
  // 出口
  output: {
    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）
    path: path.resolve(__dirname, 'build'),
    // 入口的文件名模板
    filename: "[name].[chunkhash:8].js"
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js", '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(ts|tsx)$/,
        // include: paths.appSrc,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true,
            },
          },
        ],
      },
      // 针对静态文件
      {
        test: /\.(png|jpg|gif)$/,
        loader: "url-loader",
        options: {
          limit: 10000
        }
      },
      {
        test: /\.css$/,
        use: [
          // 当开发模式时，使用style-loader直接引入css样式，不进行压缩。
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                }),
              ],
            },
          },
        ]
      },
      {// 配置svg图标loader，可以在项目中通过组件的形式直接引入svg图标
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      // { // 支持typescript
      //   test: /\.tsx?$/,
      //   use: [
      //     {
      //       loader: 'ts-loader',
      //       options: {
      //         transpileOnly: true
      //       }
      //     }
      //   ]
      // },

    ]
  },
  //插进的引用, 压缩，分离美化
  plugins: [
    // HTML模板文件处理插件
    new HtmlWebpackPlugin({
      file: 'index.html',
      template: 'public/index.html'
    }),
    // 
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "[id].css"
    }),
    require("autoprefixer")
  ],
  // 开发环境中的服务配置
  // 配置webpack-dev-server 在开发中监听代码改变从而实现reload
  devServer: {
    // 目录
    contentBase: './build',
    // HOST
    host: '127.0.0.1',
    // 端口
    port: 23333
  }
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //     name: false,
  //   },
  //   // Keep the runtime chunk seperated to enable long term caching
  //   // https://twitter.com/wSokra/status/969679223278505985
  //   // runtimeChunk: true,
  // }
}