// related-products.js - скрипт для генерації списку схожих товарів на сторінці продукту
import { products } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('relatedProducts');
  if (!wrapper) return;
  wrapper.innerHTML = products.map(product => `
    <li class="swiper-slide product-card">
      <a href="product-page.html?id=${product.id}" class="product-card__link">
        <div class="product-card__img">
          <img src="${product.img}" alt="${product.title}" loading="lazy">
        </div>
        <div class="product-card__title">${product.title}</div>
        <div class="product-card__description">${product.description || ''}</div>
        <div class="product-card__bottom">
          <div class="product-card__price">${product.price}</div>
          <div class="product-card__rating">
            ${'⭐'.repeat(product.rating ?? 0)}${'☆'.repeat(5 - (product.rating ?? 0))}
          </div>
        </div>
      </a>
    </li>
  `).join('');
});
