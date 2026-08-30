import {addToCart} from '../data/cart.js';
import {loadProductsFetch, searchProducts} from '../data/products.js';
import {
  getSearchQuery,
  initHeaderSearch,
  updateCartQuantityDisplay
} from './shared/header.js';

const addedMessageTimeouts = {};

async function loadPage() {
  initHeaderSearch();
  await loadProductsFetch();
  renderProductsGrid();
  updateCartQuantityDisplay();
}
loadPage();

function renderProductsGrid() {
  const search = getSearchQuery();
  const matchingProducts = searchProducts(search);

  if (matchingProducts.length === 0) {
    document.querySelector('.js-products-grid').innerHTML = `
      <div class="no-results-message">
        No products match "${search}".
        <a class="link-primary" href="amazon.html">View all products</a>
      </div>
    `;
    return;
  }

  let productsHTML = '';

  matchingProducts.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            alt="${product.name}"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            alt="Rating: ${product.rating.stars} out of 5"
            src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png" alt="">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const quantity = Number(
          document.querySelector(`.js-quantity-selector-${productId}`).value
        );

        addToCart(productId, quantity);
        updateCartQuantityDisplay();
        showAddedMessage(productId);
      });
    });
}

function showAddedMessage(productId) {
  const message = document.querySelector(`.js-added-to-cart-${productId}`);
  message.classList.add('added-to-cart-visible');

  clearTimeout(addedMessageTimeouts[productId]);

  addedMessageTimeouts[productId] = setTimeout(() => {
    message.classList.remove('added-to-cart-visible');
  }, 2000);
}
