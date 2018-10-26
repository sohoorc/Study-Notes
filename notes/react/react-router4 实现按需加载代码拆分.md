# react-router4 实现按需加载代码分割

在项目中，默认情况下webpack会将所有的js文件打包为一个名为bundle的文件。这样就产生一个问题，bundle文件往往会非常大。若我们的项目是hybrid app或者是一个运行在内网中的系统，并不会产生太大的影响。但如果是一个公网中使用的项目，受限于网络因素，第一次加载的速度可能会很慢，这样就造成了非常不好的体验。要想优化这个问题，我们可以实现code splitting。

## 第一步

我们需要在<b>项目中</b>安装 `react-loadable` 和 `babel-plugin-syntax-dynamic-import`(请自行选择yarn 或者 npm)。  
`react-loadable` 是react-router官网中推荐的组件，主要作用就是封装了一些我们在配置按需加载中可能会适用到的功能。如：deply、loading等等。这些功能呢我们也可以自行实现。  
我们都知道，ES6 module（import/export 语句）是静态的，所以无法用于按需加载。 `babel-plugin-syntax-dynamic-import`的插件的作用就是为了支持动态import语法`import()`。

## 第二步

在配置文件中(webpack.config或.babelrc或package.joson中三者选其一)添加`syntax-dynamic-import`。

## 第三步

使用 react-loadable:

```
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import Loadable from "react-loadable";
import Login from './views/login';
import Manager from './views/manager/manager';

// 加载过程中所显示的组件 
const loading = (props) => {
  let deply = props.pastDelay // 是否显示加载动画
  return (
    deply
      ? <div>加载动画</div>
      : null
    )
}

// loadable 配置
 const loaderConfig = {
  loading: loading, 
  delay: 1000  // 设定若加载时间小于某个时间 则不显示加载动画，以防闪屏
}

// 通过 import() 动态引入模块
const Manager = Loadable({
  loader: () => import('./views/manager/manager'),
  ...loaderConfig
})

class Farme extends Component {
  render() {
    return <React.Fragment>
      <Switch>
        {/* 登录 */}
        <Route path='/login' component={Login}></Route>
        {/* 管理员 */}
        <Route path='/manager' component={Manager}></Route>
        <Redirect to='/login'></Redirect>
      </Switch>
    </React.Fragment>
  }
}

ReactDOM.render(
    <Router>
      <Farme />
    </Router>
  ,
  document.getElementById('root'));
registerServiceWorker();

```