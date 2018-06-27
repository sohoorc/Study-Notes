# 代码规范

## 命名规则

- 项目命名
- 目录命名
- JS文件命名
- CSS/SASS/LESS 命名

## HTML

## CSS/SASS/LESS
- 命名

- 格式
  - 缩进
  - 避免使用ID选择器
  - 空行
  - `} ` 后的空行
  - 换行
  - 在一个规则声明中应用了多个选择器时，每个选择器独占一行
  - 多个属性间的换行
  - `'{'`后的换行和`'}'`前换行
- 注释
  - 无论CSS/SASS/LESS，统一使用`/* */`注释
  - 在特殊的情况下，如浏览器hack
- JavaScript 钩子：避免在 CSS 和 JavaScript 中绑定相同的类。否则开发者在重构时通常会出现以下情况：轻则浪费时间在对照查找每个要改变的类，重则因为害怕破坏功能而不敢作出更改。
- SASS
  - 变量：变量名应使用破折号（例如 $my-variable）代替 camelCased 和 snake_cased 风格。对于仅用在当前文件的变量，可以在变量名之前添加下划线前缀（例如 $_my-variable）。
  - 嵌套选择器：请不要让嵌套选择器的深度超过 3 层（要不然你会哭）！
  - 不要嵌套ID选择器，因为即使你非要使用ID选择器，ID选择器也应该放在第一位 如：`#abc .bcd`

## JSX
  - 命名
    - 文件名
    - 扩展名
    - 引用名
    - 属性命名
  - 属性对齐
    - 单行:`<Abc classNam="abc" />`
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
  - 自闭合
    - 若不存在嵌套效果，请使用自闭合标签 `<Abc />`，并且标签名和 `'/>'`间应存在一个空格。
  - Props
    - 使用`PropTypes`检测`props`类型
    - `props`自上而下的传递应该小于两级
  - Refs
    - 使用 `ref={(ref)=>{ this.xxx = ref}}` 而不是 `ref="xxx"`
## JS