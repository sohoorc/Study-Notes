// 打包HTML文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const appSrc = path.resolve(__dirname, '../src')

module.exports = {
    // 入口
    entry: './src/index.tsx',
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js", '.jsx']
    },
    module: {
        rules: [
            {// 配置svg图标loader，可以在项目中通过组件的形式直接引入svg图标
                test: /\.svg$/,
                include: appSrc,
                use: [
                    '@svgr/webpack',
                    'url-loader'
                ]
            }
        ]
    },
    // 性能提示
    performance: {
        hints: 'warning'
    },
    //插进的引用, 压缩，分离美化
    plugins: [
        // HTML模板文件处理插件
        new HtmlWebpackPlugin({
            file: 'index.html',
            template: 'public/index.html'
        })
    ]
}