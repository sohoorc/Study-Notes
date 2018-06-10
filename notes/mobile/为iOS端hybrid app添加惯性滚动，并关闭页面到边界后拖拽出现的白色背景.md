## 为iOS端hybrid app添加惯性滚动，并关闭页面到边界后拖拽出现的白色背景

### 1. 为iOS端hybrid app添加惯性滚动

在使用cordova开发hybrid app的过程中，在iOS端发现了一个问题。当页面出现滚动条，我们滚动页面内容时，页面并没有出现我们常见的App那样的惯性滚动，而是随着手指进行滚动。当手指离开屏幕，页面也会停止滚动，并没有随着“惯性”继续滚动一段距离。

#### 解决方法
通过对滚动内容的外层容器加上一条CSS：
```
-webkit-overflow-scrolling: touch;
```
这样解决iOS端的惯性滚动失效的问题。需要注意的是，这么做虽然解决了惯性滚动失效的问题，但是又引出了一个新的问题。就是在设置了这个CSS属性的容器元素内，position 属性将会失效。解决的办法似乎只有将需要定位的元素提到容器的外层（若有更好的方法还请赐教）。

### 2. 关闭iOS拖拽后出现的弹性效果
在iOS端中，对webview进行拖拽，会造成顶部或底部出现弹性的效果，并漏出背景。要关闭这个效果，只需要在corodva的config.xml文件中添加两行配置属性：
```
<preference name="webviewbounce" value="false" />
<preference name="DisallowOverscroll" value="true" />
```
这样，我们就关闭了iOS的webview拖拽到边界时出现的弹性效果。