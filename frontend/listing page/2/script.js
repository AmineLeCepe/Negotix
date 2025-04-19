// Sample product data
const products = [
    {
        id: 1,
        name: "XXXXXXXX",
        price: "2400 DA",
        image: "assets/shirt.webp",
        timeLeft: "4m 5s"
    },
    {
        id: 2,
        name: "XXXXXXXX",
        price: "2400 DA",
        image: "assets/shirt.webp",
        timeLeft: "21m 7s"
    },
    {
        id: 3,
        name: "XXXXXXXX",
        price: "2400 DA",
        image: "assets/shirt.webp",
        timeLeft: "30m 10s"
    },
    {
        id: 4,
        name: "XXXXXXXX",
        price: "2400 DA",
        image: "assets/shirt.webp",
        timeLeft: "41m 1s"
    },
    {
        id: 5,
        name: "XXXXXXXX",
        price: "2400 DA",
        image: "assets/shirt.webp",
        timeLeft: "20m 3s"
    },
    {
        id: 6,
        name: "XXXXXXXX",
        price: "2400 DA",
        image: "assets/shirt.webp",
        timeLeft: "11m 8s"
    },
    {
        id: 7,
        name: "XXXXXXXX",
        price: "2400 DA",
        image: "assets/shirt.webp",
        timeLeft: "15m 5s"
    },
    {
        id: 8,
        name: "XXXXXXXX",
        price: "2400 DA",
        image: "assets/shirt.webp",
        timeLeft: "30m 8s"
    },
    {
        id: 9,
        name: "XXXXXXXX",
        price: "2400 DA",
        image: "assets/shirt.webp",
        timeLeft: "30m 8s"
    }
];

// Function to create a product card
function createProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price">
                    <img src="assets/wish_list.webp" alt="Wishlist" style="width: 20px; height: 20px;">
                    <span>${product.price}</span>
                </div>
                <div class="timer">${product.timeLeft}</div>
                <button class="place-bid">Place Bid</button>
            </div>
        </div>
    `;
}

// Function to render products
function renderProducts(productsToRender = products) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = productsToRender.map(product => createProductCard(product)).join('');
}

// Function to handle sorting
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

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Render initial products
    renderProducts();

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
function updateTimers() {
    const timerElements = document.querySelectorAll('.timer');
    timerElements.forEach(timer => {
        let [minutes, seconds] = timer.textContent.split('m ');
        seconds = parseInt(seconds);
        minutes = parseInt(minutes);

        if (seconds > 0) {
            seconds--;
        } else if (minutes > 0) {
            minutes--;
            seconds = 59;
        }

        timer.textContent = `${minutes}m ${seconds}s`;
    });
}

// Update timers every second
setInterval(updateTimers, 1000); 