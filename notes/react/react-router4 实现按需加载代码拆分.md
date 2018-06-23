# react-router4 实现按需加载代码分割

众所周知，在我们的react项目中，默认情况下，webpack会将所有的js文件打包为一个名为bundle的文件。这样就产生一个问题，我们将所有的js打包到bundle文件中，bundle文件往往会非常大。若我们的项目是hybrid app或者内网管理系统，并不会产生太大的影响。但如果是一个公网中使用的项目，受限与网络因素，第一次加载的速度可能会非常慢，这样就造成了非常不好的体验。要想解决这个问题，我们可以使用 react-router 官网所推荐的 react-loadable，来实现代码分割。

## 第一步

我们需要在<b>项目中</b>安装 `react-loadable` 和 `babel-plugin-syntax-dynamic-import`(请自行选择yarn 或者 npm)

## 第二步

在配置文件中(webpack.config或.babelrc或package.joson中三者选其一)添加`syntax-dynamic-import`

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

最后，我们可以去看`react-loadable`的源码，其实实现的方式很简单。若不想使用`react-loadable`，我们也可以自己动手实现一个类似功能的组件。