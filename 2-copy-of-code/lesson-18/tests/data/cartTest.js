import {
  addToCart,
  calculateCartQuantity,
  cart,
  loadFromStorage,
  removeFromCart,
  updateDeliveryOption,
  updateQuantity
} from '../../data/cart.js';

const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

function loadCartWith(items) {
  spyOn(localStorage, 'setItem');
  spyOn(localStorage, 'getItem').and.callFake(() => JSON.stringify(items));
  loadFromStorage();
}

describe('test suite: addToCart', () => {
  it('adds an existing product to the cart', () => {
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '1'
      }]);
    });
    loadFromStorage();

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
  });

  it('adds a new product to the cart', () => {
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });
    loadFromStorage();

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
  });
});
describe('test suite: cart quantities', () => {
  it('adds the selected quantity of a new product', () => {
    loadCartWith([]);

    addToCart(productId1, 3);
    expect(cart.length).toEqual(1);
    expect(cart[0].quantity).toEqual(3);
  });

  it('adds the selected quantity to an existing product', () => {
    loadCartWith([{productId: productId1, quantity: 2, deliveryOptionId: '1'}]);

    addToCart(productId1, 3);
    expect(cart.length).toEqual(1);
    expect(cart[0].quantity).toEqual(5);
  });

  it('calculates the total cart quantity', () => {
    loadCartWith([
      {productId: productId1, quantity: 2, deliveryOptionId: '1'},
      {productId: productId2, quantity: 3, deliveryOptionId: '2'}
    ]);

    expect(calculateCartQuantity()).toEqual(5);
  });

  it('updates the quantity of a product', () => {
    loadCartWith([{productId: productId1, quantity: 2, deliveryOptionId: '1'}]);

    updateQuantity(productId1, 7);
    expect(cart[0].quantity).toEqual(7);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('ignores updates for products that are not in the cart', () => {
    loadCartWith([{productId: productId1, quantity: 2, deliveryOptionId: '1'}]);

    updateQuantity(productId2, 7);
    updateDeliveryOption(productId2, '3');
    expect(cart[0].quantity).toEqual(2);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('removes a product from the cart', () => {
    loadCartWith([
      {productId: productId1, quantity: 2, deliveryOptionId: '1'},
      {productId: productId2, quantity: 3, deliveryOptionId: '2'}
    ]);

    removeFromCart(productId1);
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId2);
  });
});
