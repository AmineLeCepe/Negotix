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
            question.classList.toggle('active');
            
            // Update the toggle icon
            toggleIcon.textContent = question.classList.contains('active') ? '−' : '+';
            
            // Get the answer element
            const answer = faqItem.querySelector('.faq-answer');
            
            // Toggle the answer visibility with a smooth animation
            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.padding = '1.2rem';
            } else {
                answer.style.maxHeight = '0';
                answer.style.padding = '0 1.2rem';
            }
        });
    });

    // Handle mobile menu toggle
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            menuIcon.classList.toggle('active');
        });
    }
    
    // Add animation to sections on scroll
    const faqSections = document.querySelectorAll('.faq-section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    faqSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
    
    // Back to top button functionality
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Particle effect
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Create particle
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = `rgba(${Math.random() * 50 + 150}, ${Math.random() * 50 + 100}, ${Math.random() * 100 + 155}, ${Math.random() * 0.3 + 0.1})`;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Initialize particles
    function init() {
        particlesArray = [];
        const particleCount = Math.min(window.innerWidth / 10, 100); // Limit particles on larger screens
        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animate);
    }
    
    // Initialize
    window.addEventListener('resize', () => {
        resizeCanvas();
        init();
    });
    
    resizeCanvas();
    init();
    animate();
});