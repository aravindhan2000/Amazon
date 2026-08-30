import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {extname, join, normalize, resolve as resolvePath, sep} from 'node:path';

const CONTENT_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.md': 'text/markdown'
};

export function startServer(root = process.cwd(), port = 0) {
  const rootPath = resolvePath(root);

  const server = createServer(async (request, response) => {
    const notFound = () => {
      response.writeHead(404, {'Content-Type': 'text/plain'});
      response.end('Not found');
    };

    let urlPath;
    try {
      urlPath = decodeURIComponent(new URL(
        request.url, 'http://localhost'
      ).pathname);
    } catch {
      response.writeHead(400, {'Content-Type': 'text/plain'});
      response.end('Bad request');
      return;
    }

    const relativePath = normalize(urlPath).replace(/^([/\\]|\.\.([/\\]|$))+/, '');
    const filePath = resolvePath(rootPath, relativePath);

    if (filePath !== rootPath && !filePath.startsWith(rootPath + sep)) {
      response.writeHead(403, {'Content-Type': 'text/plain'});
      response.end('Forbidden');
      return;
    }

    let finalPath = filePath;

    try {
      const stats = await stat(filePath);

      if (stats.isDirectory()) {
        finalPath = join(filePath, 'index.html');
        const indexStats = await stat(finalPath);

        if (!indexStats.isFile()) {
          notFound();
          return;
        }
      } else if (!stats.isFile()) {
        notFound();
        return;
      }
    } catch {
      notFound();
      return;
    }

    const stream = createReadStream(finalPath);

    stream.on('error', () => {
      if (response.headersSent) {
        response.destroy();
        return;
      }
      response.writeHead(500, {'Content-Type': 'text/plain'});
      response.end('Internal server error');
    });

    response.writeHead(200, {
      'Content-Type':
        CONTENT_TYPES[extname(finalPath)] || 'application/octet-stream'
    });
    stream.pipe(response);
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      resolve({server, port: server.address().port});
    });
  });
}

const isMain = process.argv[1] &&
  import.meta.url === `file://${process.argv[1]}`;

if (isMain) {
  const port = Number(process.env.PORT || 8080);
  const {port: actualPort} = await startServer(process.cwd(), port);
  console.log(
    `Serving ${process.cwd()} at http://localhost:${actualPort}\n` +
    `Amazon project: http://localhost:${actualPort}/2-copy-of-code/lesson-18/amazon.html`
  );
}
