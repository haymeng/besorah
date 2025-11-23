// ===================================
// BESORAH YESHUA MINISTRY - MAIN JAVASCRIPT
// ===================================

'use strict';

// ===================================
// MOBILE NAVIGATION
// ===================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    // Toggle menu
    hamburger.addEventListener('click', () => {
        const isActive = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Update ARIA attribute for accessibility
        hamburger.setAttribute('aria-expanded', isActive);
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
let lastScroll = 0;
const header = document.querySelector('header');

if (header) {
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ===================================
// ACTIVE NAVIGATION
// ===================================
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        link.classList.remove('active');
        
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

// ===================================
// SMOOTH SCROLLING
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for just "#" links
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// EVENTS PAGE - FILTERING
// ===================================
const filterButtons = document.querySelectorAll('.filter-btn');
const eventCards = document.querySelectorAll('.event-card');

if (filterButtons.length > 0 && eventCards.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Filter events with animation
            eventCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.setAttribute('aria-hidden', 'false');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.setAttribute('aria-hidden', 'true');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===================================
// DONATION PAGE - AMOUNT SELECTION
// ===================================
const amountButtons = document.querySelectorAll('.amount-btn');
const customAmountInput = document.querySelector('.custom-amount-input');
const customAmountField = document.getElementById('customAmount');
const displayAmount = document.getElementById('displayAmount');

if (amountButtons.length > 0) {
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            const amount = this.getAttribute('data-amount');
            
            // Remove active class from all buttons
            amountButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Handle custom amount
            if (amount === 'custom') {
                if (customAmountInput) {
                    customAmountInput.style.display = 'block';
                    if (customAmountField) {
                        customAmountField.focus();
                        // Update display with custom amount value
                        updateDisplayAmount(customAmountField.value || 100);
                    }
                }
            } else {
                if (customAmountInput) {
                    customAmountInput.style.display = 'none';
                }
                // Update display amount
                updateDisplayAmount(amount);
            }
        });
    });
    
    // Handle custom amount input
    if (customAmountField) {
        customAmountField.addEventListener('input', function() {
            const value = parseFloat(this.value) || 0;
            amountButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            const customBtn = document.querySelector('[data-amount="custom"]');
            if (customBtn && value > 0) {
                customBtn.classList.add('active');
                customBtn.setAttribute('aria-pressed', 'true');
                updateDisplayAmount(value);
            }
        });
    }
}

// Update display amount helper function
function updateDisplayAmount(amount) {
    if (displayAmount) {
        const numAmount = parseFloat(amount) || 0;
        displayAmount.textContent = formatCurrency(numAmount);
    }
}

// Frequency buttons
const frequencyButtons = document.querySelectorAll('.frequency-btn');
if (frequencyButtons.length > 0) {
    frequencyButtons.forEach(button => {
        button.addEventListener('click', function() {
            frequencyButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
        });
    });
}

// Payment method buttons
const paymentButtons = document.querySelectorAll('.payment-btn');
const paymentSections = document.querySelectorAll('.payment-section');

if (paymentButtons.length > 0) {
    paymentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            
            // Update active button
            paymentButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Show corresponding payment section
            paymentSections.forEach(section => {
                section.style.display = 'none';
                section.setAttribute('aria-hidden', 'true');
            });
            
            const targetSection = document.querySelector(`.${method}-section`);
            if (targetSection) {
                targetSection.style.display = 'block';
                targetSection.setAttribute('aria-hidden', 'false');
            }
        });
    });
}

// ===================================
// CONTACT FORM HANDLING (NETLIFY FORMS)
// ===================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Form will be handled by Netlify, but we can add client-side validation
    contactForm.addEventListener('submit', function(e) {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        let isValid = true;
        let errorMessage = '';
        
        // Validate name
        if (name && !name.value.trim()) {
            isValid = false;
            errorMessage = 'Please enter your name.';
            name.focus();
        }
        
        // Validate email
        if (email && !email.value.trim()) {
            isValid = false;
            errorMessage = 'Please enter your email address.';
            email.focus();
        } else if (email && !isValidEmail(email.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
            email.focus();
        }
        
        // Validate message
        if (message && !message.value.trim()) {
            isValid = false;
            errorMessage = 'Please enter a message.';
            message.focus();
        }
        
        if (!isValid) {
            e.preventDefault();
            showFormMessage('error', errorMessage);
            return false;
        }
        
        // Show sending message
        showFormMessage('info', 'Sending your message...');
        
        // Netlify will handle the actual submission and redirect to thank-you.html
    });
}

function showFormMessage(type, message) {
    const formFeedback = document.getElementById('formFeedback');
    const feedbackMessage = document.getElementById('feedbackMessage');
    
    if (formFeedback && feedbackMessage) {
        feedbackMessage.textContent = message;
        formFeedback.className = 'form-message ' + type;
        formFeedback.style.display = 'flex';
        
        // Auto hide after 5 seconds (except for 'info' type)
        if (type !== 'info') {
            setTimeout(() => {
                formFeedback.style.display = 'none';
            }, 5000);
        }
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function animateOnScroll() {
    const elements = document.querySelectorAll('.mission-card, .event-card, .partnership-card, .benefit-card, .impact-example, .testimonial-card');
    
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ===================================
// CRITICAL FIXES FOR MAIN.JS
// Replace lines 297-365 with this corrected version
// ===================================

// ===================================
// PRAYER REQUEST MODAL - CORRECTED
// ===================================
function openModal(type) {
    const modal = document.getElementById('prayerModal');
    const prayerTypeInput = document.getElementById('prayerType');
    if (modal && prayerTypeInput) {
        prayerTypeInput.value = type;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('prayerModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset form
        const prayerForm = document.getElementById('prayerForm');
        if (prayerForm) {
            prayerForm.reset();
        }
    }
}

// Initialize prayer modal if it exists
const prayerModal = document.getElementById('prayerModal');
if (prayerModal) {
    // Close modal when clicking outside
    prayerModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && prayerModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Handle form submission - VALIDATION ONLY
    const prayerForm = document.getElementById('prayerForm');
    if (prayerForm) {
        prayerForm.addEventListener('submit', function(e) {
            // Only validate - don't prevent default unless validation fails
            // This allows Netlify to handle the submission naturally
            
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const category = document.getElementById('category');
            const request = document.getElementById('request');
            
            let isValid = true;
            let errorMessage = '';
            
            // Validate name
            if (name && !name.value.trim()) {
                isValid = false;
                errorMessage = 'Please enter your name.';
                name.focus();
            }
            // Validate email
            else if (email && !email.value.trim()) {
                isValid = false;
                errorMessage = 'Please enter your email address.';
                email.focus();
            } else if (email && !isValidEmail(email.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
                email.focus();
            }
            // Validate category
            else if (category && !category.value) {
                isValid = false;
                errorMessage = 'Please select a category.';
                category.focus();
            }
            // Validate request
            else if (request && !request.value.trim()) {
                isValid = false;
                errorMessage = 'Please enter your prayer request.';
                request.focus();
            }
            
            // Only prevent submission if validation fails
            if (!isValid) {
                e.preventDefault();
                alert(errorMessage);
                return false;
            }
            
            // If valid, let form submit naturally to Netlify
            // Form will redirect to action URL (prayer-thank-you.html)
        });
    }
}

// Make functions globally available
window.openModal = openModal;
window.closeModal = closeModal;

// ===================================
// PARSE URL PARAMETERS
// ===================================
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Pre-fill form fields from URL parameters
function prefillFormFromURL() {
    const eventParam = getURLParameter('event');
    const typeParam = getURLParameter('type');
    const subjectParam = getURLParameter('subject');
    
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');
    
    if (subjectField && subjectField.tagName === 'SELECT') {
        if (eventParam) {
            subjectField.value = 'events';
            if (messageField && !messageField.value) {
                messageField.value = `I would like to register for the ${eventParam.replace(/-/g, ' ')} event.\n\n`;
            }
        } else if (typeParam) {
            subjectField.value = 'partnership';
            if (messageField && !messageField.value) {
                messageField.value = `I am interested in ${typeParam.replace(/-/g, ' ')}.\n\n`;
            }
        } else if (subjectParam) {
            subjectField.value = subjectParam;
        }
    } else if (subjectField && subjectField.tagName === 'INPUT') {
        if (eventParam) {
            subjectField.value = `Event Registration: ${eventParam.replace(/-/g, ' ')}`;
        } else if (typeParam) {
            subjectField.value = `Partnership Inquiry: ${typeParam.replace(/-/g, ' ')}`;
        }
    }
}

// ===================================
// DYNAMIC COPYRIGHT YEAR
// ===================================
function updateCopyrightYear() {
    const yearElements = document.querySelectorAll('.footer-bottom p');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        if (element.textContent.includes('©')) {
            element.textContent = element.textContent.replace(/© \d{4}/, `© ${currentYear}`);
        }
    });
}

// ===================================
// SCROLL TO TOP BUTTON
// ===================================
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// INITIALIZE ON DOM LOAD
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation
    setActiveNavigation();
    
    // Animate elements on scroll
    animateOnScroll();
    
    // Pre-fill form from URL parameters
    prefillFormFromURL();
    
    // Update copyright year
    updateCopyrightYear();
    
    // Add loading class removal
    document.body.classList.add('loaded');
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// ACCESSIBILITY IMPROVEMENTS
// ===================================

// Skip to main content
const skipLink = document.querySelector('.skip-to-content');
if (skipLink) {
    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const main = document.querySelector('main') || document.querySelector('.hero');
        if (main) {
            main.setAttribute('tabindex', '-1');
            main.focus();
        }
    });
}

// Announce page changes for screen readers
function announcePageChange(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ===================================
// ERROR HANDLING
// ===================================

// Global error handler
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // You can add error tracking here (e.g., send to analytics)
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===================================
// EXPORT FOR MODULE SYSTEMS (Optional)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setActiveNavigation,
        formatCurrency,
        debounce,
        throttle,
        isValidEmail
    };
}



// Add to main.js
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errors = [];
    }
    
    validate() {
        this.errors = [];
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.addError(field, `${field.labels[0]?.textContent || 'This field'} is required`);
            }
        });
        
        return this.errors.length === 0;
    }
    
    addError(field, message) {
        this.errors.push({ field, message });
        this.showFieldError(field, message);
    }
    
    showFieldError(field, message) {
        // Remove existing error
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        // Add new error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error text-red-600 text-sm mt-1';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);
        field.classList.add('border-red-500');
    }
    
    clearErrors() {
        this.form.querySelectorAll('.field-error').forEach(el => el.remove());
        this.form.querySelectorAll('.border-red-500').forEach(el => {
            el.classList.remove('border-red-500');
        });
    }
}


// Add to main.js
class ErrorTracker {
    constructor() {
        this.errors = [];
        this.setupListeners();
    }
    
    setupListeners() {
        window.addEventListener('error', (e) => this.logError(e));
        window.addEventListener('unhandledrejection', (e) => this.logError(e));
    }
    
    logError(error) {
        const errorData = {
            message: error.message || error.reason,
            stack: error.error?.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.errors.push(errorData);
        
        // Send to your analytics service
        this.sendToAnalytics(errorData);
    }
    
    sendToAnalytics(errorData) {
        // Implement your analytics integration
        console.error('Error logged:', errorData);
    }
}

const errorTracker = new ErrorTracker();