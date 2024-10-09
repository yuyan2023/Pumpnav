function checkLogin() {
  var username = document.getElementById('username').value.trim();
  var password = document.getElementById('password').value.trim();
  var loginStatusMessage = document.getElementById('login-status');

  if (!username || !password) {
      loginStatusMessage.textContent = 'Please enter both username and password.';
      loginStatusMessage.style.color = 'red';
      return false;
  }

  // For demonstration, using fixed username and password
  if (username === 'admin' && password === 'admin') {
      loginStatusMessage.textContent = 'Login successful!';
      loginStatusMessage.style.color = 'green';
      // Redirect to another page or update the UI as necessary
  } else {
      loginStatusMessage.textContent = 'Invalid username or password.';
      loginStatusMessage.style.color = 'red';
  }
  
  return false; // Prevent form from submitting for demo purposes
}
