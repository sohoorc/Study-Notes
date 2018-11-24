const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');
const path = require('path');
// 项目优化插件 作用：各依赖大小展示，方便优化打包代码大小
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const appSrc = path.resolve(__dirname, '../src')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    // 出口
    output: {
        pathinfo: true,
        // 所有输出文件的目标路径
        // 必须是绝对路径（使用 Node.js 的 path 模块）
        // path: path.resolve(__dirname, './../build'),
        // 输出的文件名配置
        chunkFilename: '[name].chunk.js',
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                // exclude: /node_modules/,
                include: appSrc,
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
                            experimentalWatchApi:true
                        },
                    },
                ],
            },
            // 针对静态文件
            {
                test: /\.(png|jpg|gif)$/,
                loader: "url-loader",
                options: {
                    limit: 8192,
                    name: 'static/[name].[hash:8].[ext]',
                }
            },
            {
                test: /\.css$/,
                include: appSrc,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    // 使用postcss能够自动为浏览器补充css前缀
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
            }
        ]
    },
    // 开发模式中不适用代码优化
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
    },
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
    },
    plugins: [
        new BundleAnalyzerPlugin()
    ]
});