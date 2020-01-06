const http = require("http");

http.createServer(function(request, response) {
  /**
   * 跨域：
   *  1.客户端请求已经发送
   *  2.服务端接收到该请求时，如果没有配置Access-Control-Allow-Origin则会拦截，并返回跨域错误信息
   *  3.浏览器有跨域问题，curl没有跨域的限制
   */
  response.writeHead(200, {
    // "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/html"
  });
  console.log("request.url: ", request.url);
  // JSONP
  response.end('localHandler({"result":"我是远程js带来的数据"});');
}).listen(9008);

console.log("Server running at http://127.0.0.1:9008/");
