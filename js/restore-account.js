// скрипт для роботи блоку "Не можете увійти?" на сторінці авторизації
document.addEventListener('DOMContentLoaded', () => {
  const loginHelp = document.querySelector('.login-help');
  if (!loginHelp) return;

  const forgotLink = document.querySelector('.auth-form__link');
  const authForm = document.querySelector('.auth-form');
  const authSide = document.querySelector('.auth--side');

  const radios = loginHelp.querySelectorAll('.radio__input');
  const continueBtn = loginHelp.querySelector('.btn--secondary');
  const wrapper = loginHelp.querySelector('.login-help__wrapper');

  const passwordResetBlock = document.querySelector('.password-reset.shadow-box.password');
  const loginResetBlock = document.querySelector('.password-reset.shadow-box.login');

  if (passwordResetBlock) passwordResetBlock.style.display = 'none';
  if (loginResetBlock) loginResetBlock.style.display = 'none';

  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (authForm) authForm.style.display = 'none';
      if (authSide) authSide.style.display = 'none';
      loginHelp.classList.add('active');
      if (wrapper) wrapper.style.display = 'block';
      radios.forEach(r => r.checked = false);
      if (continueBtn) continueBtn.classList.add('btn--disabled');
    });
  }

  loginHelp.addEventListener('change', (e) => {
    if (e.target.classList.contains('radio__input')) {
      if (continueBtn) continueBtn.classList.remove('btn--disabled');
    }
  });

  if (continueBtn) {
    continueBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const checked = loginHelp.querySelector('.radio__input:checked');
      if (!checked) return;

      const text = checked.closest('.radio')
        .querySelector('.radio__label-text')
        .textContent.trim()
        .toLowerCase();
      if (wrapper) wrapper.style.display = 'none';

      if (passwordResetBlock) passwordResetBlock.style.display = 'none';
      if (loginResetBlock) loginResetBlock.style.display = 'none';

      if (text.includes('пароль')) {
        if (passwordResetBlock) passwordResetBlock.style.display = 'block';
      } else {
        if (loginResetBlock) loginResetBlock.style.display = 'block';
      }
    });
  }

  document.addEventListener('click', (e) => {
    const backBtn = e.target.closest('.login-help__icon-button a');
    if (!backBtn) return;
    e.preventDefault();

    const inReset = backBtn.closest('.password-reset'); 

    if (inReset) {
      if (passwordResetBlock) passwordResetBlock.style.display = 'none';
      if (loginResetBlock) loginResetBlock.style.display = 'none';
      if (wrapper) wrapper.style.display = 'block';

      radios.forEach(r => r.checked = false);
      if (continueBtn) continueBtn.classList.add('btn--disabled');
    } else {
      loginHelp.classList.remove('active'); 

      if (wrapper) wrapper.style.display = 'block'; 
      if (authForm) authForm.style.display = 'block';
      if (authSide) authSide.style.display = 'flex';
      radios.forEach(r => r.checked = false);
      if (continueBtn) continueBtn.classList.add('btn--disabled');
    }
  });
});