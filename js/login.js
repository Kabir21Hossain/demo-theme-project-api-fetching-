// login.js — Handles login page logic

const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin123';

// Redirect if already logged in
if (localStorage.getItem('isLoggedIn') === 'true') {
  window.location.href = 'dashboard.html';
}

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const loginBtnText = document.getElementById('loginBtnText');
const loginSpinner = document.getElementById('loginSpinner');
const loginError = document.getElementById('loginError');
const fillDemoBtn = document.getElementById('fillDemoBtn');
const togglePasswordBtn = document.getElementById('togglePassword');
const eyeOpen = document.getElementById('eyeOpen');
const eyeClosed = document.getElementById('eyeClosed');

// Fill demo credentials
fillDemoBtn.addEventListener('click', () => {
  usernameInput.value = DEMO_USERNAME;
  passwordInput.value = DEMO_PASSWORD;
  loginError.classList.add('hidden');
  usernameInput.classList.remove('input-error');
  passwordInput.classList.remove('input-error');
});

// Toggle password visibility
togglePasswordBtn.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  eyeOpen.classList.toggle('hidden', isPassword);
  eyeClosed.classList.toggle('hidden', !isPassword);
});

// Handle login
function handleLogin() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    loginError.classList.remove('hidden');
    loginError.querySelector('span').textContent = 'Please enter both username and password.';
    return;
  }

  // Show loading
  loginBtnText.textContent = 'Signing in...';
  loginSpinner.classList.remove('hidden');
  loginBtn.disabled = true;

  setTimeout(() => {
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      window.location.href = 'dashboard.html';
    } else {
      loginError.classList.remove('hidden');
      loginError.querySelector('span').textContent = 'Invalid username or password. Please try again.';
      loginBtnText.textContent = 'Sign In';
      loginSpinner.classList.add('hidden');
      loginBtn.disabled = false;
      usernameInput.classList.add('input-error');
      passwordInput.classList.add('input-error');   
    }
  }, 700);
}

loginBtn.addEventListener('click', handleLogin);

// Enter key support
[usernameInput, passwordInput].forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
  input.addEventListener('input', () => {
    loginError.classList.add('hidden');
    input.classList.remove('input-error');
  });
});
