const http = require("http");
const fs = require("fs");

http.createServer(function(request, response) {
  response.writeHead(200, {
    "Content-Type": "text/html",
    "Set-Cookie": ["id=123; max-age=2", "age=456; HttpOnly", "test=789; domain=test.com"]
  });
  const html = fs.readFileSync("index.html", "utf-8");
  response.end(html);
}).listen(9006);
