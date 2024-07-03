const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = path.resolve(__dirname, '.' + parsedUrl.pathname);

  fs.stat(pathname, (err, stats) => {
    if (err) {
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
    } else if (stats.isDirectory()) {
      fs.readdir(pathname, (err, files) => {
        if (err) {
          res.statusCode = 500;
          res.end(err.message);
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(files.filter(file => fs.statSync(path.join(pathname, file)).isDirectory())));
        }
      });
    } else {
      res.statusCode = 404;
      res.end(`Path ${pathname} is not a directory!`);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
