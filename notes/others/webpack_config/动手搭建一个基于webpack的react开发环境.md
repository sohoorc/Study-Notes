# 动手搭建一个基于webpack4的react开发环境

## 前言

webpack作为现代前端技术的基石，相信绝大部分的前端开发者都听说或者是在项目中使用过。但是由于现在各种各样cli工具的出现，能够掌握webpack基本配置和使用的人，可能就不那么多了。

最开始接触webpack还是在以前的angular.js项目中，之后从angular.js转到react后一直使用的create-react-app进行项目初始化。需要改动webpack配置时也是在使用eject命令暴露出webpack config进行修改，一直没有自己从零开始配置过。在这期间angular.js升级成为Angular，jQuery真正的被历史淘汰，Vue也从一个后期之秀成为现在的当红前端框架。不得不说，前端技术的更新迭代速度真的可以用飞速来形容了。在如此快速的更新速度下，作为一个一线的前端开发人员，一定要紧跟技术的步伐，时刻保持着学习状态，才能保证自己在大潮流中不掉队。这也是我写这篇文章的初衷，用来记录自己的学习成果。

## 正文

### 简介

webpack是什么？

> 本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(static module bundler)。在 webpack 处理应用程序时，它会在内部创建一个依赖图(dependency graph)，用于映射到项目需要的每个模块，然后将所有这些依赖生成到一个或多个bundle。—— 来自 webpack 官方文档

简单的说，webpack就是一个现代前端开发的打包机。现代前端非常流行使用模块化的方式开发，webpack所做的就是将各个js模块合理的打包成bundle或者chunk。在打包的过程中，可以通过loader的方式，将新的js语法、CSS预处理语言等转换成更容易被浏览器支持的形式。

### 模式 (mode)

这个概念为webpack4中新增的概念，它有三个选项：`development`、`production`、`none`，用来设置webpack的优化方式。

使用方法：

```
module.export = {
  mode:'production'
}
```

### 入口

### 出口

### loader  

### 插件

### devServer