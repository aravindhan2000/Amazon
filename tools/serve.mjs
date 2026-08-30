import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {extname, join, normalize} from 'node:path';

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
  const server = createServer(async (request, response) => {
    const urlPath = decodeURIComponent(new URL(
      request.url, 'http://localhost'
    ).pathname);
    const filePath = join(root, normalize(urlPath).replace(/^(\.\.[/\\])+/, ''));

    try {
      const stats = await stat(filePath);
      const finalPath = stats.isDirectory()
        ? join(filePath, 'index.html')
        : filePath;

      response.writeHead(200, {
        'Content-Type': CONTENT_TYPES[extname(finalPath)] || 'application/octet-stream'
      });
      createReadStream(finalPath).pipe(response);
    } catch {
      response.writeHead(404, {'Content-Type': 'text/plain'});
      response.end('Not found');
    }
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
