document.querySelector('.explore-btn').addEventListener('click', () => {
    // Add a scale up animation to the success card
    const successCard = document.querySelector('.success-card');
    successCard.style.transition = 'transform 0.5s ease-out';
    successCard.style.transform = 'scale(1.05)';

    // Add fade out animation to the characters
    const characters = document.querySelectorAll('.success-girl, .success-guy');
    characters.forEach(char => {
        char.style.transition = 'opacity 0.5s ease-out';
        char.style.opacity = '0';
    });

    // Redirect to listing page after animations
    setTimeout(() => {
        window.location.href = 'listing.html';  // Change this to your actual listing page URL
    }, 600);
});
