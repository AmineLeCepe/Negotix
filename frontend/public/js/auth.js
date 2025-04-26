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
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Validation logic
    let errorMessageText = '';
    if (!username || !password) {
        e.preventDefault();
        errorMessageText = 'Please fill in all fields.';
    } else if (username.length < 5) {
        e.preventDefault();
        errorMessageText = 'Username must be at least 5 characters long.';
    } else if (password.length < 8) {
        e.preventDefault();
        errorMessageText = 'Password must be at least 8 characters long.';
    }

    if (errorMessageText) {
        // Show error message
        let errorMessage = document.querySelector('#sign-in-form .error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message');
            errorMessage.style.color = 'red';
            errorMessage.style.textAlign = 'center';
            errorMessage.style.marginTop = '10px';
            const title = document.querySelector('#sign-in-form .title');
            title.insertAdjacentElement('afterend', errorMessage);
        }
        errorMessage.textContent = errorMessageText;
    }
});

// Handle sign-up form submission
document.getElementById('sign-up-form').addEventListener('submit', function (e) {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Validation logic
    let errorMessageText = '';
    if (!username || !email || !password) {
        e.preventDefault();
        errorMessageText = 'Please fill in all fields.';
    } else if (username.length < 5) {
        e.preventDefault();
        errorMessageText = 'Username must be at least 5 characters long.';
    } else if (password.length < 8) {
        e.preventDefault();
        errorMessageText = 'Password must be at least 8 characters long.';
    }

    if (errorMessageText) {
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
});