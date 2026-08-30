import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {loadProductsFetch} from '../data/products.js';

async function loadPage() {
  try {
    await loadProductsFetch();
  } catch {
    document.querySelector('.js-order-summary').innerHTML = `
      <div class="checkout-error-message">
        Unexpected error. Please try again later.
      </div>
    `;
    return;
  }

  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();
