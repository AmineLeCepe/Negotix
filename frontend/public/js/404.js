// DOM Elements
const menuContainer = document.querySelector('.menu');
const menuModal = menuContainer.querySelector('.menu-modal');

const searchBtn = document.querySelector('.search-btn');
const searchNav = document.querySelector('.search-nav');
const searchBox = searchNav.querySelector('.search-box');
const searchSubmit = document.querySelector('.search-submit');
const searchInput = document.querySelector('.search-input');

const mobileNav = document.querySelector('.browsing');
const goBackButton = document.querySelector('.go-back');
const subscribeForm = document.querySelector('.input');
const emailInput = document.querySelector('.input-field');

// Toggle Menu Modal below Menu area (text or bars)
menuContainer.addEventListener('click', (e) => {
    // Prevent toggling if clicking inside the modal itself
    if (e.target.closest('.menu-modal')) return;
    if (menuModal.style.display === 'flex') {
        menuModal.style.display = 'none';
    } else {
        menuModal.style.display = 'flex';
    }
});

document.addEventListener('click', (e) => {
    // Hide menu if clicking outside
    if (!menuContainer.contains(e.target)) {
        menuModal.style.display = 'none';
    }
    // Hide search if clicking outside
    if (!searchNav.contains(e.target)) {
        searchBox.style.display = 'none';
    }
});

// Toggle Search Box below Search text
searchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (searchBox.style.display === 'flex') {
        searchBox.style.display = 'none';
    } else {
        searchBox.style.display = 'flex';
        searchInput.focus();
    }
});

// Search Submit
searchSubmit.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        alert('You searched for: ' + query);
        // Replace with real search logic if needed
    }
});

// Close overlays on Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchBox.style.display = 'none';
        menuModal.style.display = 'none';
    }
});

// Go Back Button
goBackButton.addEventListener('click', () => {
    window.history.back();
});

// Subscribe Form
subscribeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    
    if (email && isValidEmail(email)) {
        alert('Thank you for subscribing!');
        emailInput.value = '';
    } else {
        alert('Please enter a valid email address');
    }
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
