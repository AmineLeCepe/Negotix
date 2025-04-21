document.addEventListener('DOMContentLoaded', () => {
    // Get all FAQ question elements
    const faqQuestions = document.querySelectorAll('.faq-question');

    // Add click event listener to each question
    faqQuestions.forEach(question => {
        const toggleIcon = question.querySelector('.toggle-icon');
        // Set initial plus sign
        toggleIcon.textContent = '+';
        
        question.addEventListener('click', () => {
            // Get the parent FAQ item
            const faqItem = question.parentElement;
            
            // Toggle the active class on the FAQ item
            faqItem.classList.toggle('active');
            
            // Update the toggle icon
            toggleIcon.textContent = faqItem.classList.contains('active') ? '−' : '+';
            
            // Get the answer element
            const answer = faqItem.querySelector('.faq-answer');
            
            // Toggle the answer visibility with a smooth animation
            if (faqItem.classList.contains('active')) {
                answer.style.display = 'block';
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
                setTimeout(() => {
                    answer.style.display = 'none';
                }, 200);
            }
        });
    });

    // Handle mobile menu toggle
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');
    
    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        menuIcon.classList.toggle('active');
    });
}); 