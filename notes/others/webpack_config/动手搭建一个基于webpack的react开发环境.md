# 动手搭建一个基于webpack4的react开发环境

## 前言

webpack作为现代前端技术的基石，相信绝大部分的前端开发者都听说或是在项目中使用过。但是由于现在各种各样cli工具的出现，能够掌握webpack基本配置和使用的人，可能就不那么多了。

最开始接触webpack还是在以前的angular.js项目中，之后从angular.js转到react后一直使用的create-react-app进行项目初始化。需要改动webpack配置时也是在使用eject命令暴露出webpack config进行修改，一直没有自己从零开始配置过。在这期间angular.js升级成为Angular，jQuery真正的被历史淘汰，Vue也从一个后期之秀成为现在的当红前端框架。不得不说，前端技术的更新迭代速度真的可以用飞速来形容了。在如此快速的更新速度下，作为一个一线的前端开发人员，一定要紧跟技术的步伐，时刻保持着学习状态，才能保证自己在大潮流中不掉队。这也是我写这篇文章的初衷，用来记录自己的学习成果。

## 正文

### 简介

webpack是什么？

> 本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(static module bundler)。在 webpack 处理应用程序时，它会在内部创建一个依赖图(dependency graph)，用于映射到项目需要的每个模块，然后将所有这些依赖生成到一个或多个bundle。—— 来自 webpack 官方文档

简单的说，webpack就是一个现代前端开发的打包机。现代前端非常流行使用模块化的方式开发，webpack所做的就是将各个js模块合理的打包成bundle或者chunk。在打包的过程中，可以通过loader的方式，将新的js语法、CSS预处理语言等转换成更容易被浏览器支持的形式。

webpack是基于nodejs的，在绝大部分时，我们在使用时需要为它写一个配置文件。这个配置文件的主要结构如下：

```
module.exports = {
    mode: 'development'      // 模式配置
    entry: '',               // 入口文件
    output: {},              // 出口文件
    module: {},              // 处理对应模块
    plugins: [],             // 对应的插件
    devServer: {},           // 开发服务器配置（仅在开发中使用）
}
```

接下来，我们就来一步步的完成这些配置。

要注意的是，本文不会赘述现代前端开发中的一些基础知识，如 npm依赖管理、模块化等基础知识。所以，若你并没有听说过webpack，或不知道它是什么，那么建议你还是先了解一下基础知识。若对webpack已经了如指掌，那么也大可不必看这篇文章。不过大佬若是愿意指导一番，我也是非常开心的！！^_^

### 初始化和安装

在指定文件夹下执行 `npm init` 进行初始化。

`mkdir webpackDemo&&npm init`

由于我们的项目不是一个要发布的项目，所以执行npm init后只用一路回车即可。

#### 安装webpack

通过npm安装:

`npm install --save-dev webpack`

通过yarn安装:

`yarn add webpack --dev`

<b>在webpack4之后的版本中，还需要安装webpack-cli，具体方法同上。</b>

### 模式 (mode)

webpack4中新增的概念，它有三个选项：`development`、`production`、`none`，用来设置webpack的优化方式。

#### development

开发模式，该模式优化了开发速度，提供了详细的错误机制和浏览器调试工具。并且关闭了代码压缩，使代码能够更快的构建。

#### production

生产模式，该模式能够提供更小的代码包,去除了只在开发阶段运行的代码。自动开启了代码混淆压缩。

#### 配置方法

```
module.export = {
  mode:'production' // 'development'||'production'||'none'
}
```

### 程序入口 (entry)

在这里，我们可以声明一个应用的起点。入口可以有一个或者多个。在单页应用中，入口一般只有一个。不过也可以将公共依赖配置成为单页应用的入口，这样单页应用也可以有多个入口。而在多页应用中，一般会有多个入口文件。

一个简单的单页应用入口如下：

```
entry:'./src/index.js'
```

这样，我们就将src目录下的index.js文件作为程序的入口。

### 输出 (output)

output用来配置项目打包后的文件名称、路径。用来告诉webpack怎么输出、输出到哪、叫什么名字。

```

output: {
    // 在bundle中引入注释 注意：该选项不应该在生产模式中启用
    pathinfo:true,
    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）
    path: path.resolve(__dirname, './../build'),
    // 输出的文件名配置
    filename: "[name].[hash].js"
}
```

这里的filename我们并没有给它一个实际的名称，而是使用模板字符串去设置webpack生成后的文件名称。这个设置中的[name]代表模块名称，在单入口文件中默认为main。而[hash]则会生成一个模块标识符的hash,默认是20位，我们可以通过[hash:16]的方式指定它的位数。打包后的文件名称就像这样`main.f236aaeca342dfb1f8dd.js`。在生成文件名称后跟上hash有助于我们在项目重新部署后，由于引用的文件名称变了，浏览器将会立马去下载新的文件，不会继续使用本地的缓存。

### loader  

webpack的作用就是将前端开发中的各个模块进行处理以及打包。而loader的作用就是处理webpack中的这些模块。

webpack中模块有很多种，常见的有：

- 模块化的js文件

- css/less/sass文件

- 图片以及静态文件

loader在module中配置：

```
// 示例

module.exports =  {
    mode: 'development',
    // 入口
    entry: './src/index.js',
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
            // 在这列配置loader
        ]
    }
};

```

我们要对这些模块进行处理，就要使用到不同的loader。在此之前，我们先简单的介绍一下我们需要使用到的loader。

#### babel-loader

babel是一个语法转换器，能够让你自由的使用JavaScript的最新语法。它能够将我们所写的新语法、jsx等转换成浏览器能够友好支持的形式。

要使用babel-loader我们需要下列依赖,我们可以通过执行`npm install --save-dev babel-loader @babel/core @babel/preset-react @babel/preset-env`安装它们。

- babel-loader

- @babel/core

    babel的核心组件,里面包含着babel的api。

- @babel/preset-env

    用来转义JavaScript语法。

- @babel/preset-react

    用来转义react。

配置babel-loader：

```
module.exports =  {
    mode: 'development',
    // 入口
    entry: './src/index.js',
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
                exclude: /node_modules/,
                include: appSrc,
                loader: "babel-loader"
            }
        ]
    }
};
```

完成上述配置后，别忘了还有一部。在<b>项目根目录</b>创建babel的配置文件    `.babelrc`。

后面的后缀rc来自linux中，使用过linux就知道linux中很多rc结尾的文件，比如.bashrc，rc是run command的缩写，翻译成中文就是运行时的命令，表示程序执行时就会来调用这个文件。

babel所有的操作基本都会来读取这个配置文件，除了一些在回调函数中设置options参数的，如果没有这个配置文件，会从package.json文件的babel属性中读取配置。

在`.babelrc`中添加下列语句：

```
{
    "presets": ["@babel/preset-env","@babel/preset-react"]
}
```

目的是为了告诉babel，转义es2015和react的语法。

#### url-loader

#### style-loader

#### css-loader

完成一个简单的模块处理配置:

```

  module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader"
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
    }

```

### 插件

### devServer