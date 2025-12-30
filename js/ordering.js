// src/ordering.js — скрипт для сторінки оформлення: управління кошиком, кількістю товарів та підрахунок підсумкових сум
import { updateHeaderBasket } from './header-cart2';

const CART_STORAGE_KEY = 'shoppingCart';
const TAX_RATE = 0.05;
const DELIVERY_PRICE = 120;

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsList = document.querySelector('.cart-items');
    if (!cartItemsList) return console.warn('.cart-items не найден');

    const finalTotalEl = document.querySelector('.order-block__header .line-item__value');
    const taxEl = document.querySelector('.line-item__label:has(svg.icon-interes) ~ .line-item__value');
    const deliveryEl = document.querySelector('.line-item__label:has(svg.icon-delivery) ~ .line-item__value');

    function loadCart() {
        const items = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
        cartItemsList.innerHTML = '';

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'cart-item cart-item--bord';
            li.dataset.title = item.title;

            li.innerHTML = `
                <a href="product-page.html?id=${item.id || ''}" class="cart-item__link">
                    <img src="${item.img}" alt="${item.title}" class="cart-item__img">
                    <div class="cart-item__info">
                        <span class="cart-item__name">${item.title}</span>
                        <p class="cart-item__desc">${item.description || ''}</p>
                    </div>
                </a>
                <span class="cart-item__price" data-price="${item.price}">${(item.price * item.quantity).toLocaleString('uk-UA')} ₴</span>
                <div class="counter">
                    <button class="counter__btn counter__btn--minus">-</button>
                    <span class="counter__value">${item.quantity}</span>
                    <button class="counter__btn counter__btn--plus">+</button>
                </div>
                <button class="cart-item__remove">
                    <svg class="icon" width="10" height="10">
                        <use href="public/images/symbol-defs.svg#icon-close"></use>
                    </svg>
                </button>
            `;
            cartItemsList.appendChild(li);

            attachCounterEvents(li);
            attachRemoveEvent(li);
        });

        updateTotalsFromStorage();
    }

    // --- Оновлення сум за даними з localStorage ---
    function updateTotalsFromStorage() {
        const items = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
        const goodsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        updateTotals(goodsTotal);
    }

    function updateTotals(goodsTotal) {
        const tax = goodsTotal > 0 ? Math.round(goodsTotal * TAX_RATE) : 0;
        const finalTotal = goodsTotal > 0 ? goodsTotal + tax + DELIVERY_PRICE : 0;

        if (finalTotalEl) finalTotalEl.textContent = `${finalTotal.toLocaleString('uk-UA')} ₴`;
        if (taxEl) taxEl.textContent = `${tax.toLocaleString('uk-UA')} ₴`;
        if (deliveryEl) deliveryEl.textContent = goodsTotal > 0 ? `${DELIVERY_PRICE.toLocaleString('uk-UA')} ₴` : '0 ₴';
    }


    // --- Лічильники + оновлення localStorage ---
    function attachCounterEvents(li) {
        const minus = li.querySelector('.counter__btn--minus');
        const plus = li.querySelector('.counter__btn--plus');
        const valueEl = li.querySelector('.counter__value');
        const priceEl = li.querySelector('.cart-item__price');
        const basePrice = parseInt(priceEl.dataset.price, 10);
        const title = li.dataset.title;

        const recalc = () => {
            const quantity = parseInt(valueEl.textContent, 10);
            priceEl.textContent = `${(basePrice * quantity).toLocaleString('uk-UA')} ₴`;

            const items = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
            const item = items.find(i => i.title === title);
            if (item) item.quantity = quantity;
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));

            updateTotalsFromStorage();
            updateHeaderBasket();
        };

        minus.addEventListener('click', () => {
            let q = parseInt(valueEl.textContent, 10);
            if (q > 1) {
                valueEl.textContent = q - 1;
                recalc();
            }
        });

        plus.addEventListener('click', () => {
            let q = parseInt(valueEl.textContent, 10);
            valueEl.textContent = q + 1;
            recalc();
        });
    }

    function attachRemoveEvent(li) {
        const removeBtn = li.querySelector('.cart-item__remove');
        if (!removeBtn) return;

        removeBtn.addEventListener('click', () => {
            const title = li.querySelector('.cart-item__name')?.textContent.trim();

            let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');

            cart = cart.filter(item => item.title !== title);

            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

            li.remove();

            const goodsTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
            updateTotals(goodsTotal);

            updateHeaderBasket();
        });
    }



    function calculateGoodsTotalFromDOM() {
        let total = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const basePrice = parseInt(item.querySelector('.cart-item__price').dataset.price, 10);
            const quantity = parseInt(item.querySelector('.counter__value').textContent, 10);
            total += basePrice * quantity;
        });
        return total;
    }

    function saveCartToStorage() {
        const items = [];
        document.querySelectorAll('.cart-item').forEach(item => {
            items.push({
                title: item.querySelector('.cart-item__name').textContent.trim(),
                description: item.querySelector('.cart-item__desc').textContent.trim(),
                img: item.querySelector('.cart-item__img').src,
                price: parseInt(item.querySelector('.cart-item__price').dataset.price, 10),
                quantity: parseInt(item.querySelector('.counter__value').textContent, 10)
            });
        });
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }

  
    const clearBtn = document.querySelector('.order-block__label[href=""]');
    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Очистити кошик?')) {
                localStorage.removeItem(CART_STORAGE_KEY);
                cartItemsList.innerHTML = '';
                updateTotals(0);
                updateHeaderBasket(); 
            }
        });
    }
    const newGoodsTotal = calculateGoodsTotalFromDOM();
    updateTotals(newGoodsTotal);
    updateHeaderBasket(); 


    loadCart();
});