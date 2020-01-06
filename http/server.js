const http = require("http");
const fs = require("fs");

http.createServer(function(request, response) {
  console.log("request.url: ", request.url);
  if (request.url === "/") {
    response.writeHead(200, {
      "Content-Type": "text/html"
    });
    var html = fs.readFileSync("index.html", "utf-8");
    response.end(html);
  }

  if (request.url === "/script.js") {
    // response.writeHead(200, {
    //   "Content-Type": "text/javascript",
    //   "Cache-Control": "max-age=200, no-cache",     // no-cache: 由服务端验证是否走缓存
    //   "Last-Modified": "123",
    //   "Etag": "777"
    // });
    // response.end("console.log('script loaded 123456')");

    const etag = request.headers["if-none-match"];
    if (etag === "777") {
      response.writeHead(304, {
        "Content-Type": "text/javascript",
        "Cache-Control": "max-age=20000",     // no-cache: 由服务端验证是否走缓存
        "Last-Modified": "123",
        "Etag": "777"
      });
      response.end("123");
    } else {
      response.writeHead(200, {
        "Content-Type": "text/javascript",
        "Cache-Control": "max-age=20000",     // no-cache: 由服务端验证是否走缓存
        "Last-Modified": "123",
        "Etag": "777"
      });
      response.end("console.log('script loaded 123')");
    }
  }

}).listen(9009);

console.log("Server running at http://127.0.0.1:9009/");
