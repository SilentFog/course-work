// profile-page.js — скрипт для сторінки профілю користувача: завантаження даних, редагування та збереження профілю

document.addEventListener('DOMContentLoaded', async () => {
  const lastNameInput = document.getElementById('last-name');
  const firstNameInput = document.getElementById('first-name');
  const loginDisplay = document.getElementById('login-display');
  const loginInput = document.getElementById('login-input');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  const addressInput = document.getElementById('address');
  const birthdayInput = document.getElementById('birthday');
  const editBtn = document.getElementById('edit-btn');
  const saveBtn = document.getElementById('save-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  if (!lastNameInput || !firstNameInput || !loginDisplay || !loginInput) return;

  let currentUser = null;

  const getCurrentUser = () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      alert('Не авторизован. Вход заново.');
      window.location.href = '/login';
      return null;
    }
    return JSON.parse(userJson);
  };

  currentUser = getCurrentUser();
  if (!currentUser) return;

  const updateLoginDisplay = (username) => {
    if (!username || username.length <= 4) {
      loginDisplay.value = username || '';
    } else {
      loginDisplay.value = username.substring(0, 4) + '*'.repeat(username.length - 4);
    }
  };

  const loadProfile = (userData = currentUser) => {
    lastNameInput.value = userData.lastName || '';
    firstNameInput.value = userData.firstName || '';
    loginInput.value = userData.username || '';
    updateLoginDisplay(userData.username || '');
    phoneInput.value = userData.phone || '';
    emailInput.value = userData.email || '';
    if (addressInput) addressInput.value = userData.address || '';
    if (birthdayInput) birthdayInput.value = userData.birthday || '';

    [lastNameInput, firstNameInput, phoneInput, emailInput, addressInput, birthdayInput]
      .filter(el => el)
      .forEach(el => el.setAttribute('readonly', true));

    loginInput.classList.add('input-field__input--hidden');
    loginDisplay.classList.remove('input-field__input--hidden');
  };

  loadProfile();

  editBtn.addEventListener('click', () => {
    [lastNameInput, firstNameInput, phoneInput, emailInput, addressInput, birthdayInput]
      .filter(el => el)
      .forEach(el => el.removeAttribute('readonly'));

    loginInput.classList.remove('input-field__input--hidden');
    loginDisplay.classList.add('input-field__input--hidden');

    editBtn.classList.add('btn--hidden');
    saveBtn.classList.remove('btn--hidden');
    cancelBtn.classList.remove('btn--hidden');
  });

  cancelBtn.addEventListener('click', () => {
    loadProfile(); 

    editBtn.classList.remove('btn--hidden');
    saveBtn.classList.add('btn--hidden');
    cancelBtn.classList.add('btn--hidden');
  });

  saveBtn.addEventListener('click', async () => {
    const updatedData = {
      username: currentUser.username,
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      address: addressInput?.value.trim() || '',
      birthday: birthdayInput?.value.trim() || ''
    };

    try {
      const res = await fetch('http://localhost:3000/api/user/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Ошибка сохранения');
      }

      const profileRes = await fetch(`http://localhost:3000/api/user/me?username=${encodeURIComponent(currentUser.username)}`);
      if (!profileRes.ok) throw new Error('Не удалось обновить данные');

      const freshUser = await profileRes.json();

      localStorage.setItem('user', JSON.stringify(freshUser));
      currentUser = freshUser;

      loadProfile(freshUser);

      alert('Профиль успешно обновлён!');

      editBtn.classList.remove('btn--hidden');
      saveBtn.classList.add('btn--hidden');
      cancelBtn.classList.add('btn--hidden');

    } catch (err) {
      console.error(err);
      alert('Ошибка: ' + err.message);
    }
  });
});