import {loadPage} from '../scripts/amazon.js';

describe('test suite: loadPage', () => {
  beforeEach(() => {
    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-products-grid"></div>
    `;
  });

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  });

  it('shows an error message when the products fail to load', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.reject(new Error('network error'))
    );

    await loadPage();

    expect(
      document.querySelector('.js-products-grid').innerText
    ).toContain('Please check your connection');
    expect(
      document.querySelector('.product-container')
    ).toEqual(null);
  });
});
