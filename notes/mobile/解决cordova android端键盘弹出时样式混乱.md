
　　最近在使用cordova开发hybrid app的过程中，遇到了一个问题。在android客户端的登录页面，当点击输入框弹出软键盘后，登录页的背景图片出现了上移，底部留下了一片白色。但是这个问题在IOS端却没有出现。
　　在使用chrome://inspect 对app进行调试后发现，出现样式混乱是因为当android客户端的软键盘弹出时，由于需要保持输入框在界面上始终可见，所以页面上移并且压缩，导致body的高度被压缩。　
　　通过查询，最终找到两种解决办法：
　　1. 通过修改AndroidManifest.xml文件下的 `android:windowSoftInputMode`属性。该属性的的作用是调节主窗口与软键盘的交互模式，可以通过调节交互模式解决键盘弹出后窗口出现的一系列问题。该属性主要提供了下列几种值：
+ stateUnspecified：软键盘的状态并没有指定，系统将选择一个合适的状态或依赖于主题的设置

+ stateUnchanged：当这个activity出现时，软键盘将一直保持在上一个activity里的状态，无论是隐藏还是显示

+ stateHidden：用户选择activity时，软键盘总是被隐藏

+ stateAlwaysHidden：当该Activity主窗口获取焦点时，软键盘也总是被隐藏的

+ stateVisible：软键盘通常是可见的

+ stateAlwaysVisible：用户选择activity时，软键盘总是显示的状态

+ adjustUnspecified：默认设置，通常由系统自行决定是隐藏还是显示

+ adjustResize：该Activity总是调整屏幕的大小以便留出软键盘的空间

+ adjustPan：当前窗口的内容将自动移动以便当前焦点从不被键盘覆盖和用户能总是看到输入内容的部分

　默认情况下，cordova项目中的设置为 `android:windowSoftInputMode="adjustResize"`,这个选项会调整屏幕的大小，出现body压缩的原因就是使用了该属性。通过将 adjustResize 选项修改为 adjustUnspecified ，使系统不调整窗口布局，即可解决布局混乱的问题。 

　　但是，在使用了该方法后，又衍生出来了一个新的问题。当键盘弹出时，若输入框在窗口的下半部分，键盘弹出后会遮住输入框，导致用户看不到自己输入的内容，这样体验非常不好。如果输入框在屏幕上半部分，不会被键盘遮住，可以使用该方式。

　　2. 依旧使用 adjustResize 选项。不同的是，在键盘弹出时，将body的高度设置为一个定值。这样body的内容即为全屏可见，不会被压缩。
```
// 通过两行简单的代码，即可解决这个问题
let body = document.body
body.style.height = window.innerHeight + 'px'
```

这样，我们即保留了系统自带的调整窗口，使键盘不盖住输入框的功能，也保证了界面不被压缩变形。


