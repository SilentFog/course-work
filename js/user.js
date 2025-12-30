// user.js - скрипт для сторінки профілю користувача: редагування даних профілю, зміна паролю, маскування логіну та валідація форм
document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profile-form');
  if (!profileForm) {
    return;
  }

  const editBtn = document.getElementById('edit-btn');
  const saveBtn = document.getElementById('save-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const loginDisplay = document.getElementById('login-display');
  const loginInput = document.getElementById('login-input');
  const passwordForm = document.getElementById('password-form');
  const regularInputs = profileForm.querySelectorAll('.input-field__input:not(#login-input)');


  function enableEditing() {
    regularInputs.forEach(input => {
      input.removeAttribute('readonly');
      input.removeAttribute('disabled');
    });

    if (loginDisplay) loginDisplay.classList.add('input-field__input--hidden');
    if (loginInput) {
      loginInput.classList.remove('input-field__input--hidden');
      loginInput.removeAttribute('readonly');
      loginInput.focus();
    }

    if (editBtn) editBtn.classList.add('btn--hidden');
    if (saveBtn) saveBtn.classList.remove('btn--hidden');
    if (cancelBtn) cancelBtn.classList.remove('btn--hidden');
  }

  function disableEditing() {
    regularInputs.forEach(input => {
      input.setAttribute('readonly', true);
    });

    if (loginInput) loginInput.classList.add('input-field__input--hidden');
    if (loginDisplay) loginDisplay.classList.remove('input-field__input--hidden');

    if (editBtn) editBtn.classList.remove('btn--hidden');
    if (saveBtn) saveBtn.classList.add('btn--hidden');
    if (cancelBtn) cancelBtn.classList.add('btn--hidden');
  }

  function cancelEditing() {
    location.reload();
  }

  async function saveProfile(e) {
    e.preventDefault();

    const data = {
      first_name: profileForm.querySelector('#first-name')?.value.trim() || '',
      last_name: profileForm.querySelector('#last-name')?.value.trim() || '',
      login: loginInput?.value.trim() || '',
      phone: profileForm.querySelector('#phone')?.value.trim() || '',
      email: profileForm.querySelector('#email')?.value.trim() || '',
    };

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Профіль успішно оновлено!');

        // Маскируем логин после сохранения
        if (loginDisplay && data.login) {
          const masked = data.login.slice(0, 5) + '***';
          loginDisplay.value = masked;
        }

        disableEditing();
      } else {
        alert('Помилка: ' + (result.message || 'Не вдалося зберегти зміни'));
      }
    } catch (err) {
      console.error(err);
      alert('Помилка мережі. Дані збережено локально (демо-режим).');
      localStorage.setItem('userProfile', JSON.stringify(data));
      location.reload();
    }
  }


  if (editBtn) editBtn.addEventListener('click', enableEditing);
  if (cancelBtn) cancelBtn.addEventListener('click', cancelEditing);
  profileForm.addEventListener('submit', saveProfile);

  if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const currentPass = document.getElementById('current-password')?.value || '';
      const newPass = document.getElementById('new-password')?.value || '';
      const confirmPass = document.getElementById('confirm-password')?.value || '';

      if (newPass !== confirmPass) {
        alert('Новий пароль та підтвердження не співпадають!');
        return;
      }
      if (newPass.length < 6) {
        alert('Новий пароль має бути не менше 6 символів');
        return;
      }

      try {
        const response = await fetch('/api/profile/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            current_password: currentPass,
            new_password: newPass
          })
        });

        const result = await response.json();

        if (response.ok) {
          alert('Пароль успішно змінено!');
          passwordForm.reset();
        } else {
          alert('Помилка: ' + (result.message || 'Не вдалося змінити пароль'));
        }
      } catch (err) {
        console.error(err);
        alert('Помилка мережі (демо-режим)');
      }
    });
  }

  regularInputs.forEach(input => {
    input.setAttribute('readonly', true);
  });
});