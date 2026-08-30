export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart'));

  if (!cart) {
    cart = [{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1'
    }, {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2'
    }];
  }
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1) {
  const matchingItem = cart.find(
    (cartItem) => cartItem.productId === productId
  );

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();
}

export function updateQuantity(productId, quantity) {
  const matchingItem = cart.find(
    (cartItem) => cartItem.productId === productId
  );

  if (!matchingItem) {
    return;
  }

  matchingItem.quantity = quantity;

  saveToStorage();
}

export function clearCart() {
  cart = [];

  saveToStorage();
}

export function calculateCartQuantity() {
  return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
}

export function removeFromCart(productId) {
  cart = cart.filter((cartItem) => cartItem.productId !== productId);

  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  const matchingItem = cart.find(
    (cartItem) => cartItem.productId === productId
  );

  if (!matchingItem) {
    return;
  }

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}