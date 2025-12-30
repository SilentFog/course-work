// slider-main.js — скрипт для головного слайдера на index.html
// Відповідає за:
// 1. Ініціалізацію слайдера (пошук слайдів, кнопок, точок),
// 2. Перемикання слайдів вперед/назад по кнопках,
// 3. Відображення активного слайду та відповідної точки,
// 4. Клік на слайд або на слайдер відкриває посилання активного слайду,
// 5. Автоперемикання слайдів кожні 5 секунд,
// 6. Пауза автоперемикання при наведенні курсора на слайдер,
// 7. Підтримка циклічності слайдів (останній → перший, перший → останній).

document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
        return;
    }

    const slider = document.querySelector('.slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slider__slide:not(.slider__slide--placeholder)');
    const prevBtn = slider.querySelector('.slider__btn--prev');
    const nextBtn = slider.querySelector('.slider__btn--next');
    const dots = slider.querySelectorAll('.slider__dot');

    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('slider__slide--active', i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('slider__dot--active', i === index);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    slides.forEach((slide, i) => {
        const link = slide.querySelector('a');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault(); 
                if (i === currentIndex) { 
                    window.location.href = link.href;
                }
            });
        }
    });


   
    slider.addEventListener('click', (e) => {
     
        if (e.target.closest('.slider__btn') || e.target.closest('.slider__dot')) return;

        const activeSlideLink = slides[currentIndex].querySelector('a');
        if (activeSlideLink) {
            window.location.href = activeSlideLink.href;
        }
    });

    let autoSlide = setInterval(nextSlide, 5000);

    slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
    slider.addEventListener('mouseleave', () => autoSlide = setInterval(nextSlide, 5000));

    showSlide(currentIndex);
});
