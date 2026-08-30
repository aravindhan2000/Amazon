import {renderPaymentSummary} from '../../scripts/checkout/paymentSummary.js';
import {loadFromStorage} from '../../data/cart.js';
import {loadProductsFetch} from '../../data/products.js';

describe('test suite: renderPaymentSummary', () => {
  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  beforeAll(async () => {
    await loadProductsFetch();
  });

  beforeEach(() => {
    spyOn(localStorage, 'setItem');

    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-payment-summary"></div>
    `;
  });

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  });

  it('displays the total quantity of items in the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId1,
        quantity: 2,
        deliveryOptionId: '1'
      }, {
        productId: productId2,
        quantity: 3,
        deliveryOptionId: '2'
      }]);
    });
    loadFromStorage();

    renderPaymentSummary();

    expect(
      document.querySelector('.js-payment-summary').innerText
    ).toContain('Items (5)');
  });

  it('disables the place order button when the cart is empty', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => JSON.stringify([]));
    loadFromStorage();

    renderPaymentSummary();

    expect(document.querySelector('.js-place-order').disabled).toEqual(true);
  });
});
