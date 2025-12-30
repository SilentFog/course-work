// products-page.js — скрипт для відображення товарів на сторінці каталогу та кнопки "Показати ще"
// Підвантажує товари порційно, додає рейтинги, оновлює лічильник видимих товарів і ховає кнопку, коли товари закінчуються

import { products } from './products.js';

const productsGrid = document.querySelector('.products__grid');
const loadMoreBtn = document.querySelector('.products__load-more');

if (!productsGrid || !loadMoreBtn) {
  console.warn('Контейнер или кнопка не найдены на странице');
} else {
  const STEP = 6;
  let visibleCount = 0;


  function getRandomRating() {
    const rating = Math.floor(Math.random() * 5) + 1;
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  function renderProduct(product) {
    const description = product.description ? product.description : '';
    productsGrid.insertAdjacentHTML('beforeend', `
      <li class="product-card">
        <a href="product-page.html?id=${product.id}" class="product-card__link">
          <div class="product-card__img">
            <img src="${product.img}" alt="${product.title}">
          </div>
          <div class="product-card__title">${product.title}</div>
          <div class="product-card__description">${description}</div>
          <div class="product-card__bottom">
            <div class="product-card__price">${product.price}</div>
            <div class="product-card__rating">${getRandomRating()}</div>
          </div>
        </a>
      </li>
    `);
  }

  function renderNextProducts() {
    const nextProducts = products.slice(visibleCount, visibleCount + STEP);
    nextProducts.forEach(renderProduct);
    visibleCount += STEP;
    if (visibleCount >= products.length) {
      loadMoreBtn.style.display = 'none';
    }
  }

  renderNextProducts();

  loadMoreBtn.addEventListener('click', renderNextProducts);
}
