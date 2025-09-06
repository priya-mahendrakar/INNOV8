// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const msg = document.getElementById('loginMessage');
  
    if (!email || !password) {
      msg.textContent = 'Fill all fields';
      return;
    }
  
    try {
      let res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      let data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);
        window.location.href = 'index.html';
      } else {
        msg.textContent = data.message;
      }
    } catch {
      msg.textContent = 'Server error';
    }
  });
  
  // Register
  document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();
    const msg = document.getElementById('registerMessage');
  
    if (!email || !password) {
      msg.textContent = 'Fill all required fields';
      return;
    }
  
    try {
      let res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });
      let data = await res.json();
      if (res.ok) {
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
      } else {
        msg.textContent = data.message;
      }
    } catch {
      msg.textContent = 'Server error';
    }
  });
  