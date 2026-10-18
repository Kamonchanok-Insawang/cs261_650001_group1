document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const eyeIcon = document.getElementById('eyeIcon');
  const loginForm = document.getElementById('loginForm');
  const forgotBtn = document.getElementById('forgotBtn');
  const toast = document.getElementById('toast');

  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    if (isPassword) {
      passwordInput.setAttribute('type', 'text');
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    } else {
      passwordInput.setAttribute('type', 'password');
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    }
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showToast('Please enter your username and password.', 'error');
      return;
    }

    showToast(`Welcome ${username}!`, 'success');
  });

  forgotBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('We will send a password reset link to your email address.', 'info');
  });

  function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
});