
import { products } from './products.js';
document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.pathname.includes('product-page.html')) return;

  const wrapper = document.getElementById('relatedProducts');
  if (!wrapper) return; 


  function getRandomRating() {
    const rating = Math.floor(Math.random() * 5) + 1;
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  const relatedItems = products.slice(0, 50);

  wrapper.innerHTML = relatedItems.map(product => `
    <li class="swiper-slide product-card">
      <a href="product-page.html?id=${product.id}" class="product-card__link">
        <div class="product-card__img">
          <img src="${product.img}" alt="${product.title}" loading="lazy">
        </div>
        <div class="product-card__title">${product.title}</div>
        <div class="product-card__bottom">
          <div class="product-card__price">${product.price}</div>
          <div class="product-card__rating">${getRandomRating()}</div>
        </div>
      </a>
    </li>
  `).join('');

 
  const swiper = new Swiper('.related-products__swiper', {
    loop: relatedItems.length > 5, 
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      0: { slidesPerView: 1.2, spaceBetween: 16 },
      768: { slidesPerView: 3, spaceBetween: 24 },
      1200: { slidesPerView: 5, spaceBetween: 38 },
    }
  });
});
