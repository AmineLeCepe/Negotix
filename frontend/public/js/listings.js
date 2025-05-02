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

// Function to handle category selection
function handleCategorySelect(event) {
    if (event.target.tagName === 'LI') {
        const categories = document.querySelectorAll('.categories li');
        categories.forEach(category => category.classList.remove('active'));
        event.target.classList.add('active');
    }
}

// Function to handle price filter selection
function handlePriceSelect(event) {
    if (event.target.tagName === 'LI') {
        const prices = document.querySelectorAll('.price-filter li');
        prices.forEach(price => price.classList.remove('active'));
        event.target.classList.add('active');
    }
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

// Function to count and update product cards
function updateProductCount() {
    const productCards = document.querySelectorAll('.product-card');
    const countElement = document.querySelector('.item-count-number');
    if (countElement) {
        countElement.textContent = productCards.length;
    }
}


// Function to update price range counts
function updatePriceRangeCounts() {
    const productCards = document.querySelectorAll('.product-card');
    const priceFilterItems = document.querySelectorAll('.price-filter li');
    
    // Initialize counters for each price range
    const priceRangeCounts = {
        'All': productCards.length,
        '0-1000': 0,
        '1000-9000': 0,
        '9000+': 0
    };
    
    // Count products in each price range
    productCards.forEach(card => {
        const priceElement = card.querySelector('.price span');
        if (priceElement) {
            // Extract numeric price value (remove 'DA' and parse)
            const price = parseInt(priceElement.textContent.replace('DA', '').trim());
            
            if (price <= 1000) {
                priceRangeCounts['0-1000']++;
            } else if (price <= 9000) {
                priceRangeCounts['1000-9000']++;
            } else {
                priceRangeCounts['9000+']++;
            }
        }
    });
    
    // Update the count display for each price range
    priceFilterItems.forEach(item => {
        const rangeText = item.querySelector('span:first-child').textContent;
        const countSpan = item.querySelector('.count');
        
        if (countSpan) {
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

// Update the DOMContentLoaded event listener to include all count updates
document.addEventListener('DOMContentLoaded', () => {
    // Update all counts
    updateProductCount();
    updatePriceRangeCounts();

    // Add event listeners
    document.querySelector('.sort-dropdown select').addEventListener('change', handleSort);
    document.querySelector('.categories').addEventListener('click', handleCategorySelect);
    document.querySelector('.price-filter').addEventListener('click', handlePriceSelect);
    document.querySelector('.pagination').addEventListener('click', handlePagination);

    // Add click event listeners to all bid buttons
    document.querySelectorAll('.place-bid').forEach(button => {
        button.addEventListener('click', () => {
            // Add your bid logic here
            alert('Bid placed successfully!');
        });
    });

    // Add click event listeners to recently added bid buttons
    document.querySelectorAll('.bid-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Add your bid logic here
            alert('Bid placed successfully!');
        });
    });
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

// Start the timer update interval
setInterval(updateTimers, 1000);

// Initial call to format timers immediately
updateTimers();