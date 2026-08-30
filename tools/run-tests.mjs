import {existsSync} from 'node:fs';
import puppeteer from 'puppeteer-core';
import {startServer} from './serve.mjs';

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/home/ubuntu/.local/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean);

const executablePath = CHROME_CANDIDATES.find((path) => existsSync(path));

if (!executablePath) {
  console.error(
    'Could not find Chrome. Set CHROME_PATH to a Chrome/Chromium binary.'
  );
  process.exit(1);
}

const {server, port} = await startServer(process.cwd());
const browser = await puppeteer.launch({
  executablePath,
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});

let failed = true;

try {
  const page = await browser.newPage();
  page.on('console', (message) => {
    if (message.type() === 'error') {
      console.error(`[browser] ${message.text()}`);
    }
  });

  await page.goto(
    `http://127.0.0.1:${port}/2-copy-of-code/lesson-18/tests/tests.html`,
    {waitUntil: 'networkidle0'}
  );

  await page.waitForSelector('.jasmine-overall-result', {timeout: 60000});

  const summary = await page.$eval(
    '.jasmine-overall-result',
    (element) => element.textContent.trim()
  );
  const failures = await page.$$eval(
    '.jasmine-failures .jasmine-spec-detail',
    (elements) => elements.map((element) => element.textContent.trim())
  );

  console.log(summary);
  failures.forEach((failure) => console.error(`\n${failure}`));

  failed = failures.length > 0 || /failure/.test(summary) &&
    !/0 failures/.test(summary);
} finally {
  await browser.close();
  server.close();
}

process.exit(failed ? 1 : 0);
