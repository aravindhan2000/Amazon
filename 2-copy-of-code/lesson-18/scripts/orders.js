import {orders} from '../data/orders.js';
import {addToCart} from '../data/cart.js';
import {getProduct, loadProductsFetch} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
import {initHeaderSearch, updateCartQuantityDisplay} from './shared/header.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function loadPage() {
  initHeaderSearch();
  updateCartQuantityDisplay();

  try {
    await loadProductsFetch();
  } catch {
    document.querySelector('.js-orders-grid').innerHTML = `
      <div class="orders-message">
        Unexpected error. Please try again later.
      </div>
    `;
    return;
  }

  renderOrders();
}
loadPage();

function renderOrders() {
  if (orders.length === 0) {
    document.querySelector('.js-orders-grid').innerHTML = `
      <div class="orders-message">
        You have no orders yet.
        <a class="link-primary" href="amazon.html">Start shopping</a>
      </div>
    `;
    return;
  }

  let ordersHTML = '';

  orders.forEach((order) => {
    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${dayjs(order.orderTime).format('MMMM D')}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${orderProductsHTML(order)}
        </div>
      </div>
    `;
  });

  document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

  document.querySelectorAll('.js-buy-again-button')
    .forEach((button) => {
      button.addEventListener('click', () => {
        addToCart(button.dataset.productId);
        updateCartQuantityDisplay();

        button.querySelector('.buy-again-message').innerHTML = 'Added';
      });
    });
}

function orderProductsHTML(order) {
  let html = '';

  order.products.forEach((orderProduct) => {
    const product = getProduct(orderProduct.productId);

    if (!product) {
      return;
    }

    html += `
      <div class="product-image-container">
        <img alt="${product.name}" src="${product.image}">
      </div>

      <div class="product-details">
        <div class="product-name">
          ${product.name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${
            dayjs(orderProduct.estimatedDeliveryTime).format('MMMM D')
          }
        </div>
        <div class="product-quantity">
          Quantity: ${orderProduct.quantity}
        </div>
        <button class="buy-again-button button-primary js-buy-again-button"
          data-product-id="${product.id}">
          <img class="buy-again-icon" src="images/icons/buy-again.png" alt="">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
    `;
  });

  return html;
}
