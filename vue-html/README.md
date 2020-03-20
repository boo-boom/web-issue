今天我来分享一下前端的两个时代的产物 dom 时代 / MVVM时代， 一个以jq为主，一个以vue，react，Angular为主

展示代码：
document.querySelect("input").value = 123123;
vm._data.message = qweqwe;

vm实现了双向绑定，只需要操作数据即可，不在使用操作dom的方式对页面进行渲染

如何实现一个`MVVM`框架：
基于vue的模式先定一下调用的格式：

```html
<div id="app">
  {{ message }}
  <p>{{ test }}</p>
  <input type="text" v-model="message" />
</div>
```

```js
var vm = new MVue({
  el: "#app",
  data: {
    message: "hello world",
    test: "1231"
  }
});
```

1. 开始我们需要进行基于数据渲染的解析器，此处只是提供一个思路，代码比较简单
   在根节点进行递归查找插值变量，并将其赋值为当前vm实例中的data上的属性

2. 如何能让修改data时知道该属性被修改了
   利用js的数据劫持特性对vm实例中对data进行劫持，使用Object.defineProperty进行劫持，
   该原生函数提供了几个必要属性configurable，enumerable，get()，set()。
   也是在数据劫持这里进行订阅的收集及收集完成后的通知订阅者
   get() : 收集订阅
   set() : 通知订阅者进行更新

3. 知道了数据修改时的状态，如何进行对插值的更新，如果data中的字段很多，如何进行管理
   利用订阅发布模式
   一个发布者类收集所有订阅者的订阅状态
   每一个订阅者在接收到发布者的通知时进行更新状态

如何实现vue中的双向绑定v-model指令
vue中的v-model其实是个语法糖，结合:value + v-bind:input，
我们在实现的时候，需要先在标签上添加属性“v-model”属性，
当页面渲染时获取到带有“v-”的属性进行处理，model的功能使用addEventListener进行监听，如果value变化时，更新vm.data内对应的属性值。
同时也要将当前的状态进行实例化，将当前修改的属性传递给订阅者，调用该属性时则会触发数据劫持的get()，
触发则会收集该订阅信息，当该订阅的字段被修改时就会触发set()，此时就会通知订阅者进行更新
