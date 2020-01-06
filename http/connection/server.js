const http = require("http");
const fs = require("fs");

http.createServer(function(request, response) {
  console.log("request.url: ", request.url);
  const html = fs.readFileSync("index.html", "utf-8");
  const img = fs.readFileSync("1.jpg");
  if (require.url === "/") {
    response.writeHead(200, {
      "Content-Type": "text/html"
    });
    response.end(html);
  } else {
    response.writeHead(200, {
      "Content-Type": "image/jpg",
      "Connection": "close"
    });
    response.end(img);
  }

}).listen(9006);

console.log("Server running at http://127.0.0.1:9006/");
