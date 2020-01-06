const http = require("http");
const fs = require("fs");

http.createServer(function(request, response) {
  response.writeHead(200, {
    "Content-Type": "text/html"
  });
  console.log("request.url: ", request.url);
  var html = fs.readFileSync("index.html", "utf-8");
  response.end(html);
}).listen(9009);

console.log("Server running at http://127.0.0.1:9009/");
