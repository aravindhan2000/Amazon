import assert from 'node:assert/strict';
import {after, before, describe, it} from 'node:test';
import {startServer} from './serve.mjs';

const root = new URL('..', import.meta.url).pathname;

describe('static server', () => {
  let server;
  let baseUrl;

  before(async () => {
    const started = await startServer(root);
    server = started.server;
    baseUrl = `http://127.0.0.1:${started.port}`;
  });

  after(() => {
    server.close();
  });

  it('serves files inside the root', async () => {
    const response = await fetch(`${baseUrl}/package.json`);

    assert.equal(response.status, 200);
    assert.equal(JSON.parse(await response.text()).name, 'amazon-project');
  });

  it('stays alive when a directory has no index.html', async () => {
    const missingIndex = await fetch(`${baseUrl}/`);
    assert.equal(missingIndex.status, 404);
    await missingIndex.text();

    const stillAlive = await fetch(`${baseUrl}/package.json`);
    assert.equal(stillAlive.status, 200);
    await stillAlive.text();
  });

  it('does not serve files outside the root', async () => {
    const traversal = await fetch(`${baseUrl}/../../../etc/passwd`);
    assert.equal(traversal.status, 404);
    await traversal.text();

    const absolute = await fetch(`${baseUrl}//etc/passwd`);
    assert.equal(absolute.status, 404);
    await absolute.text();
  });
});
