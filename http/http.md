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

- 封装一个完整的JSONP方法

```js
function JSONP(url, data) {
  let dataStr = "";
  if (data instanceof Object) {
    for (let k in data) {
      dataStr = `&${k}=${data[k]}`;
    }
  }
  return new Promise((resolve, reject) => {
    // cb函数不能重复，可利用uuid库生成唯一随机值
    const callbackName = `JSONP_${Date.now()}`;
    window[callbackName] = function(result) {
      resolve(result);
    }
    const script = document.createElement("script");
    script.src = `${url}?callback=${callbackName}${dataStr}`;
    document.body.append(script);
  });
}

JSONP("http://127.0.0.1:9008/", { a: 1 }).then(res => {
  console.log(res);
});
```

## CORS预请求

跨域时浏览器允许的只有以下列出的不需要经过预请求验证，其他方法或类型均需要经过预请求验证之后才能请求。

### 允许的方法

- `GET`
- `POST`
- `HEAD`

### 允许 Content-Type

- text/plain
- multipart/form-data
- application/x-www-form-urlencoded

### 其他限制

- [请求头限制](https://fetch.spec.whatwg.org/#cors-safelisted-request-header) (自定义头需要预请求验证)
- `XMLHttpRequestUpload` 对象均没有注册任何事件监听器
- 请求中没有使用 `ReadableStream` 对象

#### 服务端设置预请求验证

预请求时，我们可以在 `Chrome` 的 `Network` 看到多一次 `OPTIONS` 类型的请求，这次请求则为 `预请求`， 它的请求结果与正式请求一致。

> 当预请求没有通过时，不会访问正式请求

```js
response.writeHead(200, {
  "Access-Control-Allow-Origin": "*",             // 即使设置 * ，但请求不满足上面列出但请求依然会报对应的跨域错误
  "Access-Control-Allow-Headers": "X-Test-Cors",  // 允许自定义头信息
  "Access-Control-Allow-Methods": "PUT, DELETE",  // 允许跨域请求的方法
  "Access-Control-Max-Age": "1000"                // 当前跨域请求最大的访问时间，在此时间间隔内不需要预请求验证，直接正式请求
});
```

## 缓存 `Cache-Control`

以下头信息均为声明，无法对实际场景的代理服务器进行约束。

### 可缓存性

- `public`: http经过的任何地方均可以缓存（代理服务器/客户端等）

- `private`: 只有发起请求的这个浏览器才可以缓存

- `no-cache`: 任何节点均不可缓存（允许使用缓存，但需要通过服务器验证是否可使用缓存）

### 到期

- `max-age=<seconds>`: 客户端缓存时间（单位：秒）
  ```bash
  # 设置缓存时间后，浏览器会从本地缓存中获取内容（需关闭chrome中Network的Disable cache选项）
  # 即使服务端更新了内容，客户端是无法知晓的
  # 前端处理更新缓存的方法为：构建项目时给文件添加hash，内容改变则hash改变，从而达到文件路径的更新
  "Cache-Control": "max-age=200"
  ```

- `s-maxage=<seconds>`: 会代替 `max-age` ，只有在代理服务器中才会生效

- `max-stale=<seconds>`: 由浏览器发起的过期时间，`max-stale` 期间，当 `max-age` 过期时仍然可以使用过期的 `max-age`，`max-stale` 只有在发起端设置才会生效，服务端返回的内容是无效的。

### 重新验证

- `must-revalidate`: `max-age` 过期，必须去原服务发送请求重新获取数据来验证是否是真的过期，而不能直接使用缓存

- `proxy-revalidate`: 与 `must-revalidate` 相同，但是只作用于缓存服务器

### 其他

- `no-store`: 本地或缓存服务器均不可缓存数据，每次都需要到服务器获取最新的数据

- `no-transform`: 告知代理服务器不要去改动返回的内容（代理服务器有可能会对大型数据进行压缩或格式转换对操作）

## 资源验证

![image](http://notes.hoohmm.com/20200106001.png)

### 验证头

- `Last-Modified`: 上次修改时间
  - 配合 `If-Modified-Since` 或 `If-Unmodified-Since` 使用
  - 对比上次修改时间以验证资源是否需要更新

- `Etag`: 数据签名
  - 配合 `If-Match` 或者 `If-Non-Match` 使用
  - 对比资源的签名判断是否使用缓存（如文件添加hash）

## Cookie

- 通过 `Set-Cookie` 设置
- 下次请求会自动在 `Header` 带上
- 键值对，可以设置多个
- 单条Cookie总长度 `4KB` 左右（据浏览器而定）
- 每个域Cookie个数 `50~150` 个（据浏览器而定）
  IE | Firefox | Opera | Chrome | Safari
  ---|---|---|---|---
  原先为20个，后来升级为50个 | 50个 | 30个 | 150个 | 无限制
  > 当Cookie数超过限制数时浏览器的行为：
  > - IE和Opera会采用LRU算法将老的不常使用的Cookie清除掉
  > - Firefox的行为是随机踢出某些Cookie的值

### Cookie属性

- `max-age` 和 `expires` 设置过期时间
- `Secure` 只在 `https` 的时候发送
- `HttpOnly` 无法通过 `js` 的 `document.cookie` 访问
- `domain` 设置同域 `Cookie`, 同域下所有 `Cookie` 可公用

```js
response.writeHead(200, {
  "Set-Cookie": ["id=123; max-age=2", "age=456; HttpOnly", "test=789; domain=test.com"]
});
```

## HTTP长连接

chrome最多只创建6个TCP连接，等待有连接完成后加载后面的。

- `Connection`
  - `keep-alive`: 保持连接，复用同一个TCP连接
  - `close`: http请求完毕后关闭连接

```js
response.writeHead(200, {
  "Connection": "close"
});
```

## 数据协商

### Accept

- `Accept`: 数据类型
- `Accept-Encoding`: 数据编码（服务端代码的压缩类型）
- `Accept-Language`: 数据语言（判断返回的数据时的语言中文还是英文）
- `User-Agent`: 浏览器信息

### Content

- `Content-Type`: 从 `Accept` 中挑选一个实际返回的数据类型
- `Content-Encoding`: 对应 `Accept-Encoding`，判断服务端用了哪种编码格式，如 `gzip`
- `Content-Language`: 对应 `Accept-Language`
