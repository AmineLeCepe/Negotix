document.querySelector('.try-again-btn').addEventListener('click', () => {
    // Add a quick animation effect when clicking
    document.querySelector('.error-card').style.animation = 'shake 0.5s ease-in-out';
    
    // Reload the page after a short delay
    setTimeout(() => {
        window.location.reload();
    }, 500);
});

// Add the shake animation
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}`;
document.head.appendChild(style);
