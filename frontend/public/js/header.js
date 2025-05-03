// DOM Elements
const menuContainer = document.querySelector('.menu');
const menuModal = document.querySelector('.menu-modal');

const searchBtn = document.querySelector('.search-btn');
const searchNav = document.querySelector('.search-nav');
const searchBox = searchNav.querySelector('.search-box');
const searchSubmit = document.querySelector('.search-submit');
const searchInput = document.querySelector('.search-input');

const logoContainer = document.querySelector('.logo-container');
const orderDropdown = document.querySelector('.order-dropdown');

const mobileNav = document.querySelector('.browsing');
const goBackButton = document.querySelector('.go-back');
const subscribeForm = document.querySelector('.input');
const emailInput = document.querySelector('.input-field');

// Toggle Menu Modal with animation
menuContainer.addEventListener('click', (e) => {
    // Prevent toggling if clicking inside the modal itself
    if (e.target.closest('.menu-modal')) return;

    const isMenuOpen = menuModal.style.display === 'flex';
    menuContainer.classList.toggle('active');

    if (isMenuOpen) {
        menuModal.classList.remove('active');
        setTimeout(() => {
            menuModal.style.display = 'none';
        }, 300);
    } else {
        menuModal.style.display = 'flex';
        // Trigger reflow
        menuModal.offsetHeight;
        menuModal.classList.add('active');
    }
});

document.addEventListener('click', (e) => {
    // Hide menu if clicking outside
    if (!menuContainer.contains(e.target) && menuModal.style.display === 'flex') {
        menuContainer.classList.remove('active');
        menuModal.classList.remove('active');
        setTimeout(() => {
            menuModal.style.display = 'none';
        }, 300);
    }
    // Hide search if clicking outside
    if (!searchNav.contains(e.target)) {
        searchBox.style.display = 'none';
    }
    // Hide order dropdown if clicking outside
    if (!logoContainer.contains(e.target)) {
        orderDropdown.classList.remove('active');
    }
});

/**
 * BACKEND INTEGRATION GUIDE
 * 
 * Expected API Response Format:
 * {
 *     products: [{
 *         id: string,           // Unique product identifier
 *         name: string,         // Product name
 *         price: string,        // Price with currency (e.g., '2000 DA')
 *         delivery: string,     // Delivery information
 *         image: string         // Image URL or path
 *     }]
 * }
 * 
 * Example API endpoint: GET /api/cart/items
 */

// DUMMY DATA - Replace this with actual API call
let products = [
    {
        id: 'moctezuma-hoodie',
        name: "Moctezuma's hoodie",
        price: '2000 DA',
        delivery: '2-3 days',
        image: 'moctezuma-hoodie.jpg'
    },
    {
        id: 'air-jordan',
        name: "Air Jordan 1 Esports",
        price: '3500 DA',
        delivery: '3-5 days',
        image: 'air-jordan.jpg'
    },
    {
        id: 'tshirt-esports',
        name: "T-shirt Esports",
        price: '1500 DA',
        delivery: '1-2 days',
        image: 'tshirt-esports.jpg'
    }
];

/**
 * Updates the product list in the UI
 * TODO: Backend team - Update this to use real data from API
 */
function updateProductsList() {
    const orderItems = document.querySelector('.order-items');
    const productsHTML = products.map(product => `
        <div class="menu-link order-item" data-product="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="order-img">
            <div class="order-info">
                <div class="order-title">${product.name}</div>
                <div class="order-details">
                    <span>${product.price}</span> · <span>Delivery: ${product.delivery}</span>
                </div>
            </div>
            <button class="delete-btn" aria-label="Delete item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `).join('');

    // Add divider and check more button
    const additionalHTML = `
        ${products.length > 0 ? '<div class="menu-divider"></div>' : ''}
        <a href="#" class="menu-link check-more">
            <span>Check More</span>
        </a>
    `;

    orderItems.innerHTML = productsHTML + additionalHTML;
}

/**
 * Deletes a product from the cart
 * TODO: Backend team - Implement API call to delete item
 * Expected endpoint: DELETE /api/cart/items/:productId
 * 
 * @param {string} productId - The ID of the product to delete
 */
function deleteProduct(productId) {
    // TODO: Replace with actual API call
    // Example:
    // await fetch(`/api/cart/items/${productId}`, { method: 'DELETE' });
    
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products.splice(index, 1);
        const orderItem = document.querySelector(`.order-item[data-product="${productId}"]`);
        if (orderItem) {
            orderItem.style.transition = 'all 0.3s ease';
            orderItem.style.opacity = '0';
            orderItem.style.transform = 'translateX(10px)';
            
            setTimeout(() => {
                updateProductsList();
            }, 300);
        }
    }
}

// Toggle order dropdown on logo click and handle delete
logoContainer.addEventListener('click', (e) => {
    if (e.target.closest('.delete-btn')) {
        e.stopPropagation();
        const orderItem = e.target.closest('.order-item');
        if (orderItem) {
            const productId = orderItem.dataset.product;
            deleteProduct(productId);
        }
    } else {
        e.stopPropagation();
        orderDropdown.classList.toggle('active');
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
        if (menuModal.style.display === 'flex') {
            menuContainer.classList.remove('active');
            menuModal.classList.remove('active');
            setTimeout(() => {
                menuModal.style.display = 'none';
            }, 300);
        }
        searchBox.style.display = 'none';
    }
});


// Handle logout
// Add this to your header.js file
document.addEventListener('DOMContentLoaded', function() {
    const logoutLink = document.querySelector('a[href="/logout"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/logout';
            document.body.appendChild(form);
            form.submit();
        });
    }
});
