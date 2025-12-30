// скрипт для авторизації та реєстрації на всіх сторінках
// Управляє модалкою авторизації, перемиканням вкладок Login/Register,
// Входом та реєстрацією через API, зберіганням даних користувача в localStorage,
// а також оновлює кнопки шапки (Login/Profile/Logout)



document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('btn-login');
  const overlay = document.getElementById('auth-overlay');
  const authForm = document.querySelector('.auth-form');
  const authCards = document.querySelectorAll('.auth-card');
  const loginFields = document.querySelector('.auth-form__fields--login');
  const registerFields = document.querySelector('.auth-form__fields--register');
  const authSide = document.querySelector('.auth--side');
  const profileBtn = document.getElementById('btn-profile');
  const logoutBtn = document.getElementById('btn-logout');

  let scrollPos = 0;

  const lockScroll = () => {
    scrollPos = window.pageYOffset;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPos}px`;
    document.body.style.width = '100%';
    document.body.classList.add('auth-open');
  };

  const unlockScroll = () => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPos);
    document.body.classList.remove('auth-open');
  };

  const updateAuthButtons = () => {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (openBtn) openBtn.style.display = user ? 'none' : 'flex';
    if (profileBtn) {
      if (user && user.username) {
        profileBtn.style.display = 'flex';
        const usernameLink = profileBtn.querySelector('.header__control-text a');
        if (usernameLink) usernameLink.textContent = user.username;
      } else {
        profileBtn.style.display = 'none';
      }
    }
  };

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('user');
      updateAuthButtons();
    });
  }

  if (openBtn && overlay) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      lockScroll();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        unlockScroll();
      }
    });
  }

  // ==== Переключение вход/регистрация ====
  authCards.forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.target;
      authCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      if (target === 'register') {
        loginFields && (loginFields.style.display = 'none');
        registerFields && (registerFields.style.display = 'block');
      } else {
        registerFields && (registerFields.style.display = 'none');
        loginFields && (loginFields.style.display = 'block');
      }
    });
  });

  const registerBtn = registerFields?.querySelector('button[type="submit"]');
  if (registerBtn) {
    registerBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const firstName = document.getElementById('first-name')?.value.trim();
      const lastName = document.getElementById('last-name')?.value.trim();
      const username = document.getElementById('reg-username')?.value.trim();
      const password = document.getElementById('reg-password')?.value;
      const email = document.getElementById('email')?.value.trim();
      const phone = document.getElementById('phone')?.value.trim();

      try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, username, password, email, phone })
        });

        const data = await res.json();

        if (res.ok) {
          alert('Регистрация успешна!');
          overlay?.classList.remove('active');
          unlockScroll();
        } else {
          alert(data.message || 'Ошибка регистрации');
        }
      } catch (err) {
        console.error(err);
        alert('Ошибка сервера');
      }
    });
  }

  const loginBtnSubmit = loginFields?.querySelector('button[type="submit"]');
  if (loginBtnSubmit) {
    loginBtnSubmit.addEventListener('click', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username')?.value.trim();
      const password = document.getElementById('password')?.value;

      if (!username || !password) {
        alert('Введите логин и пароль');
        return;
      }

      try {
        const loginRes = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok) {
          alert(loginData.message || 'Ошибка входа');
          return;
        }

        const profileRes = await fetch(`http://localhost:3000/api/user/me?username=${encodeURIComponent(username)}`);

        let fullUserData;
        if (profileRes.ok) {
          fullUserData = await profileRes.json();
          console.log('Полные данные загружены:', fullUserData);
        } else {
          console.warn('Не удалось загрузить полный профиль, используем минимум');
          fullUserData = loginData.user || { username };
        }

        localStorage.setItem('user', JSON.stringify(fullUserData));

        updateAuthButtons();
        overlay?.classList.remove('active');
        unlockScroll();

        alert('Вхід успішний!');

      } catch (err) {
        console.error(err);
        alert('Ошибка сервера при входе');
      }
    });
  }

  updateAuthButtons();
});