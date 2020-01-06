# HTTP

## 浏览器输入URL后http请求返回的过程

Redirect: 跳转 -> App cache: 应用缓存 -> DNS: DNS查找 -> TCP: 创建TCP链接 -> Request: 发送请求 -> Response: 接受响应

## 经典五层模型

- 客户端
  > 应用层: HTTP, FTP... -> 传输层: TCP, UDP -> 网络层 -> 数据链路层 -> 物理层
- 服务端
  > 物理层 -> 数据链路层 -> 网络层 -> 传输层 -> 应用层

## 三次握手

避免网络请求时的因延时等问题引发的不必要开销。

### TCP标志位

- 第一次握手: client -> server : SYN = 1, Seq = X
  > 客户端向服务端发起请求，标志位 `[SYN] Seq = 0`
- 第二次握手: server -> client : SYN = 1, ACK = X + 1, Seq = Y
  > 服务端响应客服端请求，标志位 `[SYN, ACK] Seq = 0 Ack = 1`
- 第三次握手: client -> server : ACK = Y + 1, Seq = Z
  > 客户端告知服务端请求状态，标志位 `[ACK] Seq = 1 Ack = 1`

## URI URL URN

### URI

- Uniform Resource Identifer: 统一资源标志符
- `URI` 包含 `URL` `URN` 定义

### URL

- Uniform Resource Locator: 统一资源定位符
- `http://` `ftp://`

### URN

- 永久统一资源定位符
- 通过 `URN` 即使资源移动了位置，任可以访问
- 暂时业界没有实际的使用场景

## HTTP报文

### 请求报文

起始行（General） | 头部（Headers）
---|---
GET /test/hello.txt HTTP/1.0 | Accept: text/*
&nbsp; | Accept-Language: en,fr

### 响应报文

起始行（General） | 头部（Headers） | 内容
---|---|---
HTTP/1.0 200 OK | Content-type: text/plain | Hi! I'm a massage!
&nbsp; | Content-length: 19 | &nbsp;

> 头部之后会有一个空行，空行之后均为内容部分

## HTTP方法

- 用于定义对资源的操作
- 常用有 `GET` `POST` 等
- 从定义上都有各自的语义

## HTTP CODE

- 定义服务器对请求的结果
- 各个区间的CODE有各自的语义
  - 1xx: 指示信息 - 表示请求已接收，继续处理
  - 2xx: 成功 - 表示请求已被成功接收
  - 3xx: 重定向 - 要完成请求必须进行更进一步的操作
    - 301: 所请求的页面已经转移至新的url
    - 302: 所请求的页面已经临时转移至新的url
  - 4xx: 客户端错误 - 请求有语法错误或请求无法实现
    - 400: 客户端请求有语法错误，不能被服务器所理解
    - 401: 请求未经授权
    - 403: 对被请求页面的访问被禁止
    - 404: 请求资源不存在
  - 5xx: 服务器错误 - 服务器未能实现合法的请求
    - 500: 服务器发生不可预期的错误，原来缓冲的文档还可以继续使用
    - 503: 请求未完成，服务器临时过载或宕机，一段事件后可能恢复正常
- 好的HTTP服务可以通过CODE判断结果

## HTTP工具 浏览器/CURL

- `curl` 是一个利用URL语法在命令行下工作的文件传输工具

```bash
curl "www.baidu.com"      # 返回百度页面内容
curl -v "www.baidu.com"   # 返回http信息
```

## 跨域

跨域是发生在服务器接收到请求后，判断 `Access-Control-Allow-Origin` 是否配置后响应给客户端。

> `Access-Control-Allow-Origin` 只能配置一个域名或 `*`，可根据访问的 url 进行动态的赋值

> 浏览器有跨域问题，curl没有跨域的限制

### JSONP

```html
<!-- 客户端 -->
<!-- 1.约定一个函数 -->
<!-- 2.利用 script/link/img 标签的没有跨域约束的机制发送（仅限GET）请求 -->
<script type="text/javascript">
  var localHandler = function (data) {
    alert('我是本地函数，可以被跨域调用，远程js带来的数据是：' + data.result);
  };
</script>
<script type="text/javascript" src="http://127.0.0.1:9008/"></script>
```

```js
// 服务端
// 接口返回的内容则为与客户端约定的函数，并将服务端数据通过函数传参的方式响应给客户端
response.end('localHandler({"result":"我是远程js带来的数据"});');
```
