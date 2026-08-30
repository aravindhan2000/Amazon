import {getOrder} from '../data/orders.js';
import {getProduct, loadProductsFetch} from '../data/products.js';
import {initHeaderSearch, updateCartQuantityDisplay} from './shared/header.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function loadPage() {
  initHeaderSearch();
  updateCartQuantityDisplay();

  try {
    await loadProductsFetch();
  } catch {
    renderMessage('Unexpected error. Please try again later.');
    return;
  }

  renderTracking();
}
loadPage();

function renderMessage(message) {
  document.querySelector('.js-order-tracking').innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    <div class="tracking-message">${message}</div>
  `;
}

function renderTracking() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = getOrder(orderId);
  const product = getProduct(productId);
  const orderProduct = order && order.products.find(
    (item) => item.productId === productId
  );

  if (!order || !product || !orderProduct) {
    renderMessage('We could not find this package.');
    return;
  }

  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(orderProduct.estimatedDeliveryTime);
  const now = dayjs();

  const totalMs = deliveryTime.diff(orderTime);
  const elapsedMs = now.diff(orderTime);
  const percentProgress = totalMs <= 0
    ? 100
    : Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));

  const isPreparing = percentProgress < 50;
  const isDelivered = percentProgress >= 100;
  const isShipped = !isPreparing && !isDelivered;

  document.querySelector('.js-order-tracking').innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      ${isDelivered ? 'Delivered on' : 'Arriving on'}
      ${deliveryTime.format('dddd, MMMM D')}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${orderProduct.quantity}
    </div>

    <img class="product-image" alt="${product.name}" src="${product.image}">

    <div class="progress-labels-container">
      <div class="progress-label ${isPreparing ? 'current-status' : ''}">
        Preparing
      </div>
      <div class="progress-label ${isShipped ? 'current-status' : ''}">
        Shipped
      </div>
      <div class="progress-label ${isDelivered ? 'current-status' : ''}">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>
  `;
}
