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

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showToast('Please enter your username and password.', 'error');
      return;
    }

    try {
      // ✨ เรียกยิง API ตรงเข้า Backend ของเพื่อนตาม Path ที่ถูกต้อง
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();

      // เช็กผลตอบกลับจาก Backend (Response status/success)
      if (response.ok && data.success) {
        showToast(`Welcome ${data.name || username}! Redirecting...`, 'success');
        // บันทึก Session/Profile เก็บไว้ใช้ในหน้า Search
        localStorage.setItem('userProfile', JSON.stringify(data));

        // พาย้ายหน้าไป search.html
        setTimeout(() => {
          window.location.href = 'search.html';
        }, 1500);

      } else {
        // กรณีล็อกอินไม่ผ่าน หรือกรอกรหัสผิด
        showToast(data.message || 'Invalid username or password.', 'error');
      }

    } catch (error) {
      console.error('Login error:', error);
      showToast('Cannot connect to Backend Server. Please make sure Backend is running.', 'error');
    }
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