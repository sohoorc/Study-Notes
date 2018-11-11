const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');
// webpack4 中推荐使用 mini-css-extract-plugin 代替 extract-text-webpack-plugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    // 出口
    output: {
        pathinfo: false,
        // 所有输出文件的目标路径
        // 必须是绝对路径（使用 Node.js 的 path 模块）
        // path: path.resolve(__dirname, './../build'),
        // 入口的文件名模板
        path: path.resolve(__dirname, './../build'),
        // 入口的文件名模板
        filename: "[name].[chunkhash:8].js"
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
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    // 适用postcss能够自动为浏览器补充css前缀
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
        ]
    },
    // 不适用代码优化
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
    },
    //插进的引用, 压缩，分离美化
    plugins: [

        // HMR 模块热替换，！！！不要再生产环境中使用
        // new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "[id].css"
        }),
        require("autoprefixer")
    ],
    devServer: {
        // 目录
        // contentBase: '.',

        // 启用https
        // https: true,

        // 压缩
        // compress: true,

        // HOST
        host: '127.0.0.1',
        // 端口
        port: 23333,

        // 模块热替换特性 必须有 webpack.HotModuleReplacementPlugin 才能完全启用 HMR
        // hot: true,

        // 报错提示在网页遮罩层
        overlay: true,

        // 指定打开后的导航
        //openPage: '/page'

        // 显示运行进度
        progress: true,
    }
});