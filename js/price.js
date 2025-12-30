// src/price.js — скрипт для сторінки товару: управління кількістю та ціною товару

document.addEventListener('DOMContentLoaded', () => {
    const isProductPage = document.querySelector('.product-page');
    if (!isProductPage) {
        return;
    }
    const counter = document.querySelector('.product-page__counter');
    if (!counter) return;
    const minusBtn = counter.querySelector('.counter__btn--minus');
    const plusBtn = counter.querySelector('.counter__btn--plus');
    const valueSpan = counter.querySelector('.counter__value');
    const priceSpan = document.querySelector('.cart-item__price');
    if (minusBtn && plusBtn && valueSpan && priceSpan) {
        let basePrice = parseInt(priceSpan.textContent.replace(/\D/g, ''), 10);
        let quantity = parseInt(valueSpan.textContent, 10);
        function updatePrice() {
            const totalPrice = basePrice * quantity;
            priceSpan.textContent = totalPrice.toLocaleString('uk-UA') + ' ₴';
            valueSpan.textContent = quantity;
        }
        plusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            quantity++;
            updatePrice();
        });
        minusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (quantity > 1) {
                quantity--;
                updatePrice();
            }
        });
    }
});