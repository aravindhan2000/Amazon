import {
  cart,
  removeFromCart,
  updateDeliveryOption,
  updateQuantity
} from '../../data/cart.js';
import {getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import {formatDeliveryDate} from '../utils/deliveryDate.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import {renderPaymentSummary} from './paymentSummary.js';
import {updateCartQuantityDisplay} from '../shared/header.js';

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 1000;

export function renderOrderSummary() {
  if (cart.length === 0) {
    document.querySelector('.js-order-summary').innerHTML = `
      <div class="empty-cart-message">
        Your cart is empty.
        <a class="link-primary" href="amazon.html">View products</a>
      </div>
    `;
    updateCheckoutHeaderQuantity();
    return;
  }

  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const matchingProduct = getProduct(cartItem.productId);
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    const dateString = formatDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container
        js-cart-item-container
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            alt="${matchingProduct.name}"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              ${matchingProduct.getPrice()}
            </div>
            <div class="product-quantity
              js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link"
                data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${matchingProduct.id}"
                type="number" min="${MIN_QUANTITY}" max="${MAX_QUANTITY}"
                value="${cartItem.quantity}">
              <span class="save-quantity-link link-primary js-save-link"
                data-product-id="${matchingProduct.id}">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link
                js-delete-link-${matchingProduct.id}"
                data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const dateString = formatDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `;
    });

    return html;
  }

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  updateCheckoutHeaderQuantity();

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        removeFromCart(link.dataset.productId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });

  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.add('is-editing-quantity');
        document.querySelector(`.js-quantity-input-${productId}`).focus();
      });
    });

  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        saveQuantity(link.dataset.productId);
      });
    });

  cart.forEach((cartItem) => {
    const input = document.querySelector(
      `.js-quantity-input-${cartItem.productId}`
    );

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        saveQuantity(cartItem.productId);
      }
    });
  });

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
}

function saveQuantity(productId) {
  const input = document.querySelector(`.js-quantity-input-${productId}`);
  const newQuantity = Number(input.value);

  if (!Number.isInteger(newQuantity) ||
      newQuantity < MIN_QUANTITY ||
      newQuantity > MAX_QUANTITY) {
    input.classList.add('quantity-input-error');
    return;
  }

  updateQuantity(productId, newQuantity);
  renderOrderSummary();
  renderPaymentSummary();
}

function updateCheckoutHeaderQuantity() {
  updateCartQuantityDisplay();

  const element = document.querySelector('.js-checkout-item-count');

  if (element) {
    const quantity = cart.reduce(
      (total, cartItem) => total + cartItem.quantity, 0
    );
    element.innerHTML = `${quantity} ${quantity === 1 ? 'item' : 'items'}`;
  }
}
