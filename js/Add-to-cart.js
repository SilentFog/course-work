// add-to-cart.js — скрипт для бокової корзини та роботи з товаром на сторінках продуктів
// Відповідає за:
// 1. Завантаження та відображення товарів у боковій корзині з localStorage,
// 2. Додавання товарів на сторінці продукту та оновлення їх кількості,
// 3. Кнопки + / − для зміни кількості, автоматичне оновлення суми та localStorage,
// 4. Видалення окремих товарів через кнопку "×", оновлення totals та шапки,
// 5. Обчислення загальної суми і податку в корзині,
// 6. Відкриття та закриття бокової корзини через overlay або кнопки шапки,
// 7. Синхронізація стану корзини в шапці (иконка корзини) з localStorage,
// 8. Обмеження довжини опису товару при відображенні,
// 9. Збереження всіх змін у localStorage, щоб стан корзини зберігався між перезавантаженнями сторінки.

import { products } from './products.js';
const addToCartBtn = document.querySelector('.btn--add-to-cart');
const cart = document.querySelector('.cart');
const cartItemsList = cart ? cart.querySelector('.cart-items') : null;
const cartTotalEl = cart ? cart.querySelectorAll('.line-item__value')[0] : null;
const cartTaxEl = cart ? cart.querySelectorAll('.line-item__value')[1] : null;
const TAX_RATE = 0.05;

const basketEmpty = document.querySelector('.basket-empty');
const basketFull = document.querySelector('.basket-full');
const basketPriceEl = basketFull ? basketFull.querySelector('.basket__price') : null;
const basketCountEl = basketFull ? basketFull.querySelector('.basket__count') : null;

const cartOverlay = document.createElement('div');
cartOverlay.className = 'cart-overlay';
document.body.appendChild(cartOverlay);

const params = new URLSearchParams(window.location.search);
const productId = Number(params.get('id'));
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
}

const CART_STORAGE_KEY = 'shoppingCart';

function updateHeaderBasket() {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const cartItems = savedCart ? JSON.parse(savedCart) : [];

    let totalItems = 0;
    let totalPrice = 0;

    cartItems.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    if (totalItems === 0) {
        if (basketEmpty) basketEmpty.style.display = 'flex';
        if (basketFull) basketFull.style.display = 'none';
    } else {
        if (basketEmpty) basketEmpty.style.display = 'none';
        if (basketFull) {
            basketFull.style.display = 'flex';
            if (basketPriceEl) basketPriceEl.textContent = `${totalPrice.toLocaleString()} ₴`;
            if (basketCountEl) basketCountEl.textContent = totalItems;
        }
    }
}

const orderBtn = document.querySelector('.btn--order');
if (orderBtn) {
    orderBtn.addEventListener('click', () => {
        window.location.href = 'Ordering.html';
    });
}
function saveCartToStorage() {
    if (!cartItemsList) return;
    const cartItems = [];
    cartItemsList.querySelectorAll('.cart-item').forEach(item => {
        const title = item.querySelector('.cart-item__name').textContent;
        const price = parseInt(item.querySelector('.cart-item__price').dataset.price, 10);
        const quantity = parseInt(item.querySelector('.counter__value').textContent, 10);
        const img = item.querySelector('.cart-item__img').src;
        const description = item.querySelector('.cart-item__desc').textContent;
        cartItems.push({ title, price, quantity, img, description });
    });
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

function loadCartFromStorage() {
    if (!cartItemsList) return;
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!savedCart) return;

    const cartItems = JSON.parse(savedCart);
    cartItems.forEach(itemData => createCartItem(itemData));

    updateCartTotals();
    updateHeaderBasket();
}

function createCartItem(itemData) {
    if (!cartItemsList) return;

    const cartItem = document.createElement('li');
    cartItem.className = 'cart-item';
    const basePrice = parseInt(itemData.price, 10);
    let currentQuantity = itemData.quantity;

    cartItem.innerHTML = `
        <div class="cart-item__border">
            <a href="#" class="cart-item__link">
                <img src="${itemData.img}" alt="${itemData.title}" class="cart-item__img">
                <div class="cart-item__info">
                    <span class="cart-item__name">${itemData.title}</span>
                    <p class="cart-item__desc">${itemData.description}</p>
                </div>
            </a>
            <span class="cart-item__price" data-price="${basePrice}">${(basePrice * currentQuantity).toLocaleString('uk-UA')} ₴</span>
            <div class="counter">
                <button class="counter__btn counter__btn--minus">-</button>
                <span class="counter__value">${currentQuantity}</span>
                <button class="counter__btn counter__btn--plus">+</button>
            </div>
            <button class="cart-item__remove">&times;</button>
        </div>
    `;
    cartItemsList.appendChild(cartItem);

    const counter = cartItem.querySelector('.counter');
    const minusBtn = counter.querySelector('.counter__btn--minus');
    const plusBtn = counter.querySelector('.counter__btn--plus');
    const valueSpan = counter.querySelector('.counter__value');
    const priceSpan = cartItem.querySelector('.cart-item__price');

    minusBtn.addEventListener('click', () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            valueSpan.textContent = currentQuantity;
            priceSpan.textContent = (basePrice * currentQuantity).toLocaleString('uk-UA') + ' ₴';
            updateCartTotals();
            saveCartToStorage();
            updateHeaderBasket();
        }
    });

    plusBtn.addEventListener('click', () => {
        currentQuantity++;
        valueSpan.textContent = currentQuantity;
        priceSpan.textContent = (basePrice * currentQuantity).toLocaleString('uk-UA') + ' ₴';
        updateCartTotals();
        saveCartToStorage();
        updateHeaderBasket();
    });

    attachRemoveEvent(cartItem);
}

function updateCartTotals() {
    if (!cartItemsList || !cartTotalEl) return;
    let total = 0;
    cartItemsList.querySelectorAll('.cart-item').forEach(item => {
        const price = parseInt(item.querySelector('.cart-item__price').dataset.price, 10);
        const quantity = parseInt(item.querySelector('.counter__value').textContent, 10);
        total += price * quantity;
    });
    cartTotalEl.textContent = `${total} ₴`;
    if (cartTaxEl) cartTaxEl.textContent = `${Math.round(total * TAX_RATE)} ₴`;
}

function truncateText(el, maxLength = 100) {
    if (el && el.textContent.length > maxLength) {
        el.textContent = el.textContent.slice(0, maxLength) + '...';
    }
}

function openCart() {
    const emptyBlock = document.querySelector('.cart-empty');
    const hasItems = cartItemsList && cartItemsList.querySelectorAll('.cart-item').length > 0;

    if (hasItems) {
        if (cart) cart.classList.add('cart--active');
        cartOverlay.style.display = 'block';
    } else {
        if (emptyBlock) emptyBlock.style.display = 'flex';
    }

    document.body.style.overflow = 'hidden';
}

function closeCart() {
    if (cart) cart.classList.remove('cart--active');
    cartOverlay.style.display = 'none';

    const emptyBlock = document.querySelector('.cart-empty');
    if (emptyBlock) emptyBlock.style.display = 'none';

    document.body.style.overflow = '';
}

const emptyCloseBtn = document.querySelector('.cart-empty .icon-close');
if (emptyCloseBtn) emptyCloseBtn.addEventListener('click', closeCart);

cartOverlay.addEventListener('click', closeCart);

function attachRemoveEvent(cartItem) {
    cartItem.querySelector('.cart-item__remove').addEventListener('click', () => {
        cartItem.remove();
        updateCartTotals();
        saveCartToStorage();
        updateHeaderBasket();
    });
}

if (addToCartBtn && product && cartItemsList) {
    addToCartBtn.addEventListener('click', () => {
        const existingItem = [...cartItemsList.querySelectorAll('.cart-item')].find(item =>
            item.querySelector('.cart-item__name').textContent === product.title
        );

        if (existingItem) {
            const counter = existingItem.querySelector('.counter__value');
            let currentQuantity = parseInt(counter.textContent, 10) + 1;
            counter.textContent = currentQuantity;
            const priceSpan = existingItem.querySelector('.cart-item__price');
            const basePrice = parseInt(priceSpan.dataset.price, 10);
            priceSpan.textContent = (basePrice * currentQuantity).toLocaleString('uk-UA') + ' ₴';
        } else {
            createCartItem({
                img: product.img,
                title: product.title,
                description: product.description,
                price: parseInt(product.price.replace(/\D/g, ''), 10),
                quantity: 1
            });
        }

        updateCartTotals();
        saveCartToStorage();
        updateHeaderBasket();
        openCart();
    });
}

basketEmpty?.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
basketFull?.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
cart?.querySelector('.cart__btn--close')?.addEventListener('click', closeCart);

loadCartFromStorage();
updateCartTotals();
updateHeaderBasket();
