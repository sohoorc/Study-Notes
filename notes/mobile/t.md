# 代码规范

## 项目规则

- 项目结构
- 项目命名
- 目录命名
- 文件注释
  - fileheader添加作者信息
  - 模块简介

## HTML
- 缩进
- 引用规范
- lang
- meta

## CSS/SASS/LESS
- 命名
  - 文件命名 
  - 类名
  - 变量命名

- 格式
  - 缩进
  - 避免使用ID选择器
  - 空行
  - `'}'` 后的空行
  - 换行
  - 在一个规则声明中应用了多个选择器时，每个选择器独占一行
  - 多个属性间的换行
  - `'{'`后的换行和`'}'`前换行

- 注释
  - 无论CSS/SASS/LESS，统一使用`/* */`注释
  - 在特殊的情况下，如浏览器hack,应该进行注释

- JavaScript 钩子：避免在 CSS 和 JavaScript 中绑定相同的类。否则开发者在重构时通常会出现以下情况：轻则浪费时间在对照查找每个要改变的类，重则因为害怕破坏功能而不敢作出更改。

- SASS
  - 嵌套选择器：请不要让嵌套选择器的深度超过 3 层（要不然你会哭）！
  - 不要嵌套ID选择器，因为即使你非要使用ID选择器，ID选择器也应该放在第一位 如：`#abc .bcd`

## JS
- 命名
  - 文件命名
  - 变量命名
  - 函数命名

- 注释规范
  - 行注释
  - 块注释
    - 功能模块的注释应该使用块注释

- 缩进

- 分号

- 变量声明
  - 应该使用连续声明

- 换行与空行
  - `'{'`后的换行和`'}'`前换行
  - `'}'` 后的空行

- 数组、对象

## JSX

- 命名
  - 文件名
  - 扩展名
  - 引用名
  - 属性命名

- 属性对齐
  - 单行:
    ```
    <Abc classNam="abc" />
    ```

  - 多行:  
    ```
    // 正确
    <Abc   
      classNam="abc"
      test="test"
    />

    // 错误
    <Abc  classNam="abc"
      test="test"
      test="test"
    />

    // 错误
    <Abc  
      classNam="abc"
      test="test"
      test="test" />
    ``` 

- Dom结构
  - 不应该存在多余的dom结构,若仅仅是为了包裹，更应该使用`React.Fragment`

- 自闭合标签
  - 若不存在嵌套效果，请使用自闭合标签 `<Abc />`，并且标签名和 `'/>'`间应存在一个空格。

- Props
  - 使用`PropTypes`检测`props`类型
  - `props`自上而下的传递应该小于两级

- Refs
  - 使用 `ref={(ref)=>{ this.xxx = ref}}` 而不是 `ref="xxx"`

- 在return后,将多行JSX包含在括号内

- 绑定`this`的方式

- 受控组件
  - 大部分情况下，应该使用受控组件

- 数据请求
  - 初次请求数据应放在 `componentDidMount` 中

- 功能的实现应该避免直接操作Dom（除非必须的情况下）

- 统一的样式声明
  - 不应该同时存在内联样式、css-in-js、外联样式

- import引用顺序
  - 先引用node_modules内的模块，再引用外部相对路径的模块

- 生命周期
  1. 可选的 static 方法
  2. constructor 构造函数
  3. getChildContext 获取子元素内容
  4. componentWillMount 模块渲染前
  5. componentDidMount 模块渲染后
  6. componentWillReceiveProps 模块将接受新的数据
  7. shouldComponentUpdate 判断模块需不需要重新渲染
  8. componentWillUpdate 上面的方法返回 true， 模块将重新渲染
  9. componentDidUpdate 模块渲染结束
  10. componentWillUnmount 模块将从DOM中清除, 做一些清理任务
  11. 点击回调或者事件处理器 如 hadleClick() 或 handleChange()
  12. render 里的 getter 方法 如 getSelectReason() 或 getFooterContent()
  13. render render() 方法

## redux
- 命名
  - 文件命名
  - reducer 命名
  - action type 命名
    - 本着复杂、繁琐、难写的原则

- 数据和视图分离  
