import {calculateCartQuantity} from '../../data/cart.js';

export function updateCartQuantityDisplay() {
  const element = document.querySelector('.js-cart-quantity');

  if (element) {
    element.innerHTML = calculateCartQuantity();
  }
}

export function getSearchQuery() {
  return new URL(window.location.href).searchParams.get('search') || '';
}

export function initHeaderSearch() {
  const searchBar = document.querySelector('.js-search-bar');
  const searchButton = document.querySelector('.js-search-button');

  if (!searchBar || !searchButton) {
    return;
  }

  searchBar.value = getSearchQuery();

  const search = () => {
    const query = searchBar.value.trim();
    window.location.href = `amazon.html?search=${encodeURIComponent(query)}`;
  };

  searchButton.addEventListener('click', search);

  searchBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      search();
    }
  });
}
