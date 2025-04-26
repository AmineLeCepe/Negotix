// Remove form submission handling
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Forgot Password Modal
const forgotPasswordLink = document.querySelector('.forgot-password a');
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const closeModal = document.querySelector('.close');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const emailSentMessage = document.getElementById('email-sent-message');

// Open the modal when "Forgot Password" is clicked
forgotPasswordLink.addEventListener('click', (e) => {
  e.preventDefault();
  forgotPasswordModal.style.display = 'flex';
});

// Close the modal when the close button is clicked
closeModal.addEventListener('click', () => {
  forgotPasswordModal.style.display = 'none';
});

// Close the modal when clicking outside the modal
window.addEventListener('click', (e) => {
  if (e.target === forgotPasswordModal) {
    forgotPasswordModal.style.display = 'none';
  }
});

// Handle form submission
forgotPasswordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('forgot-email').value;

  // Simulate sending a code (replace with actual logic)
  setTimeout(() => {
    emailSentMessage.textContent = `A code has been sent to ${email}.`;
    emailSentMessage.style.display = 'block';
  }, 1000);
});

// Handle sign-in form submission
document.getElementById('sign-in-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  // Validation logic
  let errorMessageText = '';
  if (!username || !password) {
    errorMessageText = 'Please fill in all fields.';
  } else if (username.length < 5) {
    errorMessageText = 'Username must be at least 5 characters long.';
  } else if (password.length < 8) {
    errorMessageText = 'Password must be at least 8 characters long.';
  }

  const isValid = !errorMessageText;

  if (!isValid) {
    // Your existing error handling code
  } else {
    // If validation passes, submit the form data
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('formType', 'login');  // Add this to match your server's expectations

    fetch('/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the server
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
});

// Handle sign-up form submission
document.getElementById('sign-up-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  // Validation logic
  let errorMessageText = '';
  if (!username || !email || !password) {
    errorMessageText = 'Please fill in all fields.';
  } else if (username.length < 5) {
    errorMessageText = 'Username must be at least 5 characters long.';
  } else if (password.length < 8) {
    errorMessageText = 'Password must be at least 8 characters long.';
  }

  const isValid = !errorMessageText;

  if (!isValid) {
    // Shake the form
    const form = document.getElementById('sign-up-form');
    form.classList.add('shake');

    // Remove the shake animation after it completes
    setTimeout(() => {
      form.classList.remove('shake');
    }, 500);

    // Check if the error message already exists
    let errorMessage = document.querySelector('#sign-up-form .error-message');

    if (!errorMessage) {
      // Create and display the error message if it doesn't exist
      errorMessage = document.createElement('p');
      errorMessage.textContent = errorMessageText;
      errorMessage.style.color = 'red';
      errorMessage.style.textAlign = 'center';
      errorMessage.style.marginTop = '10px';
      errorMessage.classList.add('error-message');

      // Insert the error message after the sign-up title
      const title = document.querySelector('#sign-up-form .title');
      title.insertAdjacentElement('afterend', errorMessage);
    } else {
      // Update the existing error message
      errorMessage.textContent = errorMessageText;
    }
  }
  // In the sign-up form handler, add this in the else block when isValid is true
  else {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('formType', 'register');

    fetch('/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
});