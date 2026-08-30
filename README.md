# Amazon project (SuperSimpleDev JavaScript course)

This repo contains the exercises and code from the SuperSimpleDev JavaScript
course:

- `1-exercise-solutions/` — exercise solutions, lesson by lesson.
- `2-copy-of-code/` — the code written during each lesson. `lesson-18` is the
  final, maintained version of the Amazon project.
- `3-links.md` — links referenced in the course.

## Running the Amazon project

The project uses ES modules, so it must be served over HTTP (opening the HTML
files directly with `file://` will not work).

```bash
npm install
npm start
```

Then open <http://localhost:8080/2-copy-of-code/lesson-18/amazon.html>.

Pages:

| Page | Description |
| --- | --- |
| `amazon.html` | Product grid, search (`?search=`), add to cart with quantity |
| `checkout.html` | Cart review, update quantity, delivery options, place order |
| `orders.html` | Orders saved after placing an order, buy again, track package |
| `tracking.html` | Package progress for `?orderId=&productId=` |

Products and orders come from the course backend at
<https://supersimplebackend.dev>; the cart and past orders are stored in
`localStorage`.

## Tests

Jasmine specs live in `2-copy-of-code/lesson-18/tests`. Run them headlessly:

```bash
npm test
```

The runner starts a static server and drives Chrome via `puppeteer-core`. It
uses the first Chrome/Chromium it finds; set `CHROME_PATH` to override.

You can also open <http://localhost:8080/2-copy-of-code/lesson-18/tests/tests.html>
in a browser while `npm start` is running.

## Linting

```bash
npm run lint
```

ESLint only checks the final version of the project (`lesson-18`) and the
tooling in `tools/`; earlier lessons are kept as-is for reference.
