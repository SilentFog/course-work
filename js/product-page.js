// product-page.js — скрипт для сторінки окремого товару: завантаження даних товару, заповнення сторінки та кнопка "Купити"

import { products } from './products.js';

const CART_STORAGE_KEY = 'shoppingCart'; 


const titleEl = document.querySelector('.product-page__title');
if (!titleEl) {
  console.log('Це не сторінка товару — скрипт пропущено');
} else {
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id'));

  if (isNaN(productId) || productId <= 0) {
    console.error('ID товару в URL не знайдено або некорректне');
    titleEl.textContent = 'Товар не знайдено';
  } else {

    const product = products.find(p => p.id === productId);

    if (!product) {
      console.error('Товар з id', productId, 'не знайдено в products.js');
      titleEl.textContent = 'Товар не знайдено';
    } else {
      console.log('Товар знайдено:', product.title);

      titleEl.textContent = product.title;

      const priceEl = document.querySelector('.cart-item__price');
      if (priceEl) priceEl.textContent = product.price;

      const descEl = document.querySelector('.product-page__description-text');
      if (descEl) descEl.textContent = product.description || 'Опис відсутній';

      const imgEl = document.querySelector('.product-page__main-img');
      if (imgEl) {
        imgEl.src = product.img;
        imgEl.alt = product.title;
      }
      const buyBtn = document.querySelector('.product-page__buy');

      if (buyBtn && product) { 
        buyBtn.addEventListener('click', (e) => {
          e.preventDefault();

          const quantityEl = document.querySelector('.product-page__counter .counter__value');
          const quantity = quantityEl ? parseInt(quantityEl.textContent, 10) : 1;

          localStorage.removeItem(CART_STORAGE_KEY);
          const buyItem = {
            title: product.title,
            price: parseInt(product.price.replace(/\D/g, ''), 10), 
            quantity: quantity,
            img: product.img,
            description: product.description || ''
          };

        
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([buyItem]));

          console.log(`"Купити" нажата: добавлен ${product.title}, количество: ${quantity}`);

        
          window.location.href = 'Ordering.html';
        });
      }
    }
  }
}