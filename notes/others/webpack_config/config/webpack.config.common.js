const path = require('path');
const webpack = require('webpack');
// 打包HTML文件
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 入口
    entry: './src/index.tsx',
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js", '.jsx']
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
        }),
    ],


}