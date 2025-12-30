// pagination.js — скрипт для пагінації товарів на сторінці каталогу
// Відповідає за:
// 1. Розбивку всіх товарів з products.js на сторінки (по STEP товарів на сторінку),
// 2. Рендер поточної сторінки у контейнері products__grid,
// 3. Оновлення активної кнопки сторінки та стану стрілок "назад/вперед",
// 4. Відображення інформації про поточну сторінку (наприклад "2 із 5"),
// 5. Обробку кліків по кнопках пагінації та стрілках для перемикання сторінок.

import { products } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
  const productsGrid = document.querySelector('.products__grid');
  const pagination = document.querySelector('.pagination');

  if (!productsGrid || !pagination) return;

  const STEP = 9;
  let currentPage = 1;
  const totalPages = Math.ceil(products.length / STEP);

  const prevBtn = pagination.querySelector('.icon-small-arrow--left')?.closest('button');
  const nextBtn = pagination.querySelector('.icon-small-arrow:not(.icon-small-arrow--left)')?.closest('button');
  const pageBtns = [...pagination.querySelectorAll('.btn--pagination')]
    .filter(btn => !btn.querySelector('svg'));
  const info = pagination.querySelector('.pagination__info');

  function renderPage(page) {
    productsGrid.innerHTML = '';
    const start = (page - 1) * STEP;
    const end = start + STEP;

    products.slice(start, end).forEach(product => {
      productsGrid.insertAdjacentHTML('beforeend', `
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
  `);
    });


    pageBtns.forEach(btn => btn.classList.remove('btn--pagination-active'));
    pageBtns[page - 1]?.classList.add('btn--pagination-active');


    prevBtn?.classList.toggle('btn--disabled', page === 1);
    nextBtn?.classList.toggle('btn--disabled', page === totalPages);

    if (info) info.textContent = `${page} із ${totalPages}`;
  }

  pageBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      currentPage = index + 1;
      renderPage(currentPage);
    });
  });

  prevBtn?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
    }
  });

  nextBtn?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage);
    }
  });

  renderPage(currentPage);
});
