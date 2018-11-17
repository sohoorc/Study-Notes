const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');
// webpack4 中推荐使用 mini-css-extract-plugin 代替 extract-text-webpack-plugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 每次执行打包 先清除之前的打包文件
const CleanWebpackPlugin = require('clean-webpack-plugin');

const appSrc = path.resolve(__dirname,'../src')

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    // 出口
    output: {
        pathinfo: false,
        chunkFilename: 'js/[name].chunk.js',
        // 所有输出文件的目标路径
        // 必须是绝对路径（使用 Node.js 的 path 模块）
        // path: path.resolve(__dirname, './../build'),
        path: path.resolve(__dirname, './../build'),
        filename: "js/[name].[chunkhash:8].js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: appSrc,
                // exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(ts|tsx)$/,
                include: appSrc,
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
                    limit: 10000,
                    name: 'static/[name].[hash:8].[ext]',
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            minimize: true
                        }
                    },
                    // 适用postcss处理css，autoprefixer能够自动为浏览器补充css前缀
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
            // {// 配置svg图标loader，可以在项目中通过组件的形式直接引入svg图标
            //     test: /\.svg$/,
            //     use: [
            //         '@svgr/webpack',
            //         'url-loader'
            //     ]
            // }
        ]
    },
    // 代码优化
    optimization: {
        minimize: true,
        splitChunks: {
            chunks: "async", // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
            minSize: 30000, // 最小尺寸，30000
            minChunks: 1, // 最小 chunk ，默认1
            maxAsyncRequests: 5, // 最大异步请求数， 默认5
            maxInitialRequests: 3, // 最大初始化请求书，默认3
            automaticNameDelimiter: '~',// 打包分隔符
            name: '', // 打包后的名称，此选项可接收 function
            cacheGroups: { // 这里开始设置缓存的 chunks
                lodash: { // 这里假设我们独立抽离出lodash
                    priority: 1, // 缓存组优先级
                    chunks: "initial", // 必须三选一： "initial" | "all" | "async"(默认就是async) 
                    test: /lodash/, // 正则规则验证，如果符合就提取 chunk
                    name: "lodash", // 要缓存的 分隔出来的 chunk 名称 
                    minSize: 30000,
                    minChunks: 1,
                    enforce: true,
                    maxAsyncRequests: 5, // 最大异步请求数， 默认1
                    maxInitialRequests: 3, // 最大初始化请求书，默认1
                    reuseExistingChunk: true // 可设置是否重用该chunk
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                  }
            }
        }
    },
    //插进的引用, 压缩，分离美化
    plugins: [

        // HMR 模块热替换，！！！不要再生产环境中使用
        // new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash].css",
            chunkFilename: "css/[id].[hash].css",
        }),
        require("autoprefixer"),
        // 打包前清除之前的build目录
        new CleanWebpackPlugin(['build'], path.resolve(__dirname, '../'))
    ]
});