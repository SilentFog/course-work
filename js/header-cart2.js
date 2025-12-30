// header-cart.js — скрипт для іконки корзини у шапці на всіх сторінках
// Відображає порожню або заповнену корзину, суму і кількість товарів із localStorage

const basketEmpty = document.querySelector('.basket-empty');
const basketFull = document.querySelector('.basket-full');
const basketPriceEl = basketFull ? basketFull.querySelector('.basket__price') : null;
const basketCountEl = basketFull ? basketFull.querySelector('.basket__count') : null;

const CART_STORAGE_KEY = 'shoppingCart';

// в начале/конце файла
export function updateHeaderBasket() {
    const basketEmpty = document.querySelector('.basket-empty');
    const basketFull = document.querySelector('.basket-full');
    const basketPriceEl = basketFull ? basketFull.querySelector('.basket__price') : null;
    const basketCountEl = basketFull ? basketFull.querySelector('.basket__count') : null;

    const CART_STORAGE_KEY = 'shoppingCart';
    const saved = localStorage.getItem(CART_STORAGE_KEY);

    if (!saved || saved === '[]') {
        if (basketEmpty) basketEmpty.style.display = 'flex';
        if (basketFull) basketFull.style.display = 'none';
        return;
    }

    let cartItems;
    try {
        cartItems = JSON.parse(saved);
    } catch (e) {
        console.error('Ошибка чтения корзины из localStorage');
        return;
    }

    let totalItems = 0;
    let totalPrice = 0;

    cartItems.forEach(item => {
        if (item.quantity > 0 && item.price > 0) {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        }
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

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', updateHeaderBasket);

// Автообновление при изменении localStorage
window.addEventListener('storage', (e) => {
    if (e.key === 'shoppingCart') updateHeaderBasket();
});
