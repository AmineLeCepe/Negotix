
    
    // Follow/Unfollow Functionality
    const followBtn = document.querySelector('.follow-btn');
    const followersCountElement = document.querySelector('.profile-stats .stat:first-child span');
    let followersCount = parseInt(followersCountElement.textContent);
    let isFollowing = false;
    
    followBtn.addEventListener('click', () => {
        if (!isFollowing) {
            // Follow action
            followersCount++;
            followersCountElement.textContent = followersCount;
            followBtn.innerHTML = '<i class="fas fa-user-minus"></i> Unfollow';
            followBtn.classList.add('following');
            isFollowing = true;
        } else {
            // Unfollow action
            followersCount--;
            followersCountElement.textContent = followersCount;
            followBtn.innerHTML = '<i class="fas fa-user-plus"></i> Follow';
            followBtn.classList.remove('following');
            isFollowing = false;
        }
    });
    
    // Product Navigation
    const productCards = document.querySelectorAll('.product-card');
    const totalProducts = productCards.length;
    let currentProductIndex = 0;

    function updateProducts(newIndex) {
        const previousIndex = currentProductIndex;
        currentProductIndex = newIndex;

        productCards.forEach((card, index) => {
            card.classList.remove('active', 'previous');
            if (index === currentProductIndex) {
                card.classList.add('active');
            } else if (index === previousIndex) {
                card.classList.add('previous');
            }
        });
    }

    document.querySelectorAll('.nav-btn.prev').forEach(btn => {
        btn.addEventListener('click', () => {
            const newIndex = (currentProductIndex - 1 + totalProducts) % totalProducts;
            updateProducts(newIndex);
        });
    });

    document.querySelectorAll('.nav-btn.next').forEach(btn => {
        btn.addEventListener('click', () => {
            const newIndex = (currentProductIndex + 1) % totalProducts;
            updateProducts(newIndex);
        });
    });
    // Stats Animation
    const stats = document.querySelectorAll('.stat-card .number');
    stats.forEach(stat => {
        const value = stat.textContent;
        stat.textContent = '0';
        
        setTimeout(() => {
            animateValue(stat, 0, parseInt(value), 1500);
        }, 500);
    });

    function animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = end + (element.textContent.includes('%') ? '%' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '');
            }
        }, 16);
    }

    // Form Submission
    const subscribeForm = document.querySelector('.subscribe-form');
    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = subscribeForm.querySelector('input').value;
        if (email) {
            alert('Thank you for subscribing!');
            subscribeForm.reset();
        }
    });

