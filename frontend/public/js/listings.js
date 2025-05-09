function handleSort(event) {
    const sortValue = event.target.value;
    let sortedProducts = [...products];

    switch (sortValue) {
        case 'Sort: Oldest':
            // Add sorting logic for oldest
            break;
        case 'Sort: Price High to Low':
            sortedProducts.sort((a, b) => parseInt(b.price) - parseInt(a.price));
            break;
        case 'Sort: Price Low to High':
            sortedProducts.sort((a, b) => parseInt(a.price) - parseInt(b.price));
            break;
        default: // Newest
            // Default sorting (newest first)
            break;
    }

    renderProducts(sortedProducts);
}

// Enhanced click handlers with better event delegation
function handleCategorySelect(event) {
    const li = event.target.closest('li');
    if (!li) return;

    console.log('Category clicked');
    
    // Remove active class from all categories
    const categories = document.querySelectorAll('.categories li');
    categories.forEach(category => category.classList.remove('active'));
    
    // Add active class to clicked category
    li.classList.add('active');
    
    console.log('Selected category:', li.querySelector('span')?.textContent);
    
    filterProducts();
}

function handlePriceSelect(event) {
    const li = event.target.closest('li');
    if (!li) return;

    console.log('Price range clicked');
    
    // Remove active class from all price ranges
    const prices = document.querySelectorAll('.price-filter li');
    prices.forEach(price => price.classList.remove('active'));
    
    // Add active class to clicked price range
    li.classList.add('active');
    
    console.log('Selected price range:', li.querySelector('span:first-child')?.textContent);
    
    filterProducts();
}

function filterProducts() {
    console.log('Filter Products Called');
    const productCards = document.querySelectorAll('.product-card');
    const selectedCategoryEl = document.querySelector('.categories li.active span');
    const selectedPriceEl = document.querySelector('.price-filter li.active span:first-child');
    
    console.log('Number of product cards found:', productCards.length);
    console.log('Selected category element:', selectedCategoryEl);
    console.log('Selected price element:', selectedPriceEl);

    if (!selectedCategoryEl || !selectedPriceEl) {
        console.warn('Missing category or price elements');
        return;
    }

    const selectedCategory = selectedCategoryEl.textContent.toLowerCase();
    const selectedPriceRange = selectedPriceEl.textContent;

    console.log('Selected category:', selectedCategory);
    console.log('Selected price range:', selectedPriceRange);

    productCards.forEach(card => {
        // Get category from data attribute instead of class
        const cardCategory = card.getAttribute('data-category')?.toLowerCase() || '';
        const priceElement = card.querySelector('.price span');
        const price = priceElement ? parseInt(priceElement.textContent.replace('DA', '').trim()) : 0;
        
        console.log('Card category:', cardCategory);
        console.log('Card price:', price);

        let matchesCategory = selectedCategory === 'all' || cardCategory === selectedCategory;
        let matchesPrice = true;

        if (selectedPriceRange !== 'All') {
            if (selectedPriceRange === '0DA - 1000DA') {
                matchesPrice = price <= 1000;
            } else if (selectedPriceRange === '1000 DA - 9000DA') {
                matchesPrice = price > 1000 && price <= 9000;
            } else if (selectedPriceRange === '9000DA & Above') {
                matchesPrice = price > 9000;
            }
        }

        console.log('Matches category:', matchesCategory);
        console.log('Matches price:', matchesPrice);

        // Set display style
        if (matchesCategory && matchesPrice) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });

    updateProductCount();
    updatePriceRangeCounts();
}

// Function to handle pagination
function handlePagination(event) {
    if (event.target.tagName === 'BUTTON') {
        const buttons = document.querySelectorAll('.pagination button');
        buttons.forEach(button => button.classList.remove('active'));
        if (!event.target.classList.contains('next')) {
            event.target.classList.add('active');
        }
    }
}

// Update product count
function updateProductCount() {
    const visibleProducts = document.querySelectorAll('.product-card:not([style*="display: none"])');
    const countElement = document.querySelector('.item-count-number');
    if (countElement) {
        countElement.textContent = visibleProducts.length;
    }
}

// Update updatePriceRangeCounts to work with visible products only
function updatePriceRangeCounts() {
    const visibleProducts = document.querySelectorAll('.product-card:not([style*="display: none"])');
    const priceFilterItems = document.querySelectorAll('.price-filter li');
    
    const priceRangeCounts = {
        'All': visibleProducts.length,
        '0-1000': 0,
        '1000-9000': 0,
        '9000+': 0
    };
    
    visibleProducts.forEach(card => {
        const priceElement = card.querySelector('.price span');
        const price = priceElement ? parseInt(priceElement.textContent.replace('DA', '').trim()) : 0;
        
        if (price <= 1000) {
            priceRangeCounts['0-1000']++;
        } else if (price <= 9000) {
            priceRangeCounts['1000-9000']++;
        } else {
            priceRangeCounts['9000+']++;
        }
    });
    
    priceFilterItems.forEach(item => {
        const rangeText = item.querySelector('span:first-child')?.textContent;
        const countSpan = item.querySelector('.count');
        
        if (countSpan && rangeText) {
            if (rangeText === 'All') {
                countSpan.textContent = priceRangeCounts['All'];
            } else if (rangeText === '0DA - 1000DA') {
                countSpan.textContent = priceRangeCounts['0-1000'];
            } else if (rangeText === '1000 DA - 9000DA') {
                countSpan.textContent = priceRangeCounts['1000-9000'];
            } else if (rangeText === '9000DA & Above') {
                countSpan.textContent = priceRangeCounts['9000+'];
            }
        }
    });
}

// Update handlers to ensure proper initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Set initial active states
    const firstCategory = document.querySelector('.categories li');
    const firstPrice = document.querySelector('.price-filter li');
    
    if (firstCategory) firstCategory.classList.add('active');
    if (firstPrice) firstPrice.classList.add('active');
    
    // Get containers for event delegation
    const categoriesContainer = document.querySelector('.categories ul');
    const priceFilterContainer = document.querySelector('.price-filter ul');
    const sortDropdown = document.querySelector('.sort-dropdown select');
    const resetButton = document.querySelector('.reset-btn');
    const paginationContainer = document.querySelector('.pagination');
    const bidButtons = document.querySelectorAll('.bid-btn');
    
    // Add event listeners
    if (sortDropdown) {
        sortDropdown.addEventListener('change', handleSort);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Reset button clicked');
            
            // Reset all filters
            document.querySelectorAll('.categories li').forEach((li, index) => {
                if (index === 0) li.classList.add('active');
                else li.classList.remove('active');
            });
            
            document.querySelectorAll('.price-filter li').forEach((li, index) => {
                if (index === 0) li.classList.add('active');
                else li.classList.remove('active');
            });
            
            filterProducts();
        });
    }
    
    // Add event listeners to bid buttons in recently added section
    bidButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Bid button clicked');
            const itemTitle = button.closest('.item').querySelector('h3').textContent;
            showWishlistNotification(`Bid on ${itemTitle} clicked`);
        });
    });

    // Add event listeners
    if (categoriesContainer) {
        categoriesContainer.addEventListener('click', handleCategorySelect);
    }

    if (priceFilterContainer) {
        priceFilterContainer.addEventListener('click', handlePriceSelect);
    }

    // Initial filter
    filterProducts();
});

// Function to update timers
function formatTimer(milliseconds) {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

    return `${days}D ${hours}H ${minutes}M ${seconds}S`;
}

function updateTimers() {
    const timerElements = document.querySelectorAll('.timer');

    timerElements.forEach(timer => {
        // Get the milliseconds from data attribute, or from content if not yet set
        let milliseconds = timer.dataset.milliseconds
            ? parseInt(timer.dataset.milliseconds)
            : parseInt(timer.textContent);

        if (milliseconds <= 0) {
            timer.textContent = '0D 0H 0M 0S';
            return;
        }

        // Store the updated milliseconds in a data attribute
        milliseconds -= 1000;
        timer.dataset.milliseconds = milliseconds;

        // Display the formatted time
        timer.textContent = formatTimer(milliseconds);
    });
}



const urlParams = new URLSearchParams(window.location.search);
const success = urlParams.get('success');
const message = urlParams.get('message');
const auctionId = urlParams.get('auctionId');

const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modalMessage');


if (message) {
  modalMessage.textContent = decodeURIComponent(message);
  modal.style.display = 'flex';
  modal.style.opacity = '1';
  modal.style.zIndex = '999';
  window.history.replaceState(null, null, window.location.pathname);
  setTimeout(() => {
    modal.style.opacity = '0';
    modal.style.zIndex = '-1';
    setTimeout(() => {
      modal.style.display = 'none';
      if (success === 'true' && auctionId) {
        window.location.href = `/livechat/${auctionId}`;
      }
    }, 300); // give time for transition
  }, 3000);
}

const form = document.querySelector("form");
const priceInput = document.getElementById("bid-price");

form.addEventListener("submit", function (e) {
    if (!priceInput.value) {
        e.preventDefault(); // Stop form from submitting
        modalMessage.textContent = "Please enter a bid amount.";
        modal.style.opacity = '1';
        modal.style.zIndex = '999';
        setTimeout(() => {
            modal.style.opacity = '0';
            modal.style.zIndex = '-1';
        }, 3000);
    }
});

// Start the timer update interval
setInterval(updateTimers, 1000);

// Initial call to format timers immediately
updateTimers();
// Wishlist button UI functionality only
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle wishlist state
            const isCurrentlyInWishlist = this.classList.contains('in-wishlist');
            this.classList.toggle('in-wishlist');
            
            // Show notification
            const message = isCurrentlyInWishlist ? 'Removed from wishlist' : 'Added to wishlist';
            showWishlistNotification(message);
            
            // Note: This is where you'd normally send a request to your server
            console.log('Wishlist toggled for product:', this.getAttribute('data-product-id'));
        });
    });
    
    function showWishlistNotification(message) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modalMessage');
        
        if (modal && modalMessage) {
            modalMessage.textContent = message;
            modal.style.opacity = '1';
            modal.style.zIndex = '999';
            setTimeout(() => {
                modal.style.opacity = '0';
                modal.style.zIndex = '-1';
            }, 1500);
        }
    }
});