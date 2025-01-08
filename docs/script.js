// Mobile menu functionality
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle navigation
    nav.classList.toggle('nav-active');

    // Animate links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });

    // Burger animation
    burger.classList.toggle('toggle');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // Close mobile menu if open
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');

            // Smooth scroll to target
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll event listener for navbar background
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.backgroundColor = 'var(--white)';
    }
});

// Optional: Add animation for elements when they come into view
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('hidden');
    observer.observe(section);
});

// Code snippet functionality
function toggleCode(id) {
    const codeContent = document.getElementById(id);
    const header = codeContent.previousElementSibling;
    const expandIcon = header.querySelector('.expand-icon');
    
    if (codeContent.classList.contains('expanded')) {
        codeContent.classList.remove('expanded');
        expandIcon.style.transform = 'rotate(0deg)';
    } else {
        codeContent.classList.add('expanded');
        expandIcon.style.transform = 'rotate(180deg)';
        // Highlight code when expanded
        Prism.highlightElement(codeContent.querySelector('code'));
    }
}

function copyCode(id, event) {
    event.stopPropagation(); // Prevent triggering toggleCode
    const codeBlock = document.getElementById(id);
    const code = codeBlock.querySelector('code').innerText;
    
    // Create a temporary textarea element to copy the text
    const textarea = document.createElement('textarea');
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        // Show feedback
        const copyBtn = event.currentTarget;
        const icon = copyBtn.querySelector('i');
        icon.classList.remove('fa-copy');
        icon.classList.add('fa-check');
        setTimeout(() => {
            icon.classList.remove('fa-check');
            icon.classList.add('fa-copy');
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
    
    document.body.removeChild(textarea);
}

// Initialize Prism.js for all code blocks on page load
document.addEventListener('DOMContentLoaded', () => {
    Prism.highlightAll();
});
