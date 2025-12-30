// product-page-breadcrumbs.js — скрипт для сторінки окремого товару
// Відповідає за:
// 1. Отримання id товару та категорії з URL,
// 2. Пошук відповідного товару в масиві products,
// 3. Заповнення основної інформації про товар на сторінці (назва, зображення, опис),
// 4. Оновлення breadcrumbs (верхня навігаційна панель) з посиланням на категорію та поточний товар.

const params = new URLSearchParams(window.location.search);
const productId = Number(params.get('id'));
const urlCategory = params.get('category'); 
import { products } from './products.js';

const product = products.find(p => p.id === productId);

if (product) {

    const titleEl = document.querySelector('.product-page__title');
    const imgEl = document.querySelector('.product-page__main-img');
    const descEl = document.querySelector('.product-page__description-text');

    if (titleEl) titleEl.textContent = product.title;
    if (imgEl) {
        imgEl.src = product.img;
        imgEl.alt = product.title;
    }
    if (descEl) descEl.textContent = product.description;

    const categoryLink = document.getElementById('category-link');
    const currentProductEl = document.getElementById('current-product');

    if (currentProductEl) {
        currentProductEl.textContent = product.title;
    }

    if (categoryLink) {
        if (urlCategory && urlCategory !== 'Все') {
            categoryLink.textContent = urlCategory;
            categoryLink.href = `index.html?category=${encodeURIComponent(urlCategory)}`;
        } else {
            categoryLink.textContent = 'Ігрові ПК';
            categoryLink.href = 'index.html';
        }
    }
}