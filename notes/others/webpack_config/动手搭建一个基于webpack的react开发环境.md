# 动手搭建一个基于webpack4的react开发环境

## 前言

webpack作为现代前端技术的基石，相信绝大部分的前端开发者都听说或是在项目中使用过。但是由于现在各种各样cli工具的出现，能够掌握webpack基本配置和使用的人，可能就不那么多了。

最开始接触webpack还是在以前的angular.js项目中，之后从angular.js转到react后一直使用的create-react-app进行项目初始化。需要改动webpack配置时也是在使用eject命令暴露出webpack config进行修改，一直没有自己从零开始配置过。在这期间angular.js升级成为Angular，jQuery逐渐被历史淘汰，Vue也从一个后期之秀成为现在的当红前端框架。不得不说，前端技术的更新迭代速度真的可以用飞速来形容了。在如此快速的更新速度下，作为一个前端开发人员，一定要紧跟技术的步伐，时刻保持着学习状态，才能保证自己在大潮流中不掉队。这也是我写这篇文章的初衷，用来记录自己的学习成果。

要注意的是，本文不会赘述现代前端开发中的一些基础知识，如 npm依赖管理、模块化等基础知识。所以，若你并没有听说过webpack，或不知道它是什么，那么建议你还是先了解一下基础知识。若对webpack已经了如指掌，那么也大可不必看这篇文章。不过大佬若是愿意指导一番，我也是非常开心的！！^_^

## 正文

### 简介

webpack是什么？

> 本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(static module bundler)。在 webpack 处理应用程序时，它会在内部创建一个依赖图(dependency graph)，用于映射到项目需要的每个模块，然后将所有这些依赖生成到一个或多个bundle。—— 来自 webpack 官方文档

简单的说，webpack就是一个现代前端开发的打包机。现代前端非常流行使用模块化的方式开发，webpack所做的就是将各个js模块合理的打包成bundle或者chunk。在打包的过程中，可以通过loader的方式，将新的js语法、CSS预处理语言等转换成更容易被浏览器支持的形式。

webpack是基于nodejs的，在绝大部分时，在使用时需要为它写一个配置文件。这个配置文件的主要结构如下：

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

### 准备

#### 初始化和安装

在指定文件夹下执行 `npm init` 进行初始化。

`mkdir webpackDemo&&npm init`

因为项目并不是一个要发布到npm的项目，所以执行npm init后只用一路回车即可。

安装webpack和react的依赖:

`npm install --save-dev webpack react react-dom`

<b>在webpack4之后的版本中，还需要安装webpack-cli，具体方法同上。</b>

#### 创建初始目录结构和文件

在项目根目录创建config文件夹，并在内创建webpack.config.js。

打开根目录下的package.json 配置`scripts`:

```
"scripts": {
    "build": "webpack --mode production --config ./config/webpack.config.js",
  }
```

配置scripts脚本是为了后期在执行过程中只用在命令行中输入 npm '脚本中指定配置' 就能够完成命令行的输入操作。比如输入 npm build，就会自动执行 "webpack --mode production --config ./config/webpack.config.js" 这一长串的操作。

创建代码文件夹和react的入口文件：

在项目根目录中创建src文件夹，并在内创建index.js、App.js、index.css。

index.js

```
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

App.js

```
import React from 'react';

export default class App extends React.Component {
    render() {
        return <div>
            <p className="text">动手搭建一个基于webpack4的react开发环境</p>
        </div>
    }
}
```

index.css

```
.text{
    color:'red'
}
```

完成上述操作后，项目目录结构应该像下面这样

```
webpackDemo
│   node_modules
└───config
    │   webpack.config.js
└───src
    │   index.js
    │   index.css
    │   App.js
    package.json
```

现在，我们完成了简单的初始化工作，下面开始了解webpack吧。

### 模式 (mode)

mode是webpack4中新增的概念，它有三个选项：`development`、`production`、`none`，用来设置webpack的优化方式。

#### development

开发模式，该模式优化了开发速度，提供了详细的错误机制和浏览器调试工具。并且关闭了代码压缩，使代码能够更快的构建。

#### production

生产模式，该模式能够提供更小的代码包,去除了只在开发阶段运行的代码。自动开启了代码混淆压缩。

#### 配置

```
module.export = {
  mode:'production' // 'development'||'production'||'none'
}
```

### 程序入口 (entry)

在这里，可以声明一个应用的起点。入口可以有一个或者多个。在单页应用中，入口一般只有一个。不过也可以将公共依赖配置成为单页应用的入口，这样单页应用也可以有多个入口。而在多页应用中，一般会有多个入口文件。

一个简单的单页应用入口如下：

```

module.export = {
  mode:'production' // 'development'||'production'||'none',
  entry:'./src/index.js',
}

```

### 输出 (output)

output用来配置项目打包后的文件名称、路径。用来告诉webpack怎么输出、输出到哪、叫什么名字。

```
const path = require('path');

module.export = {
  mode:'production' // 'development'||'production'||'none',
  entry:'./src/index.js',
  output: {
    // 在bundle中引入注释 注意：该选项不应该在生产模式中启用
    pathinfo:true,
    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）
    path: path.resolve(__dirname, './../build'),
    // 输出的文件名配置
    filename: "[name].[hash].js"
    }
}
```

这里的filename并没有给它一个实际的名称，而是使用模板字符串去设置webpack生成后的文件名称。这个设置中的[name]代表模块名称，在单入口文件中默认为main。而[hash]则会生成一个模块标识符的hash,默认是20位，可以通过[hash:16]的方式指定它的位数。打包后的文件名称就像这样`main.f236aaeca342dfb1f8dd.js`。在生成文件名称后跟上hash有助于我们在项目重新部署后由于引用的文件名称变了，浏览器会去下载新的文件，不再继续使用本地的缓存。

### loader  

webpack的作用就是将前端开发中的各个模块进行处理以及打包。而loader的作用就是处理webpack中的这些模块。

webpack中模块有很多种，常见的有：

- 模块化的js文件

- css/less/sass文件

- 图片以及静态文件

loader在module中配置：

```
// 示例
const path = require('path');

const appSrc = path.resolve(__dirname, '../src')

module.exports =  {
    mode: 'development',
    // 入口
    entry: './src/index.js',
    // 出口
    output: {
        pathinfo: true,
        // 所有输出文件的目标路径
        // 必须是绝对路径（使用 Node.js 的 path 模块）
        path: path.resolve(__dirname, './../build'),
        // 输出的文件名配置
        filename: "bundle.js"
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,     // 用来指定针对的文件类型 支持正则
                exclude: /node_modules/, // 用来指定需要排除的文件夹，优化打包速度
                include: appSrc,         // 指定所包含的文件夹 ，优化打包速度
                loader: "babel-loader", // 针对指定文件使用的loader
            }
        ]
    }
};

```

要对这些模块进行处理，就要使用到不同的loader。在此之前，先简单的介绍一下需要使用到的loader。

#### babel-loader

babel是一个语法转换器，能够让你自由的使用JavaScript的最新语法。它能够将我们所写的新语法、jsx等转换成浏览器能够友好支持的形式。

要使用babel-loader需要下列依赖,可以通过执行`npm install --save-dev babel-loader @babel/core @babel/preset-react @babel/preset-env`安装它们。

- babel-loader

- @babel/core

    babel的核心组件,里面包含着babel的api。

- @babel/preset-env

    用来转义JavaScript语法。

- @babel/preset-react

    用来转义react。

配置babel-loader：

```
const path = require('path');

const appSrc = path.resolve(__dirname, '../src')

module.exports =  {
    mode: 'development',
    // 入口
    entry: './src/index.js',
    // 出口
    output: {
        pathinfo: true,
        // 所有输出文件的目标路径
        // 必须是绝对路径（使用 Node.js 的 path 模块）
        path: path.resolve(__dirname, './../build'),
        // 输出的文件名配置
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                include: appSrc,
                loader: "babel-loader",
                options: {
                    // 指定babel预处理转义
                    presets: ["@babel/preset-env", "@babel/preset-react"]
                }
            }
        ]
    }
}
```

完成上述配置后，还需配置一下babel，让它能够转换react和js的新语法。可以像上面使用webpack配置中的option选项中的presets字段指定babel预处理的方式。

也可以在项目的根目录创建babel的配置文件`.babelrc`。`.babelrc`后缀rc来自linux中，使用过linux就知道linux中很多rc结尾的文件，比如.bashrc，rc是run command的缩写，翻译成中文就是运行时的命令，表示程序执行时就会来调用这个文件。

babel所有的操作基本都会来读取这个配置文件，除了一些在回调函数中设置options参数的，如果没有这个配置文件，会从package.json文件的babel属性中读取配置。

在`.babelrc`中添加下列语句：

```
{
    "presets": ["@babel/preset-env","@babel/preset-react"]
}
```

#### url-loader

url-loader和file-loader的作用类似，都是使webpack能够打包静态文件。url-loader相较于file-loader的功能更强大，它能够使用两种方式进行打包。

url-loader有一个重要的参数 `limit` ,这个参数用来设置打包文件大小的限制。当文件小于指定参数时，它能够返回一个DataURL（base64）形势的文件。当文件大于指定参数时，它将通过file-loader进行打包。

配置url-loader：

```
const path = require('path');

const appSrc = path.resolve(__dirname, '../src')

module.exports =  {
    mode: 'development',
    // 入口
    entry: './src/index.js',
    // 出口
    output: {
        pathinfo: true,
        // 所有输出文件的目标路径
        // 必须是绝对路径（使用 Node.js 的 path 模块）
        path: path.resolve(__dirname, './../build'),
        // 输出的文件名配置
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                include: appSrc,
                loader: "babel-loader"，
                options: {
                    // 指定babel预处理转义
                    presets: ["@babel/preset-env", "@babel/preset-react"]
                }
            },
            // url-loader的配置
            {
                test: /\.(png|jpg|gif)$/,
                loader: "url-loader",
                options: {
                    // 设置url-loader转DataURL的文件大小上限
                    limit: 10000
                }
            }
        ]
    }
}
```

url-loader还有两个参数`mimetype`和`fallback`，这两个参数使用的并不多，就不在这里赘述了。

#### style-loader和css-loader

style-loader和css-loader都是用来处理css文件的，不过它们的作用并不相同。

css-loader：用来读取css文件的内容，并进行处理 如：minimize。

style-loader：将通过import形式导入到js中的css文件插入到`<style></style>`标签内。

在webpack中的配置如下：

```
const path = require('path');

const appSrc = path.resolve(__dirname, '../src')

module.exports =  {
    mode: 'development',
    // 入口
    entry: './src/index.js',
    // 出口
    output: {
        pathinfo: true,
        // 所有输出文件的目标路径
        // 必须是绝对路径（使用 Node.js 的 path 模块）
        path: path.resolve(__dirname, './../build'),
        // 输出的文件名配置
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                include: appSrc,
                loader: "babel-loader"，
                options: {
                    // 指定babel预处理转义
                    presets: ["@babel/preset-env", "@babel/preset-react"]
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: "url-loader",
                options: {
                    // 设置url-loader转DataURL的文件大小上限
                    limit: 10000
                }
            },
            // 针对css文件配置style-loader和css-loader
            {
                test: /\.css$/,
                include: appSrc,
                use: [
                        'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // 可以包含一些配置
                            modules:true|false, // 是否开启css模块化，开启后引入的css文件仅针对当前页面有效，不会作用到全局
                            minimize: true // 开发模式下应该设为false，优化打包速度
                        }
                    }
                ]
            }
        ]
    }
}
```

如上所示，当我们在针对同一类型的文件配置多个loader时。可以将loader声明在一个数组内，数组项可以是一个对象，也可以仅仅是一个字符串，这取决于你针对某个loader还有没有特殊的设置。比如在配置css-loader时，还声明了option选项，并在option选项内开启了minimize选项。但是在配置style-loader时，仅仅写了一个字符串。

需要注意的是，数组内loader的执行顺序是从数组的最后一项依次向前执行。所有我们将css-loader配置在了后面，它是先执行的。这更符合处理逻辑，先对css进行处理，再插入到html中。

### 插件

插件是webpack的一个极其重要的功能，webpack提供了丰富的插件接口，使开发者能够自由的开发插件来拓展webpack的功能。

这里我们拿大名鼎鼎的 `HtmlWebpackPlugin` 来举例。

设想一个场景，在打包时，需要手动的去创建一个html文件，然后在其中引入打包好的各种文件。即使创建好html文件后，由于在config中设置了hash形式的打包文件名称。我们在每次打包后还需要根据hash名称的变动去改变html内引入的文件名称，这是非常低级的重复劳作。

`HtmlWebpackPlugin` 为我们解决了这个问题。`HtmlWebpackPlugin` 能够根据我们提供的模板自动生成html文件，并引入打包后的内容。

下面介绍一下`HtmlWebpackPlugin`的使用过程。

安装：`npm install --save-dev html-webpack-plugin`

安装完成后，先在项目的根目录创建一个文件夹`public`，在其中创建一个模板文件`index.html`。

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

然后在webpack中配置插件：

```
const path = require('path');

const appSrc = path.resolve(__dirname, '../src')
// 引入html-webpack-plugin插件
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports =  {
    mode: 'development',
    // 入口
    entry: './src/index.js',
    // 出口
    output: {
        pathinfo: true,
        // 所有输出文件的目标路径
        // 必须是绝对路径（使用 Node.js 的 path 模块）
        path: path.resolve(__dirname, './../build'),
        // 输出的文件名配置
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                include: appSrc,
                loader: "babel-loader",
                options: {
                    // 指定babel预处理转义
                    presets: ["@babel/preset-env", "@babel/preset-react"]
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: "url-loader",
                options: {
                    // 设置url-loader转DataURL的文件大小上限
                    limit: 10000
                }
            },
            // 针对css文件配置style-loader和css-loader
            {
                test: /\.css$/,
                include: appSrc,
                use: [
                        'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // 可以包含一些配置

                            minimize: true // 开发模式下应该设为false，优化打包速度
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // HTML模板文件处理插件
        new HtmlWebpackPlugin({
            file: 'index.html', // 生成的文件名称
            template: 'public/index.html' // 指定模板文件
        })
    ],
}
```

现在在命令行中执行`npm build`,webpack将打包src目录内的文件。并将在根目录生成一个build文件，将打包的内容输出在里面。

这时候，我们其实已经完成了webpack的基本配置。但是现在的配置是基于development模式进行打包的，没有进行压缩，很显然这并不能做为一个可发布的版本。要修改为生产模式其实也很简单，可以通过两种方式去实现。

1. 修改配置文件中的mode选项，将development修改为production。

2. 删除配置中的mode选项，修改package.json scripts中的build项为 `webpack --mode production --config ./config/webpack.config.js`。

在配置2中，使用--mode 能够为webpack-cli设置打包模式。修改后再次打包，这时候代码经过webpack production模式的优化，进行了混淆压缩，变成了发布版本。

### devServer

在日常的开发过程中，肯定不能每修改一点东西就重新build一次，这样开发效率会受到很大的影响。这时需要启动一个服务，来监听文件的变动。当文件保存时就重新打包，同时帮我们自动刷新浏览器，方便我们及时观察到更新。

要完成上述操作有几种方式，这里只介绍其中的一种，使用 `webpack-dev-server` 插件。

执行 `npm install --save-dev webpack-dev-server` 安装插件，在module.explot中添加配置项 `devServer`。

devServer的配置项有很多，这里大概的介绍其中几种常用的配置：

- contentBase: '',告诉服务器从哪个目录中提供内容

- https: true|false, 是否启用https

- compress: true|false, 是否启用压缩

- host: '127.0.0.1',  指定host地址

- port: 23333, 指定端口

- overlay: true|false, 当出现编译器错误或警告时，在浏览器中显示全屏覆盖层。

- progress: true|false, 将运行进度输出到控制台。

将devServer添加到配置中：

```
const path = require('path');

const appSrc = path.resolve(__dirname, '../src')
// 引入html-webpack-plugin插件
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports =  {
    // 入口
    entry: './src/index.js',
    // 出口
    output: {
        pathinfo: true,
        // 所有输出文件的目标路径
        // 必须是绝对路径（使用 Node.js 的 path 模块）
        path: path.resolve(__dirname, './../build'),
        // 输出的文件名配置
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                include: appSrc,
                loader: "babel-loader",
                options: {
                    // 指定babel预处理转义
                    presets: ["@babel/preset-env", "@babel/preset-react"]
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: "url-loader",
                options: {
                    // 设置url-loader转DataURL的文件大小上限
                    limit: 10000
                }
            },
            // 针对css文件配置style-loader和css-loader
            {
                test: /\.css$/,
                include: appSrc,
                use: [
                        'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // 可以包含一些配置

                            minimize: true // 开发模式下应该设为false，优化打包速度
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        // HOST
        host: '127.0.0.1',
        // 端口
        port: 23333,
        // 报错提示在网页遮罩层
        overlay: true,
        // 显示运行进度
        progress: true,
    },
    plugins: [
        // HTML模板文件处理插件
        new HtmlWebpackPlugin({
            file: 'index.html', // 生成的文件名称
            template: 'public/index.html' // 指定模板文件
        })
    ]
}
```

需要注意的时，devServer应当用在开发环境中，所以现在需要将之前的配置进行修改。

1. 在配置中删除mode项。

2. 为package.json的scripts中添加另一个启动命令 `"start": "webpack-dev-server --open --mode development --config ./config/webpack.config.js"`

3. 将之前的build项改为 `webpack --mode production --config ./config/webpack.config.js`。

现在，执行npm build，webpack将使用production模式进行打包。执行npm start时，将使用development模式进行打包，并且webpack-dev-server将启动一个服务，监听文件变更。

现在执行npm start，就可以开始进行开发了！

### 进阶

在上面的配置中，我们已经实现了一个react项目开发环境的基本配置。但这远远不够，在实际的项目中，可能会用到很多的工具来优化开发速度。同时也需要针对不同的环境写不同的配置，做不同的优化等。并且，可能还涉及到代码分割、压缩等配置。

下面，我们来一步步完善webpack的配置。

#### devtool

webpack中devtool选项用来控制是否生成，以及如何生成 source map。

想要了解source map，可以看一下[这篇文章](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)。简单的说，source map就是帮助我们定位到错误信息位置的文件。正确的配置source map，能够提高开发效率，更快的定位到错误位置。

webpack中devtool有很多种配置，我们可以在 [这里](https://webpack.docschina.org/configuration/devtool/#%E5%AF%B9%E4%BA%8E%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83) 了解它。

在开发环境中，更推荐使用`cheap-module-eval-source-map`,它能帮助我们准确的定位到错误源代码位置的同时，也能提供更快的构建速度和构建性能。

而在生产环境中，可以不启动任何source map（不配置devtool项），也可以使用`source-map`。需要注意的是，不要将source map部署到生产服务器中。

#### 为svg文件配置loader

一般情况下，项目都会需要用到图标。常见的图标使用方式有很多种，如雪碧图、字体图标、svg等。雪碧图和iconfont的使用方式不需要进行特殊的处理，这里我们就不再赘述。下面介绍一个使用svg图标的方法。

通过 [svgr](https://www.smooth-code.com/open-source/svgr/docs/webpack/) ,能够直接将svg图标以react组件的形式引入项目中。

就像这样：

```
import React from 'react';
import { ReactComponent as Icon } from './icon.svg';

export default class App extends React.Component {
    render() {
        return <div>
            <Icon width={10} height={10} />
        </div>
    }
}
```

在react最新版本的cli `create-react-app`,已近默认集成了svgr。在我们自己的项目中使用也很简单，只需要针对 `.svg`添加loader即可。

```
{
  test: /\.svg$/,
  use: ['@svgr/webpack'],
}
```

svgr同时也支持node、react-native等处理方式，可以通过 [svgr文档](https://github.com/smooth-code/svgr)来了解。

#### 构建不同环境下的配置

在生产环境和开发环境的构建目标差异很大。比如在开发环境中，需要更快的构建速度和更强的错误提示。但是在生产环境中，则希望构建的代码能更小，更轻，更侧重于性能。所以，针对不同的环境，需要不同的配置文件。但是如果将配置完全拆分开，两个配置文件中可能会包含很多重复的代码。这时我们需要提出公共的配置，为了将这些配置合并在一起，可以使用[webpack-merge](https://github.com/survivejs/webpack-merge)。

下面，我们开始使用 webpack-merge 进行配置优化。

首先，使用npm安装依赖 `npm install --save-dev webpack-merge`

然后，在config文件夹下创建 webpack.config.common.js 、 webpack.config.dev.js 、webpack.config.prod.js。顾名思义，这三个配置代表了通用、开发、生产模式的配置文件。

将之前配置中用到的公共配置提出到 webpack.config.common.js 内：

```
// webpack.config.common.js

// 打包HTML文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const appSrc = path.resolve(__dirname, '../src')

module.exports = {
    // 入口
    entry: './src/index.js',
    module: {
        rules: [
            {
                // 配置svg图标loader，可以在项目中通过组件的形式直接引入svg图标
                test: /\.svg$/,
                include: appSrc,
                use: ['@svgr/webpack']
            }
        ]
    },
    plugins: [
        // HTML模板文件处理插件
        new HtmlWebpackPlugin({
            file: 'index.html',
            template: 'public/index.html'
        })
    ]
}

```

开发环境下的配置：

```
const merge = require('webpack-merge');
// 引入公共配置文件
const common = require('./webpack.config.common.js');
const path = require('path');

const appSrc = path.resolve(__dirname, '../src')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    // 出口
    output: {
        pathinfo: true,
        // 所有输出文件的目标路径
        // 必须是绝对路径（使用 Node.js 的 path 模块）
        // chunk名称配置
        chunkFilename: '[name].chunk.js',
        // 输出的文件名配置
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                // exclude: /node_modules/,
                include: appSrc,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"]
                }
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
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: false
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        // HOST
        host: '127.0.0.1',
        // 端口
        port: 23333,
        // 报错提示在网页遮罩层
        overlay: true,
        // 显示运行进度
        progress: true,
    }
})

```

生产环境配置文件：

```
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');
// 每次执行打包 先清除之前的打包文件
const CleanWebpackPlugin = require('clean-webpack-plugin');

const appSrc = path.resolve(__dirname,'../src')

module.exports = merge(common, {
    mode: 'production',
    // 出口
    output: {
        pathinfo: false,
        chunkFilename: 'js/[name].chunk.js',
        // 所有输出文件的目标路径
        // 必须是绝对路径（使用 Node.js 的 path 模块）
        path: path.resolve(__dirname, './../build'),
        filename: "js/[name].[chunkhash:8].js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: appSrc,
                // exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"]
                }
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
                            minimize: true
                        }
                    }
                ]
            }

        ]
    },
    plugins: [
        // 打包前清除之前的build目录
        new CleanWebpackPlugin(['build'], path.resolve(__dirname, '../'))
    ]
});
```

现在配置已经修改完成，我们还需要修改一下package.json，让启动命令去引用不同的配置文件。

将开发模式的启动配置修改为 `"start": "webpack-dev-server --open --mode development --config ./config/webpack.config.dev.js"`。

生产模式的启动配置修改为 `"build": "webpack --mode production --config ./config/webpack.config.prod.js",`

现在我们使用`npm start`命令启动项目，运行的是webpack.config.dev.js文件，这是开发配置文件，我们可以在里面做一些针对开发模式的优化。

使用`npm build`命令启动项目，运行的是webpack.config.prod.js文件，这是生产配置文件，我们可以在里面做一些针对生产模式的优化。

#### 防止打包文件的重复

执行build命令打包文件时，会在项目的根目录下生成build目录，并在其中生成打包文件。当执行多次build后，会发现由于项目名称的hash值不同，build目录下可能存在多个版本打包后的文件。要解决这个问题，可以使用插件 `clean-webpack-plugin`。

首先安装插件 `npm i clean-webpack-plugin --save-dev`

配置如下：

```
const CleanWebpackPlugin = require('clean-webpack-plugin')

// webpack config
{
  plugins: [
    new CleanWebpackPlugin(['build'], path.resolve(__dirname, '../'))
  ]
}
```

配置完插件后，再执行npm build命令。会发现每次打包前，build目录都会被删除，然后重新创建。

注意，该插件只用于生产环境配置。

## 总结

通过上述内容，实现了webpack的基础的配置，以及各种概念的扫盲。其实这只能算是基础用法，要实现一个真正完善的webpack配置肯定远远不止这些。这篇文章的面向对象为初学者，所有在这里就不过多的介绍那些比较复杂的概念。

在下篇文章，会介绍一些更高级的配置和概念。如optimization、tree shaking、生产环境下的构建速度优化等。